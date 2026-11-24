/* Animated hero (design.md §6m)
   A live version of the multichannel wave surface: 42 channels of a travelling wave,
   with a stem plot along the front edge whose stems rise and fall with the sampled
   amplitude. Colours follow the blue / red / gold theme (html[data-accent]).
   Falls back to the static hero-{accent}.webp when JS is off; draws a single still
   frame when the visitor prefers reduced motion; pauses when off-screen or hidden. */
(() => {
  const hero = document.querySelector(".hero-v11");
  if (!hero || !window.CanvasRenderingContext2D) return;

  const RAMPS = {
    blue: ["#0b1a66", "#2442C9", "#5B7BFF", "#B9C7FF", "#FFFFFF"],
    red:  ["#3a0610", "#B3122A", "#FF2E48", "#FF8A95", "#FFE3E6"],
    gold: ["#3a2206", "#9A6A12", "#E0A63A", "#F6D27A", "#FFF6DC"],
  };
  const GRID = { blue: "92,122,255", red: "255,77,90", gold: "64,190,204" };
  const GLOW = { blue: 0.55, red: 0.95, gold: 0.7 };

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const ramp = (stops, t) => {
    t = Math.min(1, Math.max(0, t)) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(t)), f = t - i;
    const a = hex(stops[i]), b = hex(stops[i + 1]);
    return a.map((v, k) => Math.round(v + (b[k] - v) * f));
  };

  // --- canvases: main drawing + a quarter-size copy blurred by CSS for the glow
  const cv = document.createElement("canvas");
  const gl = document.createElement("canvas");
  cv.className = "hero-wave"; gl.className = "hero-wave hero-wave-glow";
  cv.setAttribute("aria-hidden", "true"); gl.setAttribute("aria-hidden", "true");
  hero.prepend(gl); hero.prepend(cv);
  const ctx = cv.getContext("2d"), gtx = gl.getContext("2d");
  hero.classList.add("wave-on");

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let W = 0, H = 0, dpr = 1, mobile = false, accent = "blue";
  let cols = [], fit = null, stars = [], orbs = [];

  // --- 3D → 2D (same view as the static render: elev 24°, azim −62°)
  const AZ = -62 * Math.PI / 180, EL = 24 * Math.PI / 180;
  const ca = Math.cos(AZ), sa = Math.sin(AZ), ce = Math.cos(EL), se = Math.sin(EL);
  const ZS = 0.6; // z is drawn shorter than x/y, like matplotlib's 4:4:3 box
  const proj = (x, y, z) => {
    const px = x - 0.5, py = y - 0.5, pz = (z - 0.6) * ZS;
    const d = px * ca + py * sa;            // towards the viewer
    const p = 1 / (1 - d * 0.22);           // mild perspective
    return [(-px * sa + py * ca) * p, (pz * ce - d * se) * p];
  };

  const NCH = 42, NPT = 150, NST = 24, Z0 = 0.55, FRONT = -0.02;

  const surf = (x, y, t) => {
    const env = Math.exp(-(((x - 0.55) / 0.5) ** 2));
    const breathe = 0.85 + 0.15 * Math.sin(t * 0.35);
    return Z0 + 0.34 * breathe * env * Math.sin(2 * Math.PI * (1.15 * x + 0.55 * y) - t * 1.1 + 0.6)
              + 0.07 * Math.sin(2 * Math.PI * (3.2 * x - 1.4 * y) + t * 1.7);
  };

  function layout() {
    const r = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    mobile = W <= 900;
    cv.width = W * dpr; cv.height = H * dpr;
    gl.width = Math.ceil(W / 4); gl.height = Math.ceil(H / 4);
    // where the scene sits: right side on desktop, top on phones
    const box = mobile ? [-0.06 * W, 0.05 * H, 1.06 * W, 0.56 * H] : [0.4 * W, 0.12 * H, 1.04 * W, 0.98 * H];
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const x of [0, 1]) for (const y of [FRONT, 1]) for (const z of [0, 1.25]) {
      const [u, v] = proj(x, y, z); x0 = Math.min(x0, u); x1 = Math.max(x1, u); y0 = Math.min(y0, v); y1 = Math.max(y1, v);
    }
    const s = Math.min((box[2] - box[0]) / (x1 - x0), (box[3] - box[1]) / (y1 - y0));
    const ox = (box[0] + box[2]) / 2 - s * (x0 + x1) / 2, oy = (box[1] + box[3]) / 2 + s * (y0 + y1) / 2;
    fit = (x, y, z) => { const [u, v] = proj(x, y, z); return [ox + s * u, oy - s * v]; };
    // decorations, seeded so they don't jump on resize
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    stars = Array.from({ length: Math.round(W * H / 52000) }, () => ({
      x: (mobile ? 0 : 0.4 * W) + rnd() * (mobile ? W : 0.6 * W), y: rnd() * H * (mobile ? 0.55 : 0.75),
      L: 3 + rnd() * 14, b: 0.3 + rnd() * 0.7, w: 0.6 + rnd() * 1.6, ph: rnd() * 6.3 }));
    orbs = Array.from({ length: Math.round(W * H / 38000) }, () => ({
      x: (mobile ? 0 : 0.42 * W) + rnd() * (mobile ? W : 0.58 * W), y: rnd() * H * (mobile ? 0.6 : 1),
      r: 5 + rnd() * 26, b: 0.12 + rnd() * 0.3, sp: 4 + rnd() * 10, ph: rnd() * 6.3, teal: rnd() < 0.2 }));
  }

  function palette() {
    accent = document.documentElement.dataset.accent || "blue";
    const st = RAMPS[accent] || RAMPS.blue;
    cols = Array.from({ length: NCH }, (_, k) => {
      const y = k / (NCH - 1), c = ramp(st, 1 - 0.8 * y);
      return `rgba(${c[0]},${c[1]},${c[2]},${(0.95 - 0.55 * y).toFixed(3)})`;
    });
    cols.stem = `rgba(${ramp(st, 0.85).join(",")},0.6)`;
    cols.dot = `rgb(${ramp(st, 1).join(",")})`;
    cols.hi = ramp(st, 0.62);
    gl.style.opacity = GLOW[accent] || 0.6;
  }

  function line(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }

  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    // floor grid
    ctx.strokeStyle = `rgba(${GRID[accent]},0.13)`; ctx.lineWidth = 0.6;
    for (let i = 0; i <= 10; i++) { const v = i / 10; line([fit(v, 0, 0), fit(v, 1, 0)]); line([fit(0, v, 0), fit(1, v, 0)]); }

    // red theme: a faint mirrored reflection of the front channels under the floor
    if (accent === "red") {
      ctx.lineWidth = 1;
      for (let k = 7; k >= 0; k--) {
        const y = k / (NCH - 1), pts = [];
        for (let i = 0; i < NPT; i += 2) { const x = i / (NPT - 1); pts.push(fit(x, y, -0.35 * surf(x, y, t))); }
        ctx.strokeStyle = `rgba(255,60,80,${(0.16 - k * 0.018).toFixed(3)})`; line(pts);
      }
    }

    // wave surface, back to front
    ctx.lineWidth = 1;
    for (let k = NCH - 1; k >= 0; k--) {
      const y = k / (NCH - 1), pts = new Array(NPT);
      for (let i = 0; i < NPT; i++) { const x = i / (NPT - 1); pts[i] = fit(x, y, surf(x, y, t)); }
      ctx.strokeStyle = cols[k]; line(pts);
    }

    // stem plot on the front edge: each stem rises/falls with the sampled amplitude
    ctx.strokeStyle = cols.stem; ctx.lineWidth = 0.8;
    line([fit(0.02, FRONT, Z0), fit(0.98, FRONT, Z0)]);          // zero line
    ctx.lineWidth = 1.1;
    const tops = [];
    for (let j = 0; j < NST; j++) {
      const x = 0.04 + 0.92 * j / (NST - 1), z = surf(x, 0, t);
      const a = fit(x, FRONT, Z0), b = fit(x, FRONT, z);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); tops.push(b);
    }
    ctx.fillStyle = cols.dot;
    for (const [x, y] of tops) { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.2832); ctx.fill(); }

    // theme decorations
    if (accent === "blue") {
      for (const s of stars) {
        const tw = s.b * (0.55 + 0.45 * Math.sin(t * s.w + s.ph));
        ctx.strokeStyle = `rgba(230,236,255,${(tw * 0.8).toFixed(3)})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(s.x - s.L, s.y); ctx.lineTo(s.x + s.L, s.y); ctx.moveTo(s.x, s.y - s.L * 1.6); ctx.lineTo(s.x, s.y + s.L * 1.6); ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${tw.toFixed(3)})`; ctx.beginPath(); ctx.arc(s.x, s.y, 1.4, 0, 6.2832); ctx.fill();
      }
    } else if (accent === "gold") {
      for (const o of orbs) {
        const y = ((o.y - t * o.sp) % H + H) % H, x = o.x + 8 * Math.sin(t * 0.3 + o.ph);
        const c = o.teal ? [60, 170, 180] : cols.hi, a = o.b * (0.7 + 0.3 * Math.sin(t * 0.8 + o.ph));
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
        g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`);
        g.addColorStop(0.7, `rgba(${c[0]},${c[1]},${c[2]},${(a * 0.6).toFixed(3)})`);
        g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, o.r, 0, 6.2832); ctx.fill();
      }
    }

    // glow layer (CSS blurs it)
    gtx.clearRect(0, 0, gl.width, gl.height);
    gtx.drawImage(cv, 0, 0, gl.width, gl.height);
  }

  // --- loop: runs only while the hero is on screen and the tab is visible
  let raf = 0, onScreen = true, t0 = performance.now(), tPaused = 0;
  const frame = now => { draw((now - t0) / 1000); raf = requestAnimationFrame(frame); };
  const start = () => { if (raf || reduce.matches || !onScreen || document.hidden) return; t0 = performance.now() - tPaused * 1000; raf = requestAnimationFrame(frame); };
  const stop = () => { if (!raf) return; cancelAnimationFrame(raf); raf = 0; tPaused = (performance.now() - t0) / 1000; };
  const still = () => draw(tPaused || 1.2);

  layout(); palette(); still(); start();

  new ResizeObserver(() => { layout(); if (!raf) still(); }).observe(hero);
  new MutationObserver(() => { palette(); if (!raf) still(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-accent"] });
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? start() : stop(); }).observe(hero);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  reduce.addEventListener?.("change", () => { if (reduce.matches) { stop(); still(); } else start(); });
})();
