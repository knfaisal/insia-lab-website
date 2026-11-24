"""Render the site's hero/banner artwork: the time-frequency (micro-Doppler)
signature of a simulated walking person seen by a radar, a nod to the lab's
radar human-activity-recognition work.

usage: python -I tools/make_hero.py
writes assets/img/hero-tfr.webp (2400x1200) and assets/img/banner-tfr.webp (2400x360).
Deterministic (fixed seed); tweak parameters and re-run.
"""
import pathlib
import numpy as np
from scipy import signal
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from PIL import Image, ImageFilter

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"

# INSIA duotone: black -> deep navy -> logo blue -> sky -> white
CMAP = LinearSegmentedColormap.from_list("insia", [
    (0.00, "#000000"), (0.30, "#03061a"), (0.52, "#0c1a6e"),
    (0.70, "#2438e0"), (0.86, "#6fa8ff"), (0.96, "#dbe9ff"), (1.00, "#ffffff")])

def micro_doppler(fs, T, seed, gait=0.9, v=90.0):
    """Complex baseband return of a walking body: torso + limbs + many weak scatterers."""
    rng = np.random.default_rng(seed)
    t = np.arange(int(fs * T)) / fs
    x = np.zeros(t.size, complex)
    def part(amp, A, phase, harm=0.0, f0=v):
        f = f0 + A * np.sin(2 * np.pi * gait * t + phase) + harm * A * np.sin(4 * np.pi * gait * t + 2 * phase)
        ph = 2 * np.pi * np.cumsum(f) / fs
        return amp * np.exp(1j * ph)
    x += part(1.0, 35, 0)                                   # torso
    for side in (0, np.pi):                                 # left / right
        x += part(0.55, 260, side, 0.15)                    # thighs
        x += part(0.40, 420, side + 0.3, 0.25)              # shins
        x += part(0.28, 560, side + 0.5, 0.35)              # feet
        x += part(0.35, 210, side + np.pi, 0.1)             # arms (opposite phase)
        x += part(0.22, 300, side + np.pi + 0.2, 0.2)       # hands
    for _ in range(40):                                     # weak body scatterers fill the envelope
        A = rng.uniform(20, 520); ph = rng.uniform(0, 2 * np.pi)
        x += part(rng.uniform(0.03, 0.12), A, ph, rng.uniform(0, .3))
    x *= 1 + 0.25 * np.sin(2 * np.pi * 0.13 * t)            # slow range-dependent fading
    x += 0.10 * (rng.standard_normal(t.size) + 1j * rng.standard_normal(t.size))
    return x

def render(path, size, T, seed, band, gamma, lo_pct):
    fs = 2000
    x = micro_doppler(fs, T, seed)
    f, tt, Z = signal.stft(x, fs=fs, window="hann", nperseg=256, noverlap=248, return_onesided=False)
    Z = np.fft.fftshift(Z, axes=0); f = np.fft.fftshift(f)
    S = 20 * np.log10(np.abs(Z) + 1e-9)
    S = S[(f >= band[0]) & (f <= band[1])]
    lo, hi = np.percentile(S, lo_pct), np.percentile(S, 99.8)
    S = np.clip((S - lo) / (hi - lo), 0, 1) ** gamma
    w, h = size
    fig = plt.figure(figsize=(w / 100, h / 100), dpi=100)
    ax = fig.add_axes([0, 0, 1, 1]); ax.axis("off")
    ax.imshow(S, origin="lower", aspect="auto", cmap=CMAP, interpolation="bicubic")
    png = path.with_suffix(".png"); fig.savefig(png, dpi=100); plt.close(fig)
    im = Image.open(png).convert("RGB")
    im = Image.blend(im, im.filter(ImageFilter.GaussianBlur(5)), 0.3)   # soft bloom
    im.save(path, "WEBP", quality=84, method=6); png.unlink()
    print(f"wrote {path.name} {im.size} {path.stat().st_size // 1024}KB")

if __name__ == "__main__":
    render(OUT / "hero-tfr.webp", (2400, 1200), T=4.2, seed=7, band=(-560, 760), gamma=1.15, lo_pct=30)
    render(OUT / "banner-tfr.webp", (2400, 360), T=11, seed=3, band=(-420, 640), gamma=1.25, lo_pct=35)
