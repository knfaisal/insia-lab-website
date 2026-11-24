"""Hero art for the three colour themes (blue / red / golden).
Same scene as v11 (multichannel wave surface + sampling stems on pure black), restyled
per theme after the Theme/ mood images (N1 blue nebula sparkle, N2/N4 neon-red signals
with reflection + dotted samples, N5–N7 golden glow with bokeh). Original renders; no
pixels from the references are used.

usage: python -I tools/make_hero_themes.py
writes assets/img/hero-{blue,red,gold}.webp (1920x1080) and hero-{...}-mobile.webp (900x1200)
"""
import pathlib
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from mpl_toolkits.mplot3d.art3d import Line3DCollection
from PIL import Image, ImageFilter, ImageDraw

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"

THEMES = {
    "blue": dict(ramp=["#0b1a66", "#2442C9", "#5B7BFF", "#B9C7FF", "#FFFFFF"], glow=0.9, extra="stars", grid=(0.36, 0.48, 1.0)),
    "red":  dict(ramp=["#3a0610", "#B3122A", "#FF2E48", "#FF8A95", "#FFE3E6"], glow=2.1, extra="reflect", grid=(1.0, 0.3, 0.35)),
    "gold": dict(ramp=["#3a2206", "#9A6A12", "#E0A63A", "#F6D27A", "#FFF6DC"], glow=1.3, extra="bokeh", grid=(0.25, 0.75, 0.8)),
}

def scene(ax, cmap, grid_rgb):
    x = np.linspace(0, 1, 500)
    segs, cols = [], []
    nch = 42
    for k in range(nch):
        y = k / (nch - 1)
        env = np.exp(-((x - 0.55) / 0.5) ** 2)
        z = 0.55 + 0.34 * env * np.sin(2 * np.pi * (1.15 * x + 0.55 * y) + 0.6) + 0.07 * np.sin(2 * np.pi * (3.2 * x - 1.4 * y))
        segs.append(np.column_stack([x, np.full_like(x, y), z]))
        cols.append(cmap(1.0 - 0.8 * y)[:3] + (0.95 - 0.55 * y,))
    ax.add_collection3d(Line3DCollection(segs, colors=cols, linewidths=1.0))
    xs = np.linspace(0.04, 0.96, 24)
    zs = 0.55 + 0.34 * np.exp(-((xs - 0.55) / 0.5) ** 2) * np.sin(2 * np.pi * (1.15 * xs) + 0.6) + 0.07 * np.sin(2 * np.pi * 3.2 * xs)
    ax.add_collection3d(Line3DCollection([[(a, -0.02, 0), (a, -0.02, b)] for a, b in zip(xs, zs)], colors=[cmap(0.85)[:3] + (0.55,)], linewidths=0.8))
    ax.scatter(xs, np.full_like(xs, -0.02), zs, s=12, c=[cmap(1.0)], depthshade=False)
    g = []
    for v in np.linspace(0, 1, 11):
        g.append([(v, 0, 0), (v, 1, 0)]); g.append([(0, v, 0), (1, v, 0)])
    ax.add_collection3d(Line3DCollection(g, colors=[grid_rgb + (0.16,)], linewidths=0.6))

def render(name, W, H, elev, azim, box, out):
    t = THEMES[name]
    cmap = LinearSegmentedColormap.from_list(name, t["ramp"])
    fig = plt.figure(figsize=(W / 100, H / 100), dpi=100, facecolor="black")
    ax = fig.add_axes(box, projection="3d", facecolor="black")
    ax.set_axis_off(); ax.view_init(elev=elev, azim=azim)
    ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.set_zlim(0, 1.25)
    scene(ax, cmap, t["grid"])
    fig.canvas.draw()
    img = Image.fromarray(np.asarray(fig.canvas.buffer_rgba())[..., :3].copy()); plt.close(fig)
    a = np.asarray(img, float)
    # glow (stronger for neon red / warm gold)
    for r, k in ((6, 0.9), (18, 0.45)):
        a = np.maximum(a, np.asarray(img.filter(ImageFilter.GaussianBlur(r)), float) * k * t["glow"])
    rng = np.random.default_rng(3)
    yy, xx = np.mgrid[0:H, 0:W]
    if t["extra"] == "reflect":          # N2: mirrored reflection fading below
        lum = a.sum(-1)
        rows = np.where(lum.max(1) > 60)[0]
        if len(rows):
            base = rows.max()
            h = min(H - base, int(H * 0.22))
            if h > 10:
                refl = a[base - h:base][::-1] * np.linspace(0.35, 0, h)[:, None, None]
                refl = np.asarray(Image.fromarray(np.clip(refl, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)), float)
                a[base:base + h] = np.maximum(a[base:base + h], refl)
    over = Image.new("RGB", (W, H), (0, 0, 0)); d = ImageDraw.Draw(over)
    c_hi = tuple(int(255 * v) for v in cmap(0.62 if t["extra"] == "bokeh" else 0.9)[:3])
    if t["extra"] == "stars":            # N1: sparse star flares
        for _ in range(int(W * H / 110000)):
            x0, y0 = rng.uniform(W * 0.35, W), rng.uniform(0, H * 0.75)
            L = rng.uniform(4, 30); s_ = rng.uniform(0.35, 1.0); sc = tuple(int(v * s_) for v in (230, 236, 255))
            d.line([(x0 - L, y0), (x0 + L, y0)], fill=sc, width=1)
            d.line([(x0, y0 - L * 1.6), (x0, y0 + L * 1.6)], fill=sc, width=1)
            d.ellipse([x0 - 1.5, y0 - 1.5, x0 + 1.5, y0 + 1.5], fill=(255, 255, 255))
        over = over.filter(ImageFilter.GaussianBlur(0.6))
    if t["extra"] == "bokeh":            # N5–N7: soft out-of-focus orbs
        for _ in range(int(W * H / 60000)):
            x0, y0 = rng.uniform(W * 0.4, W), rng.uniform(0, H)
            r = rng.uniform(6, 34); v = rng.uniform(0.25, 0.7)
            col = tuple(int(c * v) for c in c_hi) if rng.random() > 0.2 else (int(60 * v), int(170 * v), int(180 * v))  # a hint of teal
            d.ellipse([x0 - r, y0 - r, x0 + r, y0 + r], fill=col)
        over = over.filter(ImageFilter.GaussianBlur(9))
    a = np.maximum(a, np.asarray(over, float))
    # fade every edge to pure black (blends with the header)
    fade = np.clip(yy / (H * 0.16), 0, 1) * np.clip((H - yy) / (H * 0.06), 0, 1)
    fade *= np.clip(xx / (W * 0.10), 0, 1) * np.clip((W - xx) / (W * 0.05), 0, 1)
    a *= fade[..., None] ** 1.2
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(out, "WEBP", quality=86, method=6)
    print(out.name, out.stat().st_size // 1024, "KB")

if __name__ == "__main__":
    for name in THEMES:
        render(name, 1920, 1080, 24, -62, [0.30, -0.06, 0.80, 1.22], OUT / f"hero-{name}.webp")
        render(name, 900, 1200, 28, -58, [-0.12, 0.30, 1.24, 0.8], OUT / f"hero-{name}-mobile.webp")
