"""Hero v9 ("smooth"): the owner's hand-and-black-hole photo, kept photographic
(no scan-lines), toned black → deep blue → white, with the ring erased and a
straight, smooth 3D INSIA mark floating in the light.

Source photo: Theme/blackhole-hand.jpg (NOT published; Theme/ is gitignored).
NOTE: the photo appears to be third-party work: credit/permission needed before launch.

usage: python -I tools/make_hero_smooth.py
writes assets/img/hero-smooth.webp (1920x1080) and hero-smooth-mobile.webp (900x1100)
"""
import pathlib, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from make_blackhole import find_hole  # same ring detection as before

SRC = ROOT / "Theme" / "blackhole-hand.jpg"
OUT = ROOT / "assets" / "img"

# duotone ramp: black → deep navy → INSIA blue → soft white
RAMP = np.array([[0, 0, 0], [8, 14, 40], [36, 66, 201], [170, 186, 255], [246, 246, 242]], float)
STOPS = np.array([0.0, 0.28, 0.62, 0.86, 1.0])

def duotone(lum):
    out = np.empty(lum.shape + (3,))
    for c in range(3):
        out[..., c] = np.interp(lum, STOPS, RAMP[:, c])
    return out

def smooth_mark(size, depth_frac=0.16):
    """Straight 3D INSIA mark, rendered 4× and downsampled (smooth edges).
    White blocks, a near-black square with a thin light rim; extrusion toward the upper-right
    with a smooth light→dark gradient on the side faces; soft drop shadow."""
    S = 4
    big = size * S
    pad = int(big * (depth_frac + 0.25))
    W = big + pad * 2
    img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    u = big / 1000
    def P(x, y, dx=0, dy=0): return (pad + x * u + dx, pad + y * u + dy)
    blocks = [[(386, 41), (949, 41), (949, 949), (643, 949), (643, 346), (386, 346)],
              [(41, 386), (346, 386), (346, 949), (41, 949)]]
    square = [(41, 41), (346, 41), (346, 346), (41, 346)]
    depth = big * depth_frac
    steps = 60
    d = ImageDraw.Draw(img)
    # soft shadow
    sh = Image.new("RGBA", (W, W), (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
    for poly in blocks + [square]:
        ds.polygon([P(x, y, depth * 0.35, depth * 0.55) for x, y in poly], fill=(0, 0, 0, 150))
    sh = sh.filter(ImageFilter.GaussianBlur(big * 0.04))
    img.alpha_composite(sh)
    # extrusion: many thin layers from back (dark) to front (light) → smooth side faces
    for i in range(steps, 0, -1):
        t = i / steps
        ox, oy = depth * t * 0.9, -depth * t * 0.9
        g = int(70 + 120 * (1 - t))                       # side-face shade
        for poly in blocks:
            d.polygon([P(x, y, ox, oy) for x, y in poly], fill=(g, g, g + 6, 255))
        gs = int(25 + 45 * (1 - t))
        d.polygon([P(x, y, ox, oy) for x, y in square], fill=(gs, gs, gs + 4, 255))
    # front faces
    for poly in blocks:
        d.polygon([P(x, y) for x, y in poly], fill=(246, 246, 242, 255))
    d.polygon([P(x, y) for x, y in square], fill=(20, 20, 22, 255), outline=(220, 222, 230, 255), width=int(big * 0.012))
    # subtle top-edge highlight on the white blocks
    for poly in blocks:
        top = min(y for _, y in poly)
        xs = [x for x, y in poly if y == top]
        d.line([P(min(xs), top), P(max(xs), top)], fill=(255, 255, 255, 255), width=int(big * 0.01))
    return img.resize((W // S, W // S), Image.LANCZOS)

def compose(W, H, photo_h, cx_frac, feather_left, mark_scale=3.2):
    src = Image.open(SRC).convert("L")
    sc = photo_h / src.height
    ph = src.resize((round(src.width * sc), photo_h), Image.LANCZOS)
    raw = np.asarray(ph, float)
    cx, cy, r_in = find_hole(raw)
    lo, hi = np.percentile(raw, 2), np.percentile(raw, 99.5)
    lum = np.clip((raw - lo) / (hi - lo), 0, 1) ** 0.75

    # erase ring + streak, replace with a soft light glow (the mark becomes the light)
    yy, xx = np.mgrid[0:lum.shape[0], 0:lum.shape[1]]
    dist = np.hypot(xx - cx, yy - cy)
    ell = ((xx - cx) / (r_in * 4.4)) ** 2 + ((yy - cy) / (r_in * 2.0)) ** 2
    e = np.clip((1.0 - ell) / 0.35, 0, 1)
    blurred = np.asarray(Image.fromarray((lum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r_in * 1.4)), float) / 255
    glow = 0.85 * np.exp(-(dist / (r_in * 2.4)) ** 2)
    lum = lum * (1 - e) + np.maximum(blurred * 0.7, glow) * e
    lum = np.clip(lum, 0, 1)

    # place on black canvas, feather into black
    canvas = np.zeros((H, W))
    x0 = int(W * cx_frac - ph.width / 2); y0 = int((H - photo_h) / 2)
    xs, xe = max(0, x0), min(W, x0 + ph.width); ys, ye = max(0, y0), min(H, y0 + photo_h)
    canvas[ys:ye, xs:xe] = lum[ys - y0:ye - y0, xs - x0:xe - x0]
    Y, X = np.mgrid[0:H, 0:W]
    fx = np.clip((X - x0) / feather_left, 0, 1) * np.clip((x0 + ph.width - X) / 120, 0, 1)
    fy = np.clip((Y - y0) / 80, 0, 1) * np.clip((y0 + photo_h - Y) / 160, 0, 1)
    canvas *= (fx * fy) ** 1.2
    rgb = duotone(canvas)
    out = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert("RGBA")

    mark = smooth_mark(int(r_in * mark_scale))
    hx, hy = x0 + cx, y0 + cy
    out.alpha_composite(mark, (int(hx - mark.width / 2), int(hy - mark.height / 2)))
    return out.convert("RGB")

if __name__ == "__main__":
    a = compose(1920, 1080, photo_h=1380, cx_frac=0.70, feather_left=360)
    a.save(OUT / "hero-smooth.webp", "WEBP", quality=84, method=6)
    b = compose(900, 1100, photo_h=1200, cx_frac=0.5, feather_left=60)
    b.save(OUT / "hero-smooth-mobile.webp", "WEBP", quality=84, method=6)
    for p in ("hero-smooth.webp", "hero-smooth-mobile.webp"):
        print(p, (OUT / p).stat().st_size // 1024, "KB")
