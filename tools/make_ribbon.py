"""Aesthetic hero art: a flowing ribbon made of hundreds of thin, superimposed
waves (a 'superposition of signals'), amber-to-gold on black, inspired by the
wave posters in Theme/ (no pixels from those images are used).

usage: python -I tools/make_ribbon.py
writes assets/img/hero-ribbon.webp (1920x960) and banner-ribbon.webp (1920x300)
"""
import pathlib
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.collections import LineCollection

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"
BG = "#000000"
CMAP = LinearSegmentedColormap.from_list("amber", ["#5a1a05", "#c2410c", "#f08a2c", "#ffc773", "#fff1d6"])

def ribbon(w, h, n_lines, twists, amp, center, x_from=0.0, seed=0):
    rng = np.random.default_rng(seed)
    x = np.linspace(0.0, 1.0, 1600)
    # ribbon is born as a single thread at x_from and opens up smoothly
    t = np.clip((x - x_from) / 0.35, 0, 1); grow = t * t * (3 - 2 * t)
    lines, colors, widths = [], [], []
    for k in range(n_lines):
        s = k / (n_lines - 1)                     # position across the ribbon, 0..1
        phase = np.pi * s                         # twist: each strand shifted in phase
        env = amp * (0.04 + 0.96 * grow) * (0.55 + 0.45 * np.sin(np.pi * x) ** 0.8)
        y = (center
             + env * np.sin(2 * np.pi * twists * x + phase) * np.cos(np.pi * s - 0.6 * np.sin(3 * x))
             + 0.06 * np.sin(2 * np.pi * 0.7 * x + 1.3) )
        lines.append(np.column_stack([x, y]))
        # brightest where the ribbon folds toward the viewer
        colors.append(CMAP(0.25 + 0.75 * (0.5 + 0.5 * np.cos(2 * np.pi * s))))
        widths.append(0.5 + 0.6 * rng.random())
    return lines, colors, widths

def render(path, size, **kw):
    w, h = size
    fig = plt.figure(figsize=(w / 100, h / 100), dpi=100, facecolor=BG)
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_facecolor(BG); ax.axis("off")
    ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    lines, colors, widths = ribbon(w, h, **kw)
    # soft glow pass, then crisp strands
    ax.add_collection(LineCollection(lines, colors=colors, linewidths=[x * 6 for x in widths], alpha=0.025))
    ax.add_collection(LineCollection(lines, colors=colors, linewidths=widths, alpha=0.55))
    png = path.with_suffix(".png")
    fig.savefig(png, dpi=100, facecolor=BG); plt.close(fig)
    from PIL import Image
    Image.open(png).convert("RGB").save(path, "WEBP", quality=80, method=6); png.unlink()
    print(f"wrote {path.name} {path.stat().st_size // 1024}KB")

if __name__ == "__main__":
    render(OUT / "hero-ribbon.webp", (1920, 960), n_lines=200, twists=1.4, amp=0.30, center=0.5, x_from=0.18)
    render(OUT / "banner-ribbon.webp", (1920, 300), n_lines=120, twists=2.2, amp=0.36, center=0.5, x_from=0.0, seed=3)
