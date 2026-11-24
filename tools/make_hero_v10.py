"""Hero v10: "signal through the mark". Fully generated (no photo).

- Background: black with a deep-navy glow and a smooth ribbon of thin superimposed
  waves in INSIA blue → white, flowing across the frame (a signal).
- A separate transparent PNG of the 3D INSIA mark, layered on top in HTML/CSS so it
  can float smoothly.

usage: python -I tools/make_hero_v10.py
writes assets/img/hero-v10.webp (1920x1080), hero-v10-mobile.webp (900x1200),
       assets/img/insia-mark-3d.webp (transparent, ~900px)
"""
import pathlib, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.collections import LineCollection
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from make_hero_smooth import smooth_mark  # same clean 3D mark

OUT = ROOT / "assets" / "img"
BLUE = LinearSegmentedColormap.from_list("insia", ["#0d1a5c", "#2442C9", "#5B7BFF", "#AFC0FF", "#FFFFFF"])

def waves(n, twists, amp, center, x_from, seed=0):
    rng = np.random.default_rng(seed)
    x = np.linspace(0, 1, 1600)
    t = np.clip((x - x_from) / 0.35, 0, 1); grow = t * t * (3 - 2 * t)          # born as a thread
    lines, cols, wid = [], [], []
    for k in range(n):
        s = k / (n - 1)
        env = amp * (0.05 + 0.95 * grow) * (0.55 + 0.45 * np.sin(np.pi * x) ** 0.8)
        y = center + env * np.sin(2 * np.pi * twists * x + np.pi * s) * np.cos(np.pi * s - 0.6 * np.sin(3 * x)) + 0.05 * np.sin(2 * np.pi * 0.6 * x + 1.1)
        lines.append(np.column_stack([x, y]))
        cols.append(BLUE(0.2 + 0.8 * (0.5 + 0.5 * np.cos(2 * np.pi * s))))
        wid.append(0.45 + 0.5 * rng.random())
    return lines, cols, wid

def background(W, H, glow_xy, ribbon):
    yy, xx = np.mgrid[0:H, 0:W]
    gx, gy = glow_xy
    d = np.hypot((xx - gx * W) / W, (yy - gy * H) / H * 0.9)
    glow = np.exp(-(d / 0.42) ** 2)                                           # deep-navy glow
    base = np.stack([6 + 22 * glow, 9 + 40 * glow, 18 + 120 * glow], -1)
    fig = plt.figure(figsize=(W / 100, H / 100), dpi=100)
    ax = fig.add_axes([0, 0, 1, 1]); ax.axis("off"); ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    ax.imshow(base.astype(np.uint8), extent=[0, 1, 0, 1], aspect="auto", origin="upper")
    l, c, w = waves(**ribbon)
    ax.add_collection(LineCollection(l, colors=c, linewidths=[v * 7 for v in w], alpha=0.03))   # soft glow pass
    ax.add_collection(LineCollection(l, colors=c, linewidths=w, alpha=0.5))
    fig.canvas.draw()
    img = Image.fromarray(np.asarray(fig.canvas.buffer_rgba())[..., :3].copy())
    plt.close(fig)
    return img

if __name__ == "__main__":
    bg = background(1920, 1080, glow_xy=(0.72, 0.48),
                    ribbon=dict(n=180, twists=1.3, amp=0.22, center=0.47, x_from=0.08, seed=2))
    bg.save(OUT / "hero-v10.webp", "WEBP", quality=86, method=6)
    bgm = background(900, 1200, glow_xy=(0.5, 0.3),
                     ribbon=dict(n=150, twists=1.1, amp=0.14, center=0.33, x_from=0.0, seed=5))
    bgm.save(OUT / "hero-v10-mobile.webp", "WEBP", quality=86, method=6)
    mark = smooth_mark(720, depth_frac=0.18)
    mark.save(OUT / "insia-mark-3d.webp", "WEBP", quality=92, method=6, lossless=False)
    for p in ("hero-v10.webp", "hero-v10-mobile.webp", "insia-mark-3d.webp"):
        print(p, Image.open(OUT / p).size, (OUT / p).stat().st_size // 1024, "KB")
