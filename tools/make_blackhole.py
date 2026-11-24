"""Hero artwork v7: the owner's 'hand reaching for a black hole' photo, re-rendered
in the site's scan-line engraving style, with the INSIA mark set inside the hole.

Source photo: Theme/blackhole-hand.jpg (NOT published; Theme/ is gitignored).
NOTE: the photo appears to be third-party work: credit/permission needed before going live.

usage: python -I tools/make_blackhole.py
writes assets/img/hero-blackhole.webp (1920x1080) and hero-blackhole-mobile.webp (900x1100)
"""
import pathlib, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from make_engraving import engrave  # identical stroke treatment to the v6 theme

SRC = ROOT / "Theme" / "blackhole-hand.jpg"
OUT = ROOT / "assets" / "img"
INK = np.array([236, 236, 230])          # warm white strokes
BLUE = np.array([61, 91, 255])           # logo square #3D5BFF

def find_hole(lum):
    H, W = lum.shape
    yy, xx = np.mgrid[0:H, 0:W]
    m = (lum > 235) & (yy < H * 0.45)
    cy, cx = yy[m].mean(), xx[m].mean()
    r = np.hypot(yy[m] - cy, xx[m] - cx)
    return cx, cy, np.percentile(r, 10)   # inner edge of the bright ring

def logo_masks(size):
    """INSIA mark (traced from assets/img/logo.png, 1000-unit grid) → (blocks mask, blue-square mask)."""
    s = size / 1000
    blocks = Image.new("L", (size, size), 0); blue = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(blocks); db = ImageDraw.Draw(blue)
    d.polygon([(386*s, 41*s), (949*s, 41*s), (949*s, 949*s), (643*s, 949*s), (643*s, 346*s), (386*s, 346*s)], fill=255)
    d.rectangle([41*s, 386*s, 346*s, 949*s], fill=255)
    db.rectangle([41*s, 41*s, 346*s, 346*s], fill=255)
    return np.asarray(blocks, float) / 255, np.asarray(blue, float) / 255

def linescreen(I, pitch=3, seed=5):
    """Photo-friendly engraving: one bright row every `pitch` px whose brightness follows
    the image (plus a little dash noise), so faces/hands stay readable. Adds the same
    faint panel grid + glitch line as engrave()."""
    H, W = I.shape
    rng = np.random.default_rng(seed)
    out = np.zeros((H, W), np.float32)
    rows = np.arange(0, H, pitch)
    noise = rng.random((len(rows), W))
    noise = np.apply_along_axis(lambda r: np.convolve(r, np.ones(7) / 7, mode="same"), 1, noise)
    dash = np.where(I[rows] < 0.35, noise > 0.45, 1.0)          # break up only the dim strokes
    out[rows] = I[rows] * (0.88 + 0.12 * noise) * dash
    g = 0.10
    for gx in np.linspace(0, W, 5)[1:-1].astype(int): out[:, gx] = np.maximum(out[:, gx], g)
    for gy in np.linspace(0, H, 4)[1:-1].astype(int): out[gy, :] = np.maximum(out[gy, :], g)
    out[int(H * .42):, int(W * .985)] = 0.8
    return out

def tone(lum):
    """Sharpen edges (hand, book spines) and compress the halo so the ring stays distinct."""
    img = Image.fromarray((lum * 255).astype(np.uint8))
    sharp = np.asarray(img.filter(ImageFilter.UnsharpMask(radius=6, percent=160, threshold=2)), float) / 255
    hi = sharp > 0.7
    sharp = np.where(hi, 0.7 + (sharp - 0.7) * 0.55, sharp)     # highlight roll-off
    return np.clip(sharp / sharp.max(), 0, 1)

