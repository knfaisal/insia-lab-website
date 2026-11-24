"""Original 'scan-line engraving' artwork in the style of the Theme/ reference
(white horizontal strokes on black): a ringed planet + moon floating in a field
of flowing topographic contours, with a faint panel grid. Generated from math;
no pixels from the reference are used.

usage: python -I tools/make_engraving.py
writes assets/img/hero-engraving.webp (1920x1080) and banner-engraving.webp (1920x320)
"""
import pathlib
import numpy as np
from PIL import Image

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"

def fbm(x, y, seed, octaves=5):
    """Smooth pseudo-noise: domain-warped sum of sines (cheap, deterministic)."""
    rng = np.random.default_rng(seed)
    v = np.zeros_like(x); amp = 1.0; f = 1.0
    for _ in range(octaves):
        a, b, c, d = rng.uniform(0, 2 * np.pi, 4)
        kx, ky = rng.uniform(.6, 1.4, 2)
        v += amp * np.sin(f * kx * x + 1.7 * np.sin(f * ky * y + a) + b) * np.cos(f * ky * y + 1.3 * np.sin(f * kx * x + c) + d)
        amp *= .55; f *= 1.9
    return v

def scene(W, H, seed=4, planet=True):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    s = min(W, H)
    x, y = xx / s, yy / s                               # normalised coords
    I = np.zeros((H, W))

    # 1) flowing contour field (topographic lines)
    F = fbm(x * 1.6, y * 2.4, seed) + 0.25 * fbm(x * 4, y * 5, seed + 1, 3)   # long, flowing bands
    k = 5.0
    d = np.abs((F * k) % 1.0 - 0.5)                     # distance to nearest contour (0..0.5)
    contour = np.exp(-((0.5 - d) / 0.09) ** 2)          # bright where frac≈0/1 → a line
    I += 0.48 * contour + 0.06 * (F - F.min()) / (F.max() - F.min())

    if planet:
        # 2) planet (lit from upper-left) with banded texture
        cx, cy, R = 0.62 * W / s, 0.52 * H / s, 0.30
        dx, dy = (x - cx) / R, (y - cy) / R
        r2 = dx * dx + dy * dy
        inside = r2 < 1
        nz = np.sqrt(np.clip(1 - r2, 0, 1))
        light = np.clip(-0.55 * dx - 0.45 * dy + 0.70 * nz, 0, 1)
        bands = 0.5 + 0.5 * np.sin(dy * 22 + 2.0 * fbm(dx * 2, dy * 2, seed + 7, 3))
        body = (0.18 + 0.82 * light) * (0.55 + 0.45 * bands)
        rim = np.exp(-((np.sqrt(r2) - 1) / 0.012) ** 2)
        I = np.where(inside, 0.95 * body, I) + 0.9 * rim

        # 3) rings: tilted ellipse bands; hide the back half behind the planet
        t = np.deg2rad(-28)
        rx = (x - cx) * np.cos(t) - (y - cy) * np.sin(t)
        ry = (x - cx) * np.sin(t) + (y - cy) * np.cos(t)
        re = np.sqrt((rx / (R * 2.25)) ** 2 + (ry / (R * 0.48)) ** 2)
        band = (re > 0.55) & (re < 1.0)
        ringtex = (0.5 + 0.5 * np.sin(re * 140)) * (0.75 + 0.25 * np.sin(re * 37 + 1))
        gap = np.exp(-((re - 0.78) / 0.018) ** 2)       # Cassini-style division
        ring = np.where(band, ringtex * (1 - 0.9 * gap), 0)
        behind = inside & (ry < 0)                      # far side of ring, occluded by planet
        I = np.where(band & ~behind, np.maximum(I * 0.25, 0.9 * ring), I)
        # planet shadow cast on the near ring
        I = np.where(band & (ry > 0) & (rx > 0) & (np.abs(rx) < R * 0.9), I * 0.45, I)

        # 4) small moon, upper left
        mx, my, mr = 0.24 * W / s, 0.20 * H / s, 0.065
        m2 = ((x - mx) ** 2 + (y - my) ** 2) / mr ** 2
        mlight = np.clip(-0.6 * (x - mx) / mr - 0.4 * (y - my) / mr + 0.7 * np.sqrt(np.clip(1 - m2, 0, 1)), 0, 1)
        I = np.where(m2 < 1, 0.15 + 0.75 * mlight, I) + 0.7 * np.exp(-((np.sqrt(m2) - 1) / 0.03) ** 2)

    return np.clip(I, 0, 1)

def engrave(I, seed=0, pitch=3, gamma=1.25):
    """Render intensity as horizontal scan-line dashes (the reference's look)."""
    H, W = I.shape
    rng = np.random.default_rng(seed)
    out = np.zeros((H, W), np.float32)
    rows = np.arange(0, H, pitch)
    # dashes: random field smoothed horizontally so 'on' runs form short strokes
    noise = rng.random((len(rows), W))
    kernel = np.ones(5) / 5
    noise = np.apply_along_axis(lambda r: np.convolve(r, kernel, mode="same"), 1, noise)
    noise = (noise - noise.min()) / (noise.max() - noise.min())
    on = noise < (I[rows] ** gamma)
    out[rows] = on * (0.65 + 0.35 * I[rows])            # brighter strokes in bright areas
    # faint panel grid + one 'glitch' vertical line, as in the reference
    g = 0.11
    for gx in np.linspace(0, W, 5)[1:-1].astype(int): out[:, gx] = np.maximum(out[:, gx], g)
    for gy in np.linspace(0, H, 4)[1:-1].astype(int): out[gy, :] = np.maximum(out[gy, :], g)
    gl = int(W * 0.985); out[int(H * .42):, gl] = 0.8
    return out

def save(arr, path):
    rgb = (np.stack([arr] * 3, -1) * np.array([236, 236, 230])).astype(np.uint8)  # warm white on black
    Image.fromarray(rgb).save(path, "WEBP", quality=78, method=6)
    print(f"wrote {path.name} {path.stat().st_size // 1024}KB")

if __name__ == "__main__":
    save(engrave(scene(1920, 1080, seed=4)), OUT / "hero-engraving.webp")
    save(engrave(scene(1920, 320, seed=9, planet=False), seed=2), OUT / "banner-engraving.webp")
