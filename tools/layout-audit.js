// Layout audit: run inside a page. Returns spacing / alignment / measure / ratio metrics.
(async () => {
  document.querySelectorAll('.reveal').forEach(e => { e.style.transition = 'none'; e.classList.add('in'); });
  await new Promise(r => setTimeout(r, 400));
  const R = e => e.getBoundingClientRect();
  const px = v => Math.round(v);
  const out = { page: document.body.dataset.page, vw: innerWidth };
  // 1) left edges of top-level content blocks (alignment)
  const lefts = {};
  document.querySelectorAll('main .container > *:not(script)').forEach(e => { const l = px(R(e).left); if (R(e).width > 0) lefts[l] = (lefts[l] || 0) + 1; });
  out.contentLefts = lefts;
  out.containerW = [...new Set([...document.querySelectorAll('main .container')].map(c => px(R(c).width)))];
  // 2) vertical gaps between main sections (breathing space)
  const secs = [...document.querySelectorAll('main > section')];
  out.sectionGaps = secs.slice(1).map((s, i) => {
    const prev = secs[i]; const pb = [...prev.querySelectorAll('*')].filter(e => R(e).height > 0).reduce((m, e) => Math.max(m, R(e).bottom), R(prev).top);
    const nt = [...s.querySelectorAll('*')].filter(e => R(e).height > 0).reduce((m, e) => Math.min(m, R(e).top), R(s).bottom);
    return px(nt - pb);
  });
  // 3) heading → body scale
  const fs = sel => { const e = document.querySelector(sel); return e ? parseFloat(getComputedStyle(e).fontSize) : null; };
  out.type = { h1: fs('main h1'), h2: fs('main h2'), h3: fs('main h3'), body: fs('main p') };
  // 4) measure (chars per line) of paragraphs wider than 300px
  out.measure = [...document.querySelectorAll('main p')].filter(p => R(p).width > 300 && p.innerText.length > 120).slice(0, 40).map(p => {
    const cs = getComputedStyle(p); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
    const lines = Math.max(1, Math.round(R(p).height / lh)); return Math.round(p.innerText.length / lines);
  });
  out.measureRange = out.measure.length ? [Math.min(...out.measure), Math.max(...out.measure)] : null;
  // 5) two-column grids: width ratio of the two tracks
  out.grids = [...document.querySelectorAll('main *')].filter(e => getComputedStyle(e).display === 'grid').map(e => {
    const t = getComputedStyle(e).gridTemplateColumns.split(' ').map(parseFloat).filter(n => n > 0);
    return t.length === 2 ? { cls: (e.className || e.tagName).toString().split(' ')[0], cols: t.map(px), ratio: +(Math.max(...t) / Math.min(...t)).toFixed(2) } : null;
  }).filter(Boolean).filter((g, i, a) => a.findIndex(x => x.cls === g.cls) === i);
  // 6) heading → content gap under section heads
  out.secHeadGap = [...document.querySelectorAll('.sec-head')].slice(0, 6).map(h => { const n = h.nextElementSibling; return n ? px(R(n).top - R(h).bottom) : null; });
  out.pageHeight = document.documentElement.scrollHeight;
  return JSON.stringify(out);
})()
