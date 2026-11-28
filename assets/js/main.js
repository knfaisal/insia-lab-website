/* =========================================================
   INSIA Lab: shared behaviour (v2, "Lab journal")
   header/footer, theme, mobile menu, gentle reveal,
   and renderers for news / publications / team (data.js).
   ========================================================= */
// Send plain-http visitors to the secure address (until GitHub's HTTPS-only switch can be turned on, design.md §9)
if (location.protocol === "http:" && /(^|\.)insia-lab\.com$/.test(location.hostname)) {
  location.replace("https://www.insia-lab.com" + location.pathname + location.search + location.hash);
}

(() => {
  const D = window.INSIA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Icons (thin line) ---------- */
  const sv = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const I = {
    arrow: sv('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    ext: sv('<path d="M7 17 17 7M8 7h9v9"/>'),
    sun: sv('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: sv('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
    menu: sv('<path d="M4 8h16M4 16h16"/>'),
    close: sv('<path d="M6 6l12 12M18 6 6 18"/>'),
    mail: sv('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    doc: sv('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>'),
    globe: sv('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>'),
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z"/></svg>',
    scholar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.9V17h2V9zM5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.8z"/></svg>',
    rg: '<svg viewBox="0 0 24 24"><text x="12" y="16.5" text-anchor="middle" font-family="Calibri, sans-serif" font-weight="700" font-size="11" fill="currentColor">RG</text></svg>',
    orcid: '<svg viewBox="0 0 24 24"><text x="12" y="16.5" text-anchor="middle" font-family="Calibri, sans-serif" font-weight="700" font-size="11" fill="currentColor">iD</text></svg>',
  };
  const linkKind = u => /scholar\.google/.test(u) ? ["scholar", "Scholar"] : /linkedin/.test(u) ? ["linkedin", "LinkedIn"]
    : /researchgate/.test(u) ? ["rg", "ResearchGate"] : /facebook/.test(u) ? ["facebook", "Facebook"] : /orcid/.test(u) ? ["orcid", "ORCID"] : ["globe", "Website"];
  window.INSIA_ICONS = I;
  window.INSIA_LINKKIND = linkKind;

  /* The INSIA mark, traced 1:1 from the original logo (assets/img/logo.png). */
  const LOGO = `<svg viewBox="0 0 1000 1000" aria-hidden="true">
    <rect x="41" y="41" width="305" height="305" fill="var(--logo, #3D5BFF)"/>
    <path d="M386 41H949V949H643V346H386Z" fill="currentColor"/>
    <rect x="41" y="386" width="305" height="563" fill="currentColor"/></svg>`;

  /* ---------- Header / footer ---------- */
  const NAV = [["./", "Home"], ["research", "Research"], ["director", "Director"], ["team", "Team"], ["publications", "Publications"], ["contact", "Contact"]];
  const page = document.body.dataset.page;
  const header = document.createElement("header");
  header.className = "site-header";
  const WORD = `<span class="word">INSIA Lab<small>Intelligent Next-gen Signal &amp; Image Analysis</small></span>`;
  header.innerHTML = `<div class="container">
      <a class="brand" href="./" aria-label="INSIA Lab home">${LOGO}${WORD}</a>
      <div class="right">
        <nav class="nav" id="nav" aria-label="Main">${NAV.map(([h, t]) => { const on = (h === "./" ? "index" : h) === page; return `<a href="${h}"${on ? ' class="active" aria-current="page"' : ""}>${t}</a>`; }).join("")}</nav>
        <div class="header-tools">
          <div class="accent-switch" role="group" aria-label="Colour theme">
            <button data-a="blue" aria-label="Blue theme" title="Blue"></button>
            <button data-a="red" aria-label="Red theme" title="Red"></button>
            <button data-a="gold" aria-label="Golden theme" title="Golden"></button>
          </div>
          <button class="icon-btn" id="theme" aria-label="Toggle dark mode">${I.moon}</button>
          <button class="icon-btn menu-btn" id="menu" aria-label="Open menu" aria-expanded="false" aria-controls="nav">${I.menu}</button>
        </div>
      </div></div>`;
  document.body.prepend(header);
  // (v9: the decorative image strip under the header was removed from inner pages)

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `<div class="container">
    <div class="footer-grid">
      <div><a class="brand" href="./">${LOGO}${WORD}</a>
        <p style="max-width:36ch">Intelligent Next-gen Signal &amp; Image Analysis Lab, Department of EECE, Military Institute of Science and Technology.</p></div>
      <div><span class="label">Pages</span>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</div>
      <div><span class="label">Elsewhere</span><a href="${D.lab.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a href="${D.lab.facebook}" target="_blank" rel="noopener">Facebook</a><a href="https://scholar.google.com/citations?user=WYuCPWcAAAAJ&hl=en" target="_blank" rel="noopener">Google Scholar</a></div>
      <div><span class="label">Visit</span><p>Room 232, Tower-3<br>Faculty of ECE, MIST<br>Mirpur Cantonment, Dhaka-1216<br><a href="mailto:${D.lab.email}" style="display:inline">${D.lab.email}</a></p></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} INSIA Lab</span><div class="accent-switch" role="group" aria-label="Colour theme"><span class="label">Theme</span><button data-a="blue">Blue</button><button data-a="red">Red</button><button data-a="gold">Golden</button></div><span>Dhaka · 23.84°N 90.36°E</span></div></div>`;
  document.body.append(footer);

  /* ---------- Theme ---------- */
  const root = document.documentElement, themeBtn = $("#theme");
  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  // v6: the engraving theme is black by default; visitors can switch to white with the toggle
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : true;
  const saved = store.get("insia-theme"); if (saved) root.dataset.theme = saved;
  // ?theme=light|dark previews a theme without changing the visitor's saved choice
  const forced = new URLSearchParams(location.search).get("theme");
  if (forced === "light" || forced === "dark") root.dataset.theme = forced;
  const syncIcon = () => { themeBtn.innerHTML = isDark() ? I.sun : I.moon; };
  syncIcon();
  themeBtn.onclick = () => { root.dataset.theme = isDark() ? "light" : "dark"; store.set("insia-theme", root.dataset.theme); syncIcon(); };

  /* ---------- Colour theme: blue (default) · red · gold ---------- */
  const ACCENTS = ["blue", "red", "gold"];
  const accentQ = new URLSearchParams(location.search).get("accent");   // ?accent=red previews without saving
  const setAccent = (a, save) => {
    if (!ACCENTS.includes(a)) a = "blue";
    root.dataset.accent = a;
    $$(".accent-switch button").forEach(b => b.setAttribute("aria-pressed", b.dataset.a === a));
    if (save) store.set("insia-accent", a);
  };
  setAccent(ACCENTS.includes(accentQ) ? accentQ : (store.get("insia-accent") || "blue"), false);
  $$(".accent-switch button").forEach(b => b.addEventListener("click", () => setAccent(b.dataset.a, true)));

  /* ---------- Menu + header rule ---------- */
  const nav = $("#nav"), menu = $("#menu");
  menu.onclick = () => { const o = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", o); menu.innerHTML = o ? I.close : I.menu; };

  /* ---------- Gentle reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08, rootMargin: "0px 0px -30px 0px" });
  const observe = (scope = document) => $$(".reveal:not(.in)", scope).forEach(el => io.observe(el));
  window.INSIA_OBSERVE = observe;

  /* ---------- Renderers ---------- */
  const NO_FIG = `<svg viewBox="0 0 200 60" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M0 30c10 0 12-18 22-18s12 36 22 36 12-28 22-28 12 20 22 20 12-14 22-14 12 8 22 8 12-4 22-4 12 0 24 0"/></svg>`;
  // v8 "project card" (idea from MMLab@NTU's featured projects): figure, title, authors,
  // venue, a one-line plain summary and a link row.
  const boldPI = s => esc(s).replace(/(K\. N(?:ewaj)?\.? Faisal)/g, "<b>$1</b>");
  const newsCard = (n, i) => `<article class="card reveal" style="--i:${i % 3}">
      <div class="card-media${n.image ? "" : " placeholder"}">${n.image ? `<img src="${n.image}" alt="Figure: ${esc(n.title)}" loading="lazy">` : NO_FIG}</div>
      <div class="card-body">
        <div class="label"><span>${esc(n.type)}</span><span>·</span><span>${n.year}</span></div>
        <h3>${esc(n.title)}</h3>
        ${n.authors ? `<p class="authors">${boldPI(n.authors)}</p>` : ""}
        ${n.summary || n.text ? `<p class="summary">${esc(n.summary || n.text)}</p>` : ""}
        <div class="card-foot"><span class="venue">${esc(n.venue)}${n.if ? ` · IF ${esc(n.if)}` : ""}</span>${n.link ? `<a href="${n.link}" target="_blank" rel="noopener">Paper ↗</a>` : ""}</div>
      </div></article>`;

  const R = {
    latestNews(el, n = 3) { el.innerHTML = D.news.slice(0, n).map(newsCard).join(""); observe(el); },

    /* "On the bench" card: edit INSIA.bench in data.js */
    bench(el) {
      const b = D.bench;
      el.innerHTML = `<span class="label">Now · ${esc(b.updated)}</span><h3>On the <em>bench</em></h3>
        <ul>${b.items.map(it => `<li>${it.link ? `<a href="${it.link}"${/^https?:/.test(it.link) ? ' target="_blank" rel="noopener"' : ""}>${esc(it.text)}</a>` : esc(it.text)}</li>`).join("")}</ul>`;
    },

    /* Recent work on the home page: filter chips + horizontal slider with prev/next */
    recent(track, { filterEl, prev, next, counter }) {
      const types = ["All", ...new Set(D.news.map(n => n.type))];
      let cur = "All";
      if (filterEl) filterEl.innerHTML = types.map(t => `<button class="chip" aria-pressed="${t === cur}" data-t="${t}">${t}<span class="count">${t === "All" ? D.news.length : D.news.filter(n => n.type === t).length}</span></button>`).join("");
      const step = () => { const c = track.querySelector(".card"); return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 24) : 300; };
      const sync = () => {
        const max = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2; next.disabled = track.scrollLeft >= max;
        const n = track.children.length, first = Math.min(n, Math.round(track.scrollLeft / step()) + 1);
        const shown = Math.max(1, Math.round(track.clientWidth / step()));
        const pad = v => String(v).padStart(2, "0");
        counter.textContent = n ? `${pad(first)}–${pad(Math.min(n, first + shown - 1))} / ${pad(n)}` : "";
      };
      const draw = () => {
        track.innerHTML = D.news.filter(n => cur === "All" || n.type === cur).map(newsCard).join("");
        track.scrollLeft = 0; $$(".reveal", track).forEach(c => c.classList.add("in")); sync();
      };
      if (filterEl) filterEl.onclick = e => { const b = e.target.closest(".chip"); if (!b) return; cur = b.dataset.t; $$(".chip", filterEl).forEach(c => c.setAttribute("aria-pressed", c === b)); draw(); };
      prev.onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
      next.onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
      track.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
      track.addEventListener("keydown", e => { if (e.key === "ArrowRight") next.click(); if (e.key === "ArrowLeft") prev.click(); });
      addEventListener("resize", sync);
      draw();
    },

    /* v9 Research page (ideas from MMLab@NTU research/projects and NSA Lab topics):
       one alternating row per direction + featured-project media rows + funding */
    research(dirsEl, projectsEl, fundEl) {
      const mini = n => `<a class="mini-proj" href="#p-${slug(n.title)}"><span>${esc(n.type)} · ${n.year}</span>${esc(n.title)}</a>`;
      const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      dirsEl.innerHTML = D.directions.map((d, i) => {
        const works = D.news.filter(n => (n.areas || []).includes(d.glyph));
        return `<section class="dir-row reveal${i % 2 ? " flip" : ""}" id="${d.glyph}">
          <figure class="dir-fig"><img src="${d.image}" alt="Figure from INSIA work on ${esc(d.title)}" loading="lazy"></figure>
          <div class="dir-text">
            <span class="label">${String(i + 1).padStart(2, "0")} · Research direction</span>
            <h2>${esc(d.title).replace(/ &amp; /, " <em>&amp;</em> ")}</h2>
            <p class="lede">${esc(d.text)}</p>
            ${works.length ? `<div class="dir-works"><span class="label">Projects</span>${works.map(mini).join("")}</div>` : ""}
            <a class="btn" href="publications?q=${encodeURIComponent(d.query || "")}">See related papers →</a>
          </div></section>`;
      }).join("");
      projectsEl.innerHTML = D.news.map((n, i) => `<article class="proj reveal" id="p-${slug(n.title)}" style="--i:${i % 2}">
          <div class="proj-media${n.image ? "" : " placeholder"}">${n.image ? `<img src="${n.image}" alt="Figure: ${esc(n.title)}" loading="lazy">` : NO_FIG}</div>
          <div class="proj-body">
            <span class="label">${esc(n.type)} · ${n.year}${(n.areas || []).map(a => { const d = D.directions.find(x => x.glyph === a); return d ? ` · <a href="#${a}">${esc(d.title.split(/ & | and /)[0])}</a>` : ""; }).join("")}</span>
            <h3>${n.link ? `<a href="${n.link}" target="_blank" rel="noopener">${esc(n.title)}</a>` : esc(n.title)}</h3>
            ${n.authors ? `<p class="authors">${boldPI(n.authors)}</p>` : ""}
            <p class="venue">${esc(n.venue)}${n.if ? ` · IF ${esc(n.if)}` : ""}</p>
            ${n.summary || n.text ? `<p class="summary">${esc(n.summary || n.text)}</p>` : ""}
            ${n.link ? `<a class="proj-link" href="${n.link}" target="_blank" rel="noopener">Read the paper ↗</a>` : ""}
          </div></article>`).join("");
      if (fundEl) {
        const grants = (D.achievements || []).filter(a => /grant/i.test(a.award));
        fundEl.innerHTML = grants.map(g => `<div class="fund"><span class="ach-year">${g.year}</span><div><b>${esc(g.where.split(":")[0])}</b><p>${esc(g.where.split(":").slice(1).join(":").trim())}</p><span class="ach-people">${boldPI(g.people)}</span></div></div>`).join("");
      }
      observe();
    },

    news(el, filterEl) {
      const types = ["All", ...new Set(D.news.map(n => n.type))];
      let cur = "All";
      filterEl.innerHTML = types.map(t => `<button class="chip" aria-pressed="${t === cur}" data-t="${t}">${t}<span class="count">${t === "All" ? D.news.length : D.news.filter(n => n.type === t).length}</span></button>`).join("");
      const draw = () => { el.innerHTML = D.news.filter(n => cur === "All" || n.type === cur).map(newsCard).join(""); observe(el); };
      filterEl.onclick = e => { const b = e.target.closest(".chip"); if (!b) return; cur = b.dataset.t; $$(".chip", filterEl).forEach(c => c.setAttribute("aria-pressed", c === b)); draw(); };
      draw();
    },

    pubs(el, { filterEl, searchEl, statsEl } = {}) {
      let type = "all", q = "";
      const hl = s => { const e = esc(s); if (!q) return e; const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"); return e.replace(re, "<mark>$1</mark>"); };
      const authors = a => hl(a).replace(/(K\. N(?:ewaj)?\.? Faisal|K\. Newaj Faisal)/g, "<b>$1</b>");
      if (filterEl) {
        const c = t => D.publications.filter(p => t === "all" || p.type === t).length;
        filterEl.innerHTML = [["all", "All"], ["journal", "Journal"], ["conference", "Conference"]]
          .map(([k, l]) => `<button class="chip" aria-pressed="${k === type}" data-t="${k}">${l}<span class="count">${c(k)}</span></button>`).join("");
        filterEl.onclick = e => { const b = e.target.closest(".chip"); if (!b) return; type = b.dataset.t; $$(".chip", filterEl).forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); };
      }
      if (searchEl) {
        searchEl.oninput = () => { q = searchEl.value.trim(); draw(); };
        const pre = new URLSearchParams(location.search).get("q");   // v9: publications?q=radar
        if (pre) { searchEl.value = pre; q = pre; }
      }
      function draw() {
        const list = D.publications.filter(p => (type === "all" || p.type === type) && (!q || `${p.title} ${p.authors} ${p.venue}`.toLowerCase().includes(q.toLowerCase())));
        if (statsEl) statsEl.textContent = `${list.length} / ${D.publications.length}`;
        if (!list.length) { el.innerHTML = `<p class="empty">No papers match “${esc(q)}”.</p>`; return; }
        const years = [...new Set(list.map(p => p.year))].sort((a, b) => b - a);
        el.innerHTML = years.map(y => `<section class="pub-year"><h3>${y}</h3><ol class="pub-list">${list.filter(p => p.year === y).map(p => `
          <li class="pub">
            <h4>${hl(p.title)}</h4>
            <div class="authors">${authors(p.authors)}</div>
            <div class="venue">${hl(p.venue)}</div>
            <div class="meta"><span>${p.type === "journal" ? "Journal" : "Conference"}</span>${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}${p.award ? `<span class="award">★ ${esc(p.award)}</span>` : ""}</div>
            ${p.link ? `<a class="go" href="${p.link}" target="_blank" rel="noopener" aria-label="Open paper: ${esc(p.title)}">Paper ↗</a>` : ""}
          </li>`).join("")}</ol></section>`).join("");
      }
      draw();
    },

    team(el) {
      const soc = links => links.map(u => { const [k, l] = linkKind(u); return `<a href="${u}" target="_blank" rel="noopener" aria-label="${l}" title="${l}">${I[k]}</a>`; }).join("");
      // v8 mentor feature block (idea from MMLab@NTU faculty): big photo, NAME, title in blue, bio, links
      const mentors = D.team.mentors.map((m, i) => `<article class="mentor reveal" style="--i:${i}">
          <div class="photo"><img src="${m.photo}" alt="${esc(m.name)}" loading="lazy"></div>
          <div><h3 class="mentor-name">${esc(m.name)}</h3><span class="mentor-role">${esc(m.role)}</span>
            <p class="mentor-pos">${m.lines.map(esc).join(" · ")}</p>
            ${m.bio ? `<p class="mentor-bio">${esc(m.bio)}</p>` : ""}
            <div class="links"><a href="mailto:${m.email}">${I.mail}${esc(m.email)}</a>
            ${m.profile ? `<a href="${m.profile}"${m.profile.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${I.globe}Profile</a>` : ""}
            ${m.links.map(u => { const [k, l] = linkKind(u); return `<a href="${u}" target="_blank" rel="noopener">${I[k]}${l}</a>`; }).join("")}</div></div></article>`).join("");
      let n = 1;   // numbered boxes: 01, 02, … (no § sign)
      const sec = (title, inner) => `<section class="team-group"><div class="sec-head reveal"><span class="num">${String(n++).padStart(2, "0")}</span><h2>${title}</h2></div>${inner}</section>`;
      const mentorsSec = sec("<em>Mentors</em>", mentors);
      const initials = name => name.replace(/^(Md|Mohammad|Syeda?)\.?\s+/i, "").split(/\s+/).slice(0, 2).map(w => w[0]).join("");
      // v8 uniform member card (idea from MMLab@NTU): photo, NAME, blue role line, optional
      // "now @" line for alumni, and links in a separate footer strip so cards align.
      // v16: `level` (MIST academic year) adds a small badge on the photo; no photo shows initials.
      const card = (p, i, level) => `<article class="person reveal" style="--i:${i % 4}">
            <div class="photo">${p.photo ? `<img src="${p.photo}" alt="${esc(p.name)}" loading="lazy">` : `<span class="initials" aria-hidden="true">${esc(initials(p.name))}</span>`}${level ? `<span class="lvl lvl-${level}">Level ${level}</span>` : ""}</div>
            <div class="person-body"><h3>${esc(p.name)}</h3>
              ${p.now ? `<span class="person-now">${esc(p.now)}</span>` : ""}
              ${p.note ? `<p>${esc(p.note)}</p>` : ""}</div>
            <div class="socials">${soc(p.links)}</div></article>`;
      const groups = D.team.groups.map(g => {
        const [a, ...rest] = g.title.split(" ");
        const head = rest.length ? `${a} <em>${rest.join(" ")}</em>` : `<em>${a}</em>`;
        // v16: a group with `rows` (undergraduates by level) shows each row on its own line, no sub-headings
        const inner = g.rows
          ? g.rows.map(r => `<div class="people people-row lvl-row-${r.level}">${r.people.map((p, i) => card(p, i, r.level)).join("")}</div>`).join("")
          : `<div class="people">${g.people.map((p, i) => card(p, i)).join("")}</div>`;
        return sec(head, inner);
      }).join("");
      // v8 Achievements (idea from MMLab@NTU): awards by year, crediting the people
      const ach = (D.achievements || []).length ? sec("<em>Achievements</em>", `<ol class="achievements">${D.achievements.map(a => `
          <li class="reveal"><span class="ach-year">${a.year}</span>
            <div><b class="ach-award">★ ${esc(a.award)}</b><span class="ach-where">${esc(a.where)}</span>
            <span class="ach-people">${boldPI(a.people)}</span></div></li>`).join("")}</ol>`) : "";
      el.innerHTML = mentorsSec + groups + ach;
      observe(el);
    },
  };
  window.INSIA_RENDER = R;

  /* ---------- Image fallbacks (missing portrait → initials) ---------- */
  const initials = s => s.replace(/^(Portrait of |Dr\.\s*|Md\.\s*)/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("");
  document.addEventListener("error", e => {
    const im = e.target;
    if (!(im instanceof HTMLImageElement) || im.dataset.failed) return;
    im.dataset.failed = "1";
    const media = im.closest(".card-media");
    if (media) { media.classList.add("placeholder"); im.outerHTML = NO_FIG; return; }
    if (im.closest(".photo, .fig")) { const d = document.createElement("div"); d.className = "avatar-fallback"; d.textContent = initials(im.alt); im.replaceWith(d); }
  }, true);
  $$("img").forEach(im => { if (im.complete && !im.naturalWidth) im.dispatchEvent(new Event("error")); });

  /* ---------- Copy buttons ---------- */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    navigator.clipboard?.writeText(b.dataset.copy).then(() => { const o = b.textContent; b.textContent = "copied"; setTimeout(() => b.textContent = o, 1400); });
  });

  observe();
})();
