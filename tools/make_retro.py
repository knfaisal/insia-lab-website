"""Retro artwork: re-render the radar micro-Doppler signature (see make_hero.py)
as a halftone dot-screen print on black with film grain, in the style of the
Theme/ mood board. Writes assets/img/hero-retro.webp and banner-retro.webp.

usage: python -I tools/make_retro.py
"""
import pathlib, sys
import numpy as np
from scipy import signal
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from make_hero import micro_doppler  # same physics as the v3 hero

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"
INK_BG = (14, 13, 11)

def tfr(T, seed, band, lo_pct, gamma):
    fs = 2000
    x = micro_doppler(fs, T, seed)
    f, t, Z = signal.stft(x, fs=fs, window="hann", nperseg=256, noverlap=248, return_onesided=False)
    Z = np.fft.fftshift(Z, axes=0); f = np.fft.fftshift(f)
    S = 20 * np.log10(np.abs(Z) + 1e-9)[(f >= band[0]) & (f <= band[1])]
    lo, hi = np.percentile(S, lo_pct), np.percentile(S, 99.7)
    return np.flipud(np.clip((S - lo) / (hi - lo), 0, 1) ** gamma)

def halftone(S, size, cell, colors, seed=1):
    """Dot-screen: radius ~ sqrt(intensity); colour ramps from dim to bright."""
    W, H = size
    img = Image.fromarray((S * 255).astype(np.uint8)).resize((W // cell, H // cell), Image.BICUBIC)
    a = np.asarray(img, float) / 255
    scale = 4
    canvas = Image.new("RGB", (W * scale, H * scale), INK_BG)
    d = ImageDraw.Draw(canvas)
    c0, c1 = np.array(colors[0]), np.array(colors[1])
    for j in range(a.shape[0]):
        for i in range(a.shape[1]):
            v = a[j, i]
            if v < 0.04: continue
            r = (cell * scale / 2) * min(1.0, np.sqrt(v) * 1.05)
            cx, cy = (i + .5) * cell * scale, (j + .5) * cell * scale
            col = tuple(int(x) for x in c0 + (c1 - c0) * min(1, v * 1.2))
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
    canvas = canvas.resize((W, H), Image.LANCZOS)
    # film grain + slight print softness
    rng = np.random.default_rng(seed)
    g = rng.normal(0, 0, (H, W, 1))  # grain is applied site-wide in CSS instead
    arr = np.clip(np.asarray(canvas, float) + g, 0, 255).astype(np.uint8)
    return Image.fromarray(arr).filter(ImageFilter.GaussianBlur(0.4))

if __name__ == "__main__":
    amber = [(120, 46, 12), (255, 214, 160)]           # deep amber -> cream highlight
    S = tfr(T=4.2, seed=7, band=(-560, 760), lo_pct=35, gamma=1.1)
    im = halftone(S, (1920, 960), 10, amber)
    im.save(OUT / "hero-retro.webp", "WEBP", quality=70, method=6)
    S2 = tfr(T=11, seed=3, band=(-420, 640), lo_pct=38, gamma=1.2)
    im2 = halftone(S2, (1920, 288), 8, amber, seed=2)
    im2.save(OUT / "banner-retro.webp", "WEBP", quality=70, method=6)
    for p in ("hero-retro.webp", "banner-retro.webp"):
        print(p, (OUT / p).stat().st_size // 1024, "KB")
