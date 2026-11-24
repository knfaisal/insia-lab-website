"""Hero v11: 3D time-frequency surface as a glowing wireframe on pure black.
Original artwork inspired by the '3D waveform on a grid' idea in Theme/ (image 7);
no pixels from the reference are used.

The surface is a smooth time–frequency map of a multi-component signal (a rising
chirp, a sinusoidal-FM tone and a short burst), drawn as blue→white wire lines
with a faint floor grid. Edges fade to pure #000 so it blends into the black header.

usage: python -I tools/make_hero_v11.py
writes assets/img/hero-v11.webp (1920x1080) and hero-v11-mobile.webp (900x1200)
"""
import pathlib
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from mpl_toolkits.mplot3d.art3d import Line3DCollection
from PIL import Image, ImageFilter

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"
CMAP = LinearSegmentedColormap.from_list("insia", ["#0b1a66", "#2442C9", "#5B7BFF", "#B9C7FF", "#FFFFFF"])

def surface(nt=140, nf=90):
    t = np.linspace(0, 1, nt); f = np.linspace(0, 1, nf)
    T, F = np.meshgrid(t, f)
    z = 1.00 * np.exp(-((F - (0.15 + 0.6 * T)) / 0.05) ** 2)                       # rising chirp ridge
    z += 0.75 * np.exp(-((F - (0.72 + 0.10 * np.sin(2 * np.pi * 1.6 * T))) / 0.04) ** 2)   # sinusoidal FM
    z += 0.55 * np.exp(-((T - 0.62) / 0.035) ** 2) * np.exp(-((F - 0.35) / 0.22) ** 2)      # short burst
    z += 0.05 * np.sin(9 * T) * np.cos(7 * F)                                       # gentle texture
    return T, F, z

def render(W, H, elev, azim, xlim, ylim, zoom_box, out):
    T, F, Z = surface()
    fig = plt.figure(figsize=(W / 100, H / 100), dpi=100, facecolor="black")
    ax = fig.add_axes(zoom_box, projection="3d", facecolor="black")
    ax.set_axis_off(); ax.view_init(elev=elev, azim=azim)
    ax.set_xlim(*xlim); ax.set_ylim(*ylim); ax.set_zlim(0, 1.25)
    # v11b: one smooth sweeping wave surface (multichannel signal, like EEG channels):
    # each line is a channel; front = white, back = deep blue
    x = np.linspace(0, 1, 500)
    segs, cols = [], []
    nch = 42
    for k in range(nch):
        y = k / (nch - 1)
        env = np.exp(-((x - 0.55) / 0.5) ** 2)
        z = 0.55 + 0.34 * env * np.sin(2 * np.pi * (1.15 * x + 0.55 * y) + 0.6) + 0.07 * np.sin(2 * np.pi * (3.2 * x - 1.4 * y))
        segs.append(np.column_stack([x, np.full_like(x, y), z]))
        cols.append(CMAP(1.0 - 0.8 * y)[:3] + (0.95 - 0.55 * y,))
    ax.add_collection3d(Line3DCollection(segs, colors=cols, linewidths=1.0))
    # sampling stems ("lollipops") on the front channel: a discrete-time signal
    xs = np.linspace(0.04, 0.96, 24)
    zs = 0.55 + 0.34 * np.exp(-((xs - 0.55) / 0.5) ** 2) * np.sin(2 * np.pi * (1.15 * xs) + 0.6) + 0.07 * np.sin(2 * np.pi * 3.2 * xs)
    stems = [[(a, -0.02, 0), (a, -0.02, b)] for a, b in zip(xs, zs)]
    ax.add_collection3d(Line3DCollection(stems, colors=[(1, 1, 1, 0.55)], linewidths=0.8))
    ax.scatter(xs, np.full_like(xs, -0.02), zs, s=10, c="white", depthshade=False)
    # faint floor grid
    g = []
    for v in np.linspace(0, 1, 11):
        g.append([(v, 0, 0), (v, 1, 0)]); g.append([(0, v, 0), (1, v, 0)])
    ax.add_collection3d(Line3DCollection(g, colors=[(0.36, 0.48, 1.0, 0.18)], linewidths=0.6))
    fig.canvas.draw()
    img = Image.fromarray(np.asarray(fig.canvas.buffer_rgba())[..., :3].copy()); plt.close(fig)
    # soft glow + fade every edge to pure black so it melts into the header/page
    glow = img.filter(ImageFilter.GaussianBlur(6))
    a = np.maximum(np.asarray(img, float), np.asarray(glow, float) * 0.9)
    yy, xx = np.mgrid[0:H, 0:W]
    fade = np.clip(yy / (H * 0.18), 0, 1) * np.clip((H - yy) / (H * 0.12), 0, 1)
    fade *= np.clip(xx / (W * 0.10), 0, 1) * np.clip((W - xx) / (W * 0.06), 0, 1)
    a *= fade[..., None] ** 1.3
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(out, "WEBP", quality=86, method=6)
    print(out.name, out.stat().st_size // 1024, "KB")

if __name__ == "__main__":
    render(1920, 1080, elev=24, azim=-62, xlim=(0.0, 1.0), ylim=(0.0, 1.0), zoom_box=[0.30, -0.06, 0.80, 1.22], out=OUT / "hero-v11.webp")
    render(900, 1200, elev=28, azim=-58, xlim=(-0.05, 1.05), ylim=(-0.05, 1.05), zoom_box=[-0.12, 0.30, 1.24, 0.8], out=OUT / "hero-v11-mobile.webp")