def compose(W, H, photo_h, photo_cx_frac, feather_left, scale_mark=1.0):
    src = Image.open(SRC).convert("RGB")
    sc = photo_h / src.height
    ph = src.resize((round(src.width * sc), photo_h), Image.LANCZOS)
    raw = np.asarray(ph.convert("L"), float)
    lo, hi = np.percentile(raw, 2), np.percentile(raw, 99.5)
    lum_ph = tone(np.clip((raw - lo) / (hi - lo), 0, 1) ** 0.62)   # stretch levels, lift shadows, sharpen
    cx, cy, r_in = find_hole(np.asarray(ph.convert("L"), float))

    # place photo on a black canvas, feathered into the black
    canvas = np.zeros((H, W))
    x0 = int(W * photo_cx_frac - ph.width / 2); y0 = int((H - photo_h) / 2)
    xs, xe = max(0, x0), min(W, x0 + ph.width); ys, ye = max(0, y0), min(H, y0 + photo_h)
    canvas[ys:ye, xs:xe] = lum_ph[ys - y0:ye - y0, xs - x0:xe - x0]
    yy, xx = np.mgrid[0:H, 0:W]
    fx = np.clip((xx - x0) / feather_left, 0, 1) * np.clip((x0 + ph.width - xx) / 120, 0, 1)
    fy = np.clip((yy - y0) / 80, 0, 1) * np.clip((y0 + photo_h - yy) / 160, 0, 1)
    canvas *= (fx * fy) ** 1.2
    hx, hy = x0 + cx, y0 + cy

    I = np.clip(canvas, 0, 1)
    dist = np.hypot(xx - hx, yy - hy)

    # v8: erase the ring, dark disc and light streak; fill with a soft light glow (the mark is the light)
    ell = ((xx - hx) / (r_in * 4.4)) ** 2 + ((yy - hy) / (r_in * 2.0)) ** 2
    e = np.clip((1.0 - ell) / 0.35, 0, 1)                         # soft-edged erase mask
    blurred = np.asarray(Image.fromarray((I * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r_in * 1.4)), float) / 255
    glow = 0.80 * np.exp(-(dist / (r_in * 2.3)) ** 2)
    I = I * (1 - e) + np.maximum(blurred * 0.7, glow) * e

    out = linescreen(I)   # continuous scan-line strokes (keeps photo detail) + panel grid + glitch line
    out = np.maximum(out, (0.45 * np.exp(-(dist / (r_in * 1.5)) ** 2)).astype(np.float32))  # light behind the mark

    rgb = (out[..., None] * INK).astype(float)

    # the INSIA mark: 3D pixel-voxel extrusion, slightly pixelated, floating in the light
    size = int(r_in * 3.0 * scale_mark)
    mark = pixel_mark_3d(size)                                   # RGBA, float 0..1
    lx, ly = int(hx - mark.shape[1] / 2), int(hy - mark.shape[0] / 2)   # centre the (sheared) mark
    sub = rgb[ly:ly + mark.shape[0], lx:lx + mark.shape[1]]
    a = mark[..., 3:4][: sub.shape[0], : sub.shape[1]]
    scan = (0.84 + 0.16 * (np.arange(sub.shape[0]) % 3 != 2))[:, None, None]   # faint scan-lines blend it in
    sub[:] = sub * (1 - a) + (mark[..., :3][: sub.shape[0], : sub.shape[1]] * 255 * scan) * a
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)), (hx, hy, r_in, size)

def pixel_mark_3d(size, grid=24, depth=6, slant=0.42):
    """INSIA mark as a black-and-white voxel extrusion on an exact 24-unit pixel grid
    (keeps the logo's 1-unit gaps), sheared like italic type so it looks like it's
    sliding, then upscaled nearest-neighbour (slightly pixelated).
    White blocks; the square is a black face with a white pixel outline. Side faces
    step from light to dark grey with depth."""
    S = grid + depth + 1
    rgba = np.zeros((S, S, 4))
    # logo on the 24-grid: square 0–7, 1-unit gap, top bar 9–23, right leg 16–23, left leg rows 9–23
    BLOCKS = [(9, 0, 23, 7), (16, 8, 23, 23), (0, 9, 7, 23)]     # (x0, y0, x1, y1) inclusive
    SQUARE = (0, 0, 7, 7)
    def shapes(off_x, off_y):
        b = np.zeros((S, S), bool); q = np.zeros((S, S), bool)
        for x0, y0, x1, y1 in BLOCKS: b[y0 + off_y:y1 + off_y + 1, x0 + off_x:x1 + off_x + 1] = True
        x0, y0, x1, y1 = SQUARE; q[y0 + off_y:y1 + off_y + 1, x0 + off_x:x1 + off_x + 1] = True
        return b, q
    white = np.array([244, 244, 238]) / 255
    for k in range(depth, 0, -1):                                # back layers first
        b, q = shapes(k, depth - k + 1)
        shade = 0.22 + 0.42 * (1 - k / depth)                    # far = dark grey, near = light grey
        rgba[b, :3] = white * shade; rgba[b, 3] = 1
        rgba[q, :3] = white * shade * 0.55; rgba[q, 3] = 1       # the square's sides are darker
    b, q = shapes(0, depth + 1)                                  # front faces
    rgba[b, :3] = white; rgba[b, 3] = 1
    rgba[q, :3] = np.array([18, 18, 18]) / 255; rgba[q, 3] = 1   # black square face…
    edge = q & ~(np.roll(q, 1, 0) & np.roll(q, -1, 0) & np.roll(q, 1, 1) & np.roll(q, -1, 1))
    rgba[edge, :3] = white                                       # …with a white pixel outline
    top = np.zeros_like(b); top[1:] = (b | q)[1:] & ~(b | q)[:-1]
    rgba[top & b, :3] = 1.0                                      # lit top edges
    # italic shear: each row slides right in proportion to its height → "sliding" look
    shift = np.round((S - 1 - np.arange(S)) * slant).astype(int)
    Wd = S + shift.max()
    sheared = np.zeros((S, Wd, 4))
    for y in range(S): sheared[y, shift[y]:shift[y] + S] = rgba[y]
    px = max(1, round(size / grid))
    return np.kron(sheared, np.ones((px, px, 1)))                # nearest-neighbour upscale → pixelated

if __name__ == "__main__":
    im, info = compose(1920, 1080, photo_h=1380, photo_cx_frac=0.70, feather_left=360)
    im.save(OUT / "hero-blackhole.webp", "WEBP", quality=80, method=6)
    print("desktop", [round(v) for v in info], (OUT / "hero-blackhole.webp").stat().st_size // 1024, "KB")
    im2, info2 = compose(900, 1100, photo_h=1200, photo_cx_frac=0.5, feather_left=60, scale_mark=1.0)
    im2.save(OUT / "hero-blackhole-mobile.webp", "WEBP", quality=80, method=6)
    print("mobile", [round(v) for v in info2], (OUT / "hero-blackhole-mobile.webp").stat().st_size // 1024, "KB")
