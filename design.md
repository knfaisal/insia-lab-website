# INSIA Lab Website Redesign: Design Log

Working log for moving **insia-lab.com** from Google Sites to a hand-built, animated static site hosted on **GitHub Pages** under the same domain.

Every step is logged below, newest at the bottom of the log section.

---

## 1. Audit of the current site (Google Sites)

Captured on 2026-11-22 with the built-in browser. Screenshots are in [`screenshots/`](screenshots/).

| Page | URL | What's on it | Screenshots |
|---|---|---|---|
| Home | `/home` | Animated logo intro (embedded, "REPLAY" button), Facebook/LinkedIn icons, welcome text, 5 research directions, Join Us, FlagCounter visitor widget | `01`–`04` |
| News | `/news` | 12 research highlights. Each one is a title, a large figure, and the venue + impact factor + [PDF] link. Very image-heavy (page is about 7,600px tall) | `05`–`11` |
| Director & PI | `/newajfaisal` | Profile banner (photo, title, 5 academic icons), tab buttons (Professional / Research / Teaching / CV / Contact), appointments, education, admin services, affiliations, committees, awards, participations | `12`–`14` |
| ↳ Research | `/newajfaisal/research` | Research interests, grants, awards, full publication list, review activities | `15` |
| ↳ Teaching | `/newajfaisal/teaching` | Ongoing courses (UG and PG, with long syllabus text), completed courses | `16` |
| Meet the Team | `/meet-the-team` | Mentors (2), Research Assistant (1), Graduate (6), Undergraduate (7), Alumni (7), with photos and social icons | `17`–`19` |
| Publications | `/insia-lab-publications` | Embedded stats dashboard, then journal and conference lists grouped by year (34 papers) | `20` |
| Contact | `/contact` | Google Map embed, office, mailing address, two emails | `21`–`22` |

### Problems found
1. **Generic Google Sites look.** Fixed black nav bar, default Playfair/Open Sans fonts, flat white page. Nothing says "signal processing lab".
2. **The intro animation is an iframe.** It shows a blank white block until it loads, then a "REPLAY" pill. You lose the first ~300px of the page.
3. **News is one huge scroll.** 12 full-width figures with no grid, no filtering, and no dates.
4. **The same publication data lives in 3 places** (Director/Research, Publications, News), and the copies have already drifted apart. Example: the 2D-SVMD IF is listed as 3.6 in one place and 3.2 in another.
5. **Inconsistent headings.** Mixed serif, sans, colors and sizes (blue serif titles, maroon names on the Team page, navy banners).
6. **Typos visible to visitors:** "Recognitio", "Deptartment". The Rishi Raj Sharma ResearchGate link points to Kazi Newaj Faisal's profile.
7. **No dark mode, weak mobile layout, no SEO metadata**, and a third-party FlagCounter widget.

### What to keep
- The **brand mark**: black block "I" with an electric-blue square. It's strong and geometric, so the whole new palette grows from it.
- The content structure (6 main pages + PI sub-pages) so existing links still make sense.
- The research figures from News. They are the lab's best visuals.

---

## 2. Reference study

### NSA Lab (nsa-lab.org, Boston University): screenshots `ref-nsa-lab-*`
- Full-bleed **dark hero** with a dramatic scientific image (brain MRI in blue/orange).
- Wordmark in thin uppercase **Poppins**, top-left, with a simple uppercase nav top-right and dropdowns for Research subtopics.
- Pure black background with very little text on the homepage. **The image carries the identity.**
- Minimal black footer: institution logo, address, email.
- **Take-away:** let one striking scientific visual own the hero, use dark backgrounds for drama, and keep the nav quiet.

### MIT CSAIL (csail.mit.edu)
- The site returned **HTTP 403 Forbidden** to the automated browser (bot protection), so no live screenshot. Notes come from its known public design:
- Bold, high-contrast **editorial** layout with big type, a single strong accent color, and generous whitespace.
- **Card grids** for news, research areas and people. Each card has an image on top, a category label, and a title.
- Clear **information hierarchy**: research areas → projects → people → publications, each filterable.
- **Take-away:** card grids and filters for News, Team and Publications, plus confident large headings.

### Synthesis
NSA Lab's dark, image-led drama plus CSAIL's editorial grid discipline, combined with INSIA's own blocky blue/black mark and a **signal/waveform motif** that fits a signal and image analysis lab.

---

## 3. Design system

### Concept: "Signal → Insight"
The hero is a live canvas. Several noisy, non-stationary waveforms scroll across the screen, and as you move the mouse they "decompose" into clean components, in the spirit of VMD/SVMD and time–frequency analysis (the lab's own research). Section dividers echo spectrogram bands.

### Color (derived from the logo)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#0A0D14` | `#F3F5FA` | Primary text |
| `--bg` | `#F7F8FB` | `#07090F` | Page |
| `--surface` | `#FFFFFF` | `#10141F` | Cards |
| `--line` | `#E3E6EE` | `#1F2535` | Borders |
| `--muted` | `#5B6275` | `#9AA3B8` | Secondary text |
| `--blue` | `#1F3BFF` | `#4D66FF` | Brand (the logo square) |
| `--cyan` | `#00C2FF` | `#22D3FF` | Signal accent |
| `--violet` | `#7B5CFF` | `#9B82FF` | Gradient partner |
| `--warm` | `#FF7A45` | `#FF8C5A` | Spectrogram "hot" accent, used sparingly |

Signature gradient: `linear-gradient(120deg, --blue, --violet 50%, --cyan)`. The hero and footer always stay dark (`#07090F`), like NSA Lab.

### Type
- **Display:** Space Grotesk (600/700). Geometric and technical, and it matches the blocky logo.
- **Body:** Inter (400/500).
- **Labels/meta:** JetBrains Mono, uppercase, letter-spaced. Used for venues, IF, years and section kickers like `// 01 RESEARCH`.

### Motion
| Element | Animation |
|---|---|
| Hero | Canvas waveforms (multi-component chirps + noise) that react to the cursor; headline letters rise in staggered |
| Logo | The blue square "pulses" once on load |
| Sections | Fade-and-rise on scroll (IntersectionObserver) with a 60ms stagger per child |
| Stats | Count-up numbers when they scroll into view |
| Cards | Lift + gradient border glow on hover; images zoom 1.05 |
| Venues | Infinite marquee of journals the lab publishes in |
| Nav | Turns glassy (backdrop blur) after scrolling; underline slides between links |
| Accessibility | Everything is disabled under `prefers-reduced-motion` |

### Tech
- Plain **HTML + CSS + vanilla JS**, with no build step, so GitHub Pages serves it as is.
- Content lives in one file, `assets/js/data.js` (publications, news, team). Every page renders from it, which fixes the duplicate-data problem.
- Light/dark theme toggle that follows the OS by default and is remembered per visitor.

---

## 4. Site map (new)

```
/                 index.html          Hero, research directions, stats, latest news, venues, join us
/news.html                            Filterable card grid (Journal / Conference / Highlight)
/director.html                        PI profile with in-page tabs: Profile · Research · Teaching
/team.html                            Mentors, RA, Graduate, Undergraduate, Alumni grids
/publications.html                    Search + year/type filters, journal & conference lists
/contact.html                         Address cards, map, emails, Join-us form-less CTA
/404.html                             Animated "signal lost" page
CNAME                                 www.insia-lab.com
```

---

## 5. GitHub Pages + custom domain: how to go live

1. Create a GitHub repo, e.g. `insia-lab/insia-lab.github.io` (or any repo name).
2. Push this folder to the `main` branch.
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
4. The `CNAME` file in this folder already says `www.insia-lab.com`.
5. At your domain registrar (where insia-lab.com is managed), **remove the Google Sites records** and add:
   - `CNAME` record: `www` → `<your-github-username>.github.io`
   - `A` records for the apex `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
6. Back in Settings → Pages, wait for the DNS check, then tick **Enforce HTTPS**.
7. In Google Sites, unpublish or remove the custom domain mapping so the two don't conflict.

---

## 6. Work log

| # | Time | Step |
|---|---|---|
| 1 | 2026-11-22 | Opened `insia-lab.com/home` in the built-in browser and found 6 nav pages plus 2 hidden PI sub-pages (`/newajfaisal/research`, `/newajfaisal/teaching`). |
| 2 | | Captured screenshots and full text of every page; extracted links, DOIs and image URLs. Mapped all 23 team photos to names by on-page position. |
| 3 | | Studied nsa-lab.org: black background, Poppins, full-bleed MRI hero, minimal footer. |
| 4 | | csail.mit.edu returned 403 to the automated browser. Logged it and used known CSAIL design patterns instead. |
| 5 | | Saved 25 screenshots to `screenshots/`. |
| 6 | | Wrote the audit, reference synthesis, design system and deployment plan (this file). |
| 7 | | Built `assets/css/style.css`: design tokens, light/dark themes, cards, timeline, tabs, marquee, reveal animations and reduced-motion support. |
| 8 | | Built `assets/js/data.js`: one source for 12 news items, 35 publications (14 journal, 21 conference) and 23 team members. Fixed the old site's inconsistencies: 2D-SVMD IF set to 3.2 everywhere, "Recognitio" corrected, and the wrong ResearchGate link on R. R. Sharma removed. |
| 9 | | Built `assets/js/main.js`: shared header and footer, theme toggle, scroll progress, reveal-on-scroll, count-up stats, the **hero signal-decomposition canvas** (the raw signal splits into 3 IMFs plus a TF ridge behind a scan line that follows the cursor), and ambient wave canvases. |
| 10 | | Built pages: `index`, `news` (filter chips), `publications` (search + type filter + highlight), `team`, `director` (Profile/Research/Teaching tabs with `#research`/`#teaching` deep links), `contact` (copy-email buttons, map), `404` ("Signal lost"). |
| 11 | | Added `CNAME` (`www.insia-lab.com`), `.nojekyll`, and **redirect stubs for every old Google Sites URL** (`/home`, `/news`, `/newajfaisal`, `/newajfaisal/research`, `/newajfaisal/teaching`, `/meet-the-team`, `/insia-lab-publications`, `/contact`) so existing links and Google results keep working. |
| 12 | | Previewed locally (`python -m http.server 8080`, see `.claude/launch.json`). **Fix:** on desktop the hero waveform crossed the paragraph, so the canvas now measures where the headline ends and draws to its right. On narrow screens it sits dimmed behind the text. |
| 13 | | **Fix:** the header briefly rendered solid over the dark hero. `has-hero` is now set in the HTML, not added later by JS. |
| 14 | | **Blocker found:** Google Sites image URLs (`lh7-us.googleusercontent.com/sitesv-images-rt/…`) are signed and return **HTTP 403** anywhere outside Google Sites, so news figures, team photos and the PI portrait can't be hotlinked. Added fallbacks (animated wave art for figures, gradient initials for people) so nothing looks broken. **Next step:** copy the images into `assets/img/` and point `data.js` at them. |
| 15 | | Verified: 12 news cards and 4 filters, 35 publications with working search, 5 team groups (2 mentors + 21 people), tab deep links, old-URL redirects, and no horizontal overflow at 375px on home, publications and director. Fixed the stats (21 conference, 35 total) and stopped "Next-gen" breaking at the hyphen on phones. |
| 16 | | Saved new-design screenshots: `screenshots/new-01…03`. |
| 17 | | **Image migration (approved by the owner).** The signed Google Sites links expire quickly and hand-copied links failed. The browser couldn't post to a localhost receiver either, because Chrome blocks public pages from reaching localhost. **What worked:** read each live page's HTML from the shell to get fresh links, then download right away (with retries that re-read the page). |
| 18 | | Downloaded 23 team photos, the PI portrait, 12 news figures and the original logo. Checked the name-to-photo mapping against the pixel sizes recorded in step 2: all matched. |
| 19 | | Optimized everything to WebP (portraits ≤720px, figures ≤1400px): **~12 MB down to ~2.5 MB**. Layout is `assets/img/team/`, `assets/img/news/`, `assets/img/portrait.webp`, `assets/img/logo.png`. The raw originals were moved out of the site folder so they won't be published. |
| 20 | | Pointed `data.js` (34 references) and `director.html` at the local files. The site no longer loads anything from Google Sites. |
| 21 | | Re-traced the header/footer logo and favicon **1:1 from the original `logo.png`**. The first version was an approximation. |
| 22 | | Verified in the browser: team 23/23 photos, news 11/11 figures (the Wearable EEG item never had a figure, so it keeps the animated placeholder), portrait loads. Screenshots: `new-04`, `new-05`. |
| 23 | | **Owner feedback: "looking like AI, I want simple and elegant."** Studied sdmrnwashere.github.io (screenshots `ref-sdmrn-*`) and wrote the v2 direction (§6b). |
| 24 | | **Rewrote `style.css` from scratch:** paper `#F5F4F0`, ink `#141416`, one accent (logo blue `#2438E0`), Instrument Serif + Geist + Geist Mono, hairline rules, `§ 0n` section heads, no gradients, glow or shadows. |
| 25 | | **Rewrote `main.js`:** removed the hero canvas, wave canvases, cursor glow, progress bar and count-up. It keeps a gentle 14px fade-up on scroll, theme, menu and the renderers (now typeset-style markup). It shrank from ~380 to ~190 lines. |
| 26 | | **Rewrote every page:** the home hero is a serif title with a captioned real figure ("Fig. 1. 2D-SVMD"), followed by a facts row, a ruled research grid, recent work and a quiet "Join us" band. The Director page is a typeset CV with mono-label tabs. Publications is a reference list. Team uses grayscale photos that turn to color on hover. |
| 27 | | Fixed: Team section numbers started at § 05 (the groups were numbered before the mentors). Fixed: the footer logo touched the wordmark. Team grid set to 4 columns to avoid orphans. |
| 28 | | **Incident:** bumping the asset version with PowerShell 5.1 `Get-Content`/`Set-Content` re-encoded UTF-8 as cp1252, which garbled `–`, `·` and `”` (and added BOMs). Repaired all files by reversing the double encoding (`fixenc.py`) and verified that no mojibake remains. **Rule from now on: edit these files with sed/Python, never PowerShell `Set-Content`.** |
| 29 | | Added `?v=N` cache-busting to the CSS and JS links (currently `v=4`), so visitors get updates right away after each deploy. **Bump it whenever CSS or JS changes.** |
| 30 | | Verified: no console errors; 0px horizontal overflow at 375px on all 6 pages; desktop full-page renders checked with headless Edge. The final screenshots are `screenshots/v2-*.png`. (The `new-*` files show the old v1 design.) |
| 31 | | **Owner asked to mix v2 with NSA Lab.** Re-studied NSA's home and members pages (black header, image strip, uppercase titles with trailing rules, oval portraits). |
| 32 | | Wrote `tools/make_hero.py`. v1 of the art was rejected (thin and aliased chirps); v2 is the micro-Doppler signature, with stride length tuned (T=4.2 s) so it looks less repetitive. |
| 33 | | CSS: black NSA header (two-line uppercase wordmark, menu with a line above the active item, black dropdown on mobile), `.hero-img` full-bleed hero with a left/bottom dark gradient for legibility, a `.banner` strip on inner pages (injected by `main.js`), hairlines after section titles, oval portraits, black footer. |
| 34 | | Home: the hero is now the image with a short tagline; the full intro moved to a new "§ 00 About the lab" row with the Fig. 1 figure. |
| 35 | | Verified: 6/6 pages at 0px overflow at 375px, mobile menu opens, no console errors, dark mode renders correctly. Final screenshots: `screenshots/v3-*.png` (+ `v3-index-dark.png`). Asset version is now `v=6`. |
| 36 | | **Owner: "See the Theme folder… I want it retro. Use only Calibri."** Built a contact sheet of the 17 `Theme/` images and analysed them (§6d): halftone, riso grain, black + cream linework, amber waves, cobalt, technical micro-labels and vertical date stamps. |
| 37 | | **Copyright decision:** the Theme images appear to be third-party artworks (Pinterest hashes, one signed "PS DESIGN BY BEAR"), so they are used as reference only. Added `.gitignore` with `Theme/` so they're never published. |
| 38 | | Wrote `tools/make_retro.py`: the micro-Doppler signature re-rendered as an **amber halftone dot-screen** on black. The first render was 859 KB (baked-in grain compresses badly), so grain moved to CSS and the render was reduced to 1920px: hero 290 KB, banner 104 KB. |
| 39 | | **Rewrote `style.css` (v4 retro):** `--font: Calibri, sans-serif` is the only typeface; cream paper with an SVG grain overlay; 2px ink borders and hard offset shadows; amber/cobalt/cream print stripes under the masthead and above the footer; ticket-stub facts row; cobalt feature card; halftone-screened sepia team photos that turn to color on hover; boxy tabs, chips and buttons that press in when clicked. |
| 40 | | Removed every Google Fonts link from all pages, changed the inline icon SVG text from Arial to Calibri, and made `<html>` and form controls inherit Calibri. **Audit in the browser: the only computed `font-family` on every element is `Calibri, sans-serif`.** |
| 41 | | Launched the site in the browser pane (visible to the owner) and reviewed Home, Team, Publications, Director and News. |
| 42 | | **Fixed:** on phones the hero caption became a flex sibling and squeezed the text column to 192px. The hero is now a column layout and the caption's desktop offset is reset. **Fixed:** a stray space before the comma in the Director caption. |
| 43 | | Verified 0px overflow at 375px on all 6 pages, plus dark mode. Final screenshots: `screenshots/v4-retro-*.png` (+ `v4-retro-index-dark.png`). Asset version is `v=12`. |
| 44 | | **Owner feedback (v5):** remove the colored stripe bars and heavy borders; pure white background; no News page (recent work browsable on Home instead); replace the radar image with something more aesthetic; label just "Dhaka, Bangladesh"; dark mode not contrasting enough; an "On the bench" card instead of Fig. 1 that can be updated in one place. |
| 45 | | New art: `tools/make_ribbon.py` draws a **ribbon of 200 superimposed waves** that is born as a single thread and opens out (amber → gold on black), inspired by the mood board's wave posters, with no pixels taken from them. The first render had a hard cut on the left, fixed with a smoothstep "birth". Hero 119 KB, banner 49 KB. |
| 46 | | **On the bench:** `INSIA.bench` at the top of `data.js` (`updated` + `items[]`, optional `link`), rendered by `INSIA_RENDER.bench` into a black card that replaces Fig. 1. **To update the card, edit only that block.** |
| 47 | | **Recent work slider** on Home: filter chips (All/Conference/Journal/Highlight), a horizontal scroll-snap track (3 per view on desktop, 2 on tablet, 86% on phone), ←/→ buttons that disable at the ends, a live "01–03 / 12" counter, and arrow keys. **News removed from the menu**; `news.html` and `/news` now redirect to `index.html#recent`. |
| 48 | | `restyle_v5.py`: background **#FFFFFF**, grain removed, stripe bars removed (header and footer), 12 offset shadows and 16 heavy 2px borders replaced with hairlines, 4 dashed rules made solid; dark palette changed to **pure black / pure white text** (`#000` / `#FFF`, muted `#B8B8B8`). The script aborted safely on a rule-order clash, then ran cleanly after reordering. |
| 49 | | Follow-ups: the label dash was a mini stripe bar, so it's now a plain amber line; the Director tab divider is a hairline; halftone dots on photos are white; in dark mode the "All 35 papers" card now has black text (was white on lavender) and the header/hero black matches the page. |
| 50 | | Verified in the browser pane: white background, Calibri only, 5 bench items, slider 12 → filter works, end-of-track disables →, the `/news` redirect works, no console errors, 0px overflow at 375px on all 5 pages. Screenshots: `screenshots/v5-*.png` (+ `v5-index-dark.png`). Asset version is `v=15`. |
| 51 | | **Owner: remove the § icon; remove the filters under Recent Work.** Deleted every `§` badge before section titles (Home ×3, Director, and all Team groups generated in `main.js`), the `§` prefix on the Director tabs, and "§ 03" from "Join us". Removed the filter chips from Recent Work; the slider keeps only ← → and the counter, now right-aligned. (`INSIA_RENDER.recent` still accepts an optional `filterEl` if filters are ever wanted back.) Confirmed no `§` remains in any page or script. Asset version is `v=16`. |
| 52 | | **Correction:** the owner meant to remove only the `§` symbol and **keep the numbered black boxes**. Restored the boxes with plain numbers: Home `00` About, `01` Research directions, `02` Recent work, `03 · Join us`; Team groups `01`–`05` (generated in `main.js`). The Director tabs stay as plain "Profile / Research / Teaching". Asset version is `v=17`. |
| 53 | 2026-11-23 | **Owner: use the Saturn engraving as the theme.** Analysed it (§6e) and wrote `tools/make_engraving.py`. The first render's contours were too small and busy, so the noise frequency was lowered, the contours stretched into long bands and dimmed (k 7→5, 0.62→0.48). |
| 54 | | Appended the v6 theme block to `style.css`: black default palette, white-theme override, scan-line texture, engraving hero/banner, monochrome versions of every color-filled component (feature card, tags, awards, dates, join box, bench). `main.js`: black is the default when no theme is saved, and the logo square is fixed to brand blue `#3D5BFF`. |
| 55 | | Launched in the browser pane. **Fixed:** the hero's "Explore the lab" button rendered blank (white on white) because a later `.hero-img .btn` rule overrode the text color, so the selector is now `.hero-img .btn.btn-dark`. |
| 56 | | Verified: black by default, toggle switches to pure white, Calibri only, no console errors, 0px overflow at 375px on all 5 pages. Screenshots: `screenshots/v6-engraving-*.png`. Asset version is `v=20`. |
| 57 | | **Owner: keep the theme, use the black-hole photo with the INSIA mark in the hole.** Copied the photo to `Theme/blackhole-hand.jpg` (unpublished) and wrote `tools/make_blackhole.py` (§6f). |
| 58 | | Iterations: (1) random-dash engraving: the photo was too dark and only the glow survived; (2) level stretch + shadow lift: the hand appeared but the mark was too small; (3) switched to a **line-screen** with sharpening: hand and shelves readable, but the ring read gray because only every 3rd row is lit, and measuring showed the ring at 253–255 in the source; (4) drew the ring and streak solid with bloom, which gives a clearly glowing black hole with the mark inside. |
| 59 | | Wired in: `.hero-img` uses `hero-blackhole.webp` on desktop and `hero-blackhole-mobile.webp` on phones (≤760px, image on top, text below over a bottom gradient). Updated the hero alt text. Verified in the pane on desktop and phone (375px, no overflow, no console errors). Screenshot: `screenshots/v7-blackhole-index.png`. Asset version is `v=21`. |
| 60 | | **Owner: remove the circle around the N, keep only the N, make it 3D and a little pixelated.** `make_blackhole.py` v8: the ring, dark disc and light streak are erased from the photo (soft elliptical mask, filled with blurred surroundings + a radial light glow), so the mark itself is the light source. New `pixel_mark_3d()`: the INSIA mark on an exact **24-unit pixel grid** (keeps the logo's 1-unit gaps; a first attempt on a 30-grid fused the blocks), **voxel-extruded 4 units toward the upper-right**, side faces stepping darker with depth, a 1-pixel highlight on the top edges, upscaled **nearest-neighbour (~6px pixels)** and blended with faint scan-lines. Mark ~150px on desktop, 130px on phone. Verified in the pane. Asset version is `v=22`. |
| 61 | | **Owner: "N more sliding, don't use the blue, use black and white."** `pixel_mark_3d()` now applies an **italic shear** (each pixel row slides right by 0.42 × its height, giving stair-stepped pixel edges) and a deeper extrusion (4 → 6). **Black & white only:** white blocks, side faces stepping light → dark gray, and the square as a **black face with a white pixel outline** (its sides darker). The mark is centered by its sheared width. The header/footer logo keeps its blue square (the owner's request covered the hero N). Asset version is `v=23`. |
| 62 | | **Studied MMLab@NTU** (Team, Home, Research) in the pane (the headless full-page capture failed because their 100vh hero stretched) and recorded the ideas (§6g). Reviewed the 3 new Theme images (§6g): none publishable. |
| 63 | | `data.js`: appended a v8 block with `authors` + `summary` for all 12 works, mentor `bio`s (written only from facts already on the site), default `role` per group, the alumni `now` hook, and `INSIA.achievements` (4 items). Validated with Node: 12/12 works enriched. |
| 64 | | `main.js`: project-style news cards; mentor feature blocks; uniform member cards with a footer link strip; Achievements section. `style.css`: v8 palette block (blue accent, off-white ink, orange limited to awards and "now") + component styles. |
| 65 | | Verified: 2 bios, 21 cards with roles, 4 achievements, no console errors, 0px overflow at 375px on all 5 pages. Restored the owner's saved white-mode choice after testing. Screenshots: `screenshots/v8-team-dark.png`, `v8-index-dark.png`. Asset version is `v=24`. |
| 66 | | v9 round (§6h): removed the inner-page strip, full lab name in the hero, "Research" added to the nav, new smooth hero art, the smooth CSS layer, Director restructured with a script (tag balance verified, old tab script replaced), figure backgrounds on research cards, new Research page + renderer, Publications `?q=` pre-filter. |
| 67 | | Verified: all 6 pages return 200 with **no console errors in a fresh tab** (earlier 404s came from `research.html` being opened before it existed); Research shows 5 directions / 19 project links / 12 featured projects / funding; `?q=radar` → 3/35; Director has 3 stacked parts, 35 papers, no tabs or two-column grids; 0px overflow at 375px on all 6 pages. Strengthened the figure backgrounds (opacity .2 → .3). Screenshots: `screenshots/v9-*.png` (light + dark). Asset version is `v=30`. |
| 68 | | **Owner: the hero isn't working, try something else.** New v10 hero (§6i): a generated navy glow + blue/white wave ribbon, with a separate floating 3D mark layer. **Fixed:** "Next-gen" broke at the hyphen (non-breaking hyphen + 16ch title). Verified on desktop and phone (mark and title don't overlap, 0 overflow, no console errors); moved the photo-derived heroes into `Theme/old-heroes/`. Asset version is `v=32`. |
| 69 | | **Owner: floating N not working; use something from the Themes; blend with the black header; round the mentor photos.** New v11 hero (§6j) after 3 iterations; removed the floating-mark layer; header/hero seam removed (border 0, pixel probe = pure black); mentor photos 14px radius. Verified with headless renders at 1440px and 1030px (the pane was hidden, so its frames were stale) + phone (portrait art, 0 overflow). Screenshot: `screenshots/v11-home-hero.png`. Asset version is `v=34`. |
| 70 | | **Final overview (§6k):** wrote `tools/layout-audit.js` and audited all 6 pages; introduced the golden-ratio spacing/type/column system; removed per-page inline spacing; aligned the Director header; capped line lengths; removed stray trailing margins; compensated the slider scrollbar. Re-measured: one left edge, 68/110/42 rhythm, golden columns 1.62/2.62, 39–73 characters per line; phones 0 overflow with the scale stepped down. Renders: `screenshots/final-*.png`. Asset version is `v=37`. |
| 71 | | **Owner: try blue, red and partially-golden themes from the new Theme images.** Reviewed N1–N7 and mapped them to themes (§6l). Generated 6 hero renders; after the first pass, tuned red (hotter glow), gold (gold-not-cream bokeh) and blue (fewer, varied stars). Added the v13 accent-token system, replaced every hard-coded blue, made the logo square follow the theme, and added the header switcher + `?accent=` preview. Verified: all 3 themes in light and dark (comparison board), switcher fits at 375px, no console errors. Asset version is `v=38`. |
| 72 | | **Owner: animate the wave, stems up/down like sample amplitudes.** Added `hero-wave.js` (live canvas travelling wave + signed stem plot, theme colours and extras), CSS v14, image fallback, reduced-motion still frame, off-screen pause. Verified desktop (3 themes), 375 px, reduced motion (§6m). `v=40`. |
| 73 | | **Owner: mission & vision in About; keep 3 themes with visitor buttons.** Wrote and placed the draft (§6n), CSS v15, outlined header dot pill, labelled footer picker. Verified light/dark, mobile, sync. `v=42`. |
| 74 | | **Owner: launch on GitHub.** Created public repo `knfaisal/insia-lab-website`, pushed, enabled Pages; preview live and checked (all pages 200, hero animation, no broken images or console errors). DNS on Namecheap still points to Google Sites; switch steps in §9. |
| 75 | | **Owner: domain switched; remove `.html` from addresses.** www CNAME → GitHub, Google Sites released, certificate issued, HTTPS enforced. Clean URLs across pages/JS/redirects, removed clashing `contact/` + `news/` stubs, fixed garbled arrow on the 404 page, added `tools/serve.py` for local preview. Verified all pages and links. `v=43`. |
| 76 | | **Owner: still "Not secure".** Bare domain moved to A records; GitHub certificate for both names requested but stuck at `new` (DNS verified correct; domain reset once). Added a script redirect from http to https://www so no visitor lands on the insecure page meanwhile. `v=44`. |
| 77 | | **Owner: add new members serially, chronological, Level 2 and 3 distinguishable.** Added 8 Level 3 + 8 Level 2 members as two Team sections with level badges (§6o), CSS v16, initials fallback for missing photos. Verified in browser, no broken images. `v=45`. |

---

## 6b. Redesign v2: "simple and elegant" (2026-11-22)

**Feedback:** "What you have made is looking like AI. I want simple and elegant." Reference: <https://sdmrnwashere.github.io/> (screenshots `ref-sdmrn-*`).

### What made v1 feel AI-generated
| v1 element | Why it reads as AI |
|---|---|
| Blue→violet→cyan gradient text and buttons | The default look of AI landing pages |
| Neon glowing waveform canvas, cursor glow, grid overlay | Effects for their own sake |
| Dark "glass" panels, giant outlined footer wordmark | Template tropes |
| Count-up stat band, infinite marquee | Startup-landing clichés, not academic |
| Space Grotesk everywhere | Techy and generic |

### What the reference does well
- A **warm paper background** (`#F4F3EF`) with near-black ink: it feels printed, not like a screen.
- An **elegant serif display face** (Instrument Serif) with an **italic word as the accent**, for example "Selected *papers*".
- Small **monospace labels** for section numbers (`§ 01`), dates and venues: an academic, footnote feel.
- **Hairline rules** under headings, thin-bordered cards, line-art icons.
- **One accent color**. Motion is limited to gentle fades.
- A photo treated as a figure in a paper, with a "Fig. 1" caption.

### v2 direction: "Lab journal"
INSIA's version of that language (not a copy of a personal site):
- **Palette:** paper `#F5F4F0`, ink `#141416`, muted `#6B6B70`, rule `#E3E1DA`, and **one accent from the logo: INSIA blue `#2438E0`**. Dark mode uses warm charcoal `#131315`.
- **Type:** Instrument Serif for headings (italic for emphasis), Geist for body, Geist Mono for labels, venues, years and `§` numbers.
- **Home hero:** no canvas. A large serif title and a short paragraph, with a real lab figure on the right captioned "Fig. 1".
- **Sections:** `§ 0n` + serif title + hairline rule. Research directions become a quiet numbered grid with thin line icons.
- **News:** figure cards with thin borders that don't lift on hover. **Publications:** a typeset reference list. **Team:** photo grid with names in serif.
- **Motion:** a short fade-up on scroll and a gentle image fade. Nothing glows, nothing moves on its own. All of it is off under reduced-motion.
- **Removed:** gradients, glow, canvas hero, cursor glow, progress bar, marquee, count-up band, dark CTA box, outlined footer wordmark.

## 6c. Hybrid v3: v2 "Lab journal" × NSA Lab (2026-11-22)

**Request:** "Can you mix the one you made with the NSA website?"

| Taken from **NSA Lab** | Kept from **v2** |
|---|---|
| Black header bar with a large two-line UPPERCASE wordmark and an uppercase menu; a thin line *above* the active item | Warm paper body, Instrument Serif headings with an italic blue accent |
| Full-bleed dark scientific image as the home hero | `§ 0n` mono section numbers, typeset publication list, CV-style Director page |
| A dark image strip under the header on every inner page | Research grid, figure cards, captioned "Fig. 1" |
| Section titles followed by a hairline running to the right edge | One accent color, gentle fade-in only |
| Oval portraits for people, centered names | Grayscale photos that turn to color on hover |
| Minimal black footer | Light/dark theme |

**Hero image:** instead of stock art, `tools/make_hero.py` renders a **simulated radar micro-Doppler signature of a walking person** (torso plus swinging limbs plus 40 weak scatterers, STFT, INSIA blue duotone). It ties in with the lab's radar HAR papers. The first attempt (plain chirps) looked thin and neon, and two chirps folded past the Nyquist limit, so it was replaced. Outputs: `assets/img/hero-tfr.webp` (77 KB) and `banner-tfr.webp` (41 KB).

## 6d. Retro v4: "Retro scientific poster", Calibri only (2026-11-22)

**Request:** "See the Theme folder, I have added many images. I want it retro. Use only Calibri for the font overall, no other fonts."

### Mood board analysis (`Theme/`, 17 images)
| Trait | Seen in |
|---|---|
| **Halftone / dot-screen** imagery | 1 (planet linework), 12 (hands), 15 (clouds) |
| **Risograph grain and speckle**, aged paper | 9 (blue liquid speckle), 4 (glitch brain on paper) |
| Black ground with **cream chalk linework**, math as art | 3 (Σ), 5 (line burst), 7 (3-D wave) |
| **Amber/orange waves** on black | 8, 10, 11 |
| **Cobalt blue** accents | 2, 9, 14 |
| Tiny **technical data blocks**, vertical **date stamps** | 2, 4, 5 |

### Retro system
- **Font:** `Calibri` only (`font-family: Calibri, sans-serif`; the generic fallback exists only for devices without Calibri, such as some Macs, Linux and Android). Google Fonts removed. Hierarchy comes from weight, size, uppercase and letter-spacing.
- **Palette:** paper `#EFE7D6` with a grain overlay, ink `#16140F`, **cobalt `#2442C9`**, **amber `#E2702B`**, black poster sections `#0E0D0B` with cream text.
- **Print feel:** 2px ink borders, hard offset shadows (`6px 6px 0`), "FIG. 01 / NO. 03" labels, a vertical date stamp, cobalt/amber stripes under the masthead.
- **Imagery:** the lab's own radar signature re-rendered as an **amber halftone**. Team photos get a grayscale + halftone screen that turns to color on hover.
- **Copyright:** the `Theme/` images look like third-party artworks (one is signed "PS DESIGN BY BEAR"), so they are used **as reference only and not published**. `Theme/` should be kept out of the GitHub repo (`.gitignore`).

## 6e. v6 "Engraving" theme (2026-11-23)

**Request:** use the Saturn line-art image (`Theme/2765cdce….jpg`) as the theme, launch the site, and re-edit.

**Reference analysis:** pure monochrome; every form is built from **white horizontal scan-line strokes** on black (plotter/dot-matrix engraving); flowing **topographic contours** fill the sky; a **ringed planet + moon** shaded by hatch density; a faint **panel grid**; one glitch line.

**Approach:** the reference looks like third-party art, so `tools/make_engraving.py` **generates an original image with the same technique**: a domain-warped noise field turned into contour lines, a lit planet with banded texture, tilted rings with a Cassini-style gap that are hidden behind the planet, a moon, the panel grid and a glitch line, all rendered as random-dash scan lines every 3px. Hero 117 KB, banner 28 KB.

**Site:** monochrome, **black by default** (the white theme stays on the toggle); warm-white ink `#EDEDE6`, gray italics `#A9A9A2`, hairlines `#262624`; a faint scan-line texture over the page; white numbered boxes; inverted feature card; dot-screened photos. The only color is the logo's blue square. Still Calibri only.

## 6f. v7 "Black hole" hero (2026-11-23)

**Request:** keep the engraving theme, but use the owner's photo (a hand reaching toward a glowing black hole in a library) with the **INSIA mark inside the black hole**, blended into the theme.

**Caution recorded:** the photo appears to be third-party work. The source is kept in `Theme/blackhole-hand.jpg` (gitignored, never published), but the derived hero is published. **Credit the photographer or obtain permission before launch.**

**How it's made (`tools/make_blackhole.py`):** find the ring automatically (bright-pixel centroid; inner radius at the 10th percentile), stretch the levels and lift the shadows, sharpen, and roll off the highlights. Render the photo as a **line-screen engraving** (continuous strokes every 3px, so the hand and shelves stay readable). Draw the ring and light streak solid with a soft bloom, darken the hole, and set the INSIA mark inside with crisp strokes and a glow, the blue square in brand blue. Same panel grid and glitch line as the theme. Desktop 1920×1080 (photo on the right, black on the left for the headline) and a 900×1100 phone crop.

## 6g. v8: ideas from MMLab@NTU + Black · White · Blue (2026-11-23)

**Request:** study <https://www.mmlab-ntu.com/team.html> for *ideas* (not a copy), especially how they show their work and introduce the team. Palette: black, white, blue, and decide whether the off-white/orange from the retro version belongs. Review the new Theme images.

### What MMLab does well, and how INSIA adapts it
| MMLab idea | INSIA version |
|---|---|
| Faculty get a big feature block: photo, NAME, title in accent, full bio, icon links | **Mentor blocks**: uppercase name, blue role, position line, **bio paragraph** (`bio` added in data.js), link buttons |
| Members as uniform cards: photo, NAME, degree line in accent, links in a separate footer strip | **Member cards**: halftone photo, uppercase name, **blue role line**, links in a shaded footer strip so cards align |
| Alumni cards show *where they went* ("→ Research Scientist @ Meta") | Optional **`now`** field per person → "→ PhD student @ …" line (fill in data.js) |
| An "Achievements" section crediting students by name | **Achievements** on Team: year (blue), award (orange ★), venue, people (PI bold) from `INSIA.achievements` |
| Featured projects: thumbnail + title + authors + venue + links + short abstract | **Recent Work cards** now show **authors** (PI bold) + a **one-line plain summary** (`authors`/`summary` merged into news) |
| Numbered highlight tiles + dated news feed | Already covered by the "On the bench" card; not duplicated |

### Theme images (new)
- `78c6…jpg` (astronaut reaching into light): it confirms the reaching-hand motif of the current hero, but shows the **NASA insignia + US flag** and is professional third-party art, so it is **not published**.
- `8892…jpg` (hands drawing planets): an excellent **blue + orange** palette reference, but it carries the **artist's watermark "@ink_illusion 雲男"**, so it is **not published**.
- `f6c6…jpg` is a duplicate of the black-hole photo already in use.

### Palette decision
- **Black / white / blue** is the system; **blue** (`#5B7BFF` on black, `#2442C9` on white) is the single accent: section numbers, italic words, labels, links, key numbers, the feature card.
- **Off-white: yes, subtly.** Body text on black is warm off-white `#F3F0E8` (softer than pure white, keeps the retro warmth); in white mode the page stays pure white and cards get a faint `#FBF9F4`.
- **Orange: yes, but only as a signal color for awards and "now"** (★ awards, the bench "Now" dot, award badges on Publications): under 5% of the page. As blue's complement it makes achievements pop; used more widely it would fight the blue.

## 6h. v9 "Smooth" (2026-11-23)

**Feedback:** remove the image strip on inner pages (keep only Home's image); give the full lab name as the Home title; no sliding N, **no retro, smooth instead**; Director as **one long single-column page**; research directions with **real images as blended backgrounds**; a new **Research** subpage showcasing the work, in the spirit of the demo sites.

- **Hero:** `tools/make_hero_smooth.py` keeps the photo photographic (no scan-lines), tones it black → navy → INSIA blue → white, erases the ring, and floats a **straight, smooth 3D N** (60-layer extrusion with a light→dark side gradient, soft shadow, rendered at 4× and downsampled). Title: "Intelligent Next-gen **Signal & Image** Analysis Lab".
- **Smooth style (CSS v9):** removed the scan-line overlay and halftone photo screens; rounded corners (14px), pill buttons/nav/chips, normal-case headings and nav, gentle hover lifts with a soft blue shadow, slower easing.
- **Image strip removed** from all inner pages (the `main.js` banner injection was deleted).
- **Director:** one column: portrait → name → intro → link pills → numbered parts (Profile, Research, Teaching) stacked; tabs and two-column wrappers removed (checked: 0 tabs, no multi-column grids; `#research`/`#teaching` anchors still work).
- **Research directions (Home):** each card uses the matching lab figure as a background: inverted + screened as white line-work on black, multiplied as dark line-work on white, with a blue wash and a fade behind the text; it comes forward on hover. Cards link to their section on the Research page.
- **New `research.html`:** intro + jump pills; one alternating row per direction (figure, description, its projects, "See related papers →" which opens Publications pre-filtered via `?q=`); **Featured projects** as media rows (figure, linked title, authors, venue/IF, summary, clickable direction tags); **Funding**; a collaborate call-to-action. Works are tagged by direction in `data.js` (`areas`).
- Added `?theme=light|dark` for previews (doesn't touch a visitor's saved choice).

## 6i. v10 hero: "signal through the mark" (2026-11-23)

**Feedback:** "title page thing is not working, try something else."

**New concept, fully generated with no photo (so no copyright issue):** `tools/make_hero_v10.py` renders
- a **background**: black with a deep-navy glow and a smooth ribbon of 180 thin superimposed waves in INSIA blue → white, born as a single thread on the left and opening out (the "signal"); a separate portrait version for phones;
- the **3D INSIA mark** as its own transparent image (`insia-mark-3d.webp`), layered in HTML so it **floats** (7s ease-in-out drift with a slight tilt, blue drop-shadow glow; off under reduced-motion).

The text sits on clean dark space on the left (title max 16ch, non-breaking hyphen in "Next‑gen"); on phones the mark floats at the top and the text sits below.

**Housekeeping:** the old photo-derived heroes (`hero-blackhole*`, `hero-smooth*`) were moved out of `assets/img` into `Theme/old-heroes/` (gitignored) so they can't be published by accident; their remaining CSS rules are overridden and never requested (verified: only `hero-v10*` loads).

## 6j. v11 hero: multichannel wave surface (2026-11-23)

**Feedback:** the floating N isn't working; try something else from the Theme images; it should blend with the black header; mentor photos should be rounded.

**Choice from the Theme folder:** image 7 (*3D waveform over a grid*) suits a signal lab best. `tools/make_hero_v11.py` draws an **original** version (no pixels from the reference):
- 42 smooth signal **channels** forming one sweeping 3D wave surface (like multichannel EEG), white at the front fading to INSIA blue at the back;
- **sampling stems** (discrete-time "lollipops") dropping from the front channel to a faint floor grid;
- pure-black background with every edge faded to `#000`, plus a soft glow.

Iterations: (1) a time-frequency wireframe in both directions was too tangled and sat too low; (2) waterfall slices became a "wall of spikes"; (3) **one smooth wave surface + stems** was clean and elegant, and was kept.

**Blending:** on Home the header has no border or shadow and both header and hero are pure `#000`; a pixel probe confirms there's no seam. The text sits over a left-to-right black fade, so it stays readable at 1030px and 1440px. On phones a portrait render puts the waves on top and the text below.

**Mentor photos:** rounded corners (14px) like every other image.

## 6k. Final overview: breathing space, alignment, golden ratio (2026-11-23)

**Method:** `tools/layout-audit.js` (dev only) measured every page at 1440px: content left edges, gaps between sections, gap under section heads, characters per line, heading sizes and two-column ratios. Fixes were applied, then everything was re-measured.

### The golden-ratio system (CSS v12)
| Scale | Values |
|---|---|
| Spacing (16 × φⁿ) | `--s1` 10 · `--s2` 16 · `--s3` 26 · `--s4` 42 · `--s5` 68 · `--s6` 110 · `--s7` 178 px |
| Type (17 × φⁿ) | body 17 · lede 21.6 (17×√φ) · h3 27.5 · h2 44.5 · h1 72 |
| Line height | 1.618 |
| Columns | text : figure = **1.618 : 1**; text : photo = **2.618 : 1** |
| Rhythm | section → section **110** · page title → first block **68** · section head → content **42** · card padding **26**; on phones each steps down one level |

### Before → after (1440px)
| Check | Before | After |
|---|---|---|
| Left edges | all 132px except **Director header 302px** | **all 132px** (second columns only where intended: bench card, map) |
| Page title → first block | 56 / 62 / 64 / 72 / 78 px | **68px** on every page (Team 63) |
| Section head → content | 24 / 34px | **42px** everywhere |
| Home section gaps | 93–104px | **110 · 110 · 105 · 98→110 · 110** (slider scrollbar compensated) |
| Line length (ideal 45–75 ch) | up to **83** | **39–73** (summaries/bios capped at 62ch; paragraphs at 66ch) |
| About / research rows / projects / mentors / contact | 1.39 / 1.05 / 2.21 / 3.44 / 1.10 | **1.62 / 1.62 / 1.62 / 2.62 / 1.62** |
| h1 / h2 | 86 / 48px | **72 / 44.5px** (φ³, φ² × 17) |

**Root causes fixed:** inline `padding-top` / `margin` values on individual pages (replaced by the scale tokens), the Director header's centered 820px container (now left-aligned on the shared container), and stray trailing margins on the last element of a block.

Final full-page renders: `screenshots/final-*.png`.

## 6l. Three colour themes: Blue · Red · Golden (2026-11-23)

**Request:** try 2–3 themes (1 blue, 2 red, 3 partially golden), using the 7 new Theme images.

| Theme | Mood images | Hero treatment (`tools/make_hero_themes.py`, original renders) | Accent (dark / light) |
|---|---|---|---|
| **Blue** (default) | N1 blue nebula with star flares | sparse star flares of varied brightness | `#5B7BFF` / `#2442C9` |
| **Red** | N2 neon-red waveforms + reflection, N4 red dotted data waves | hot neon glow (×2.1), dotted samples | `#FF4D5E` / `#C8102E` |
| **Golden, partial** | N5 gold particle net, N6 glowing waves + bokeh, N7 gold mesh over teal, N3 amber neuron | gold glow + gold bokeh orbs with a hint of teal | `#E8B04B` / `#9A6B12` |

**"Partially golden":** gold is used only for type, numbers, highlights and outlines (number boxes and the active menu pill become gold *outlines*; the feature card stays black). Big fills remain black and white, so gold reads as a precious accent rather than a wash.

**How it works:** `html[data-accent="blue|red|gold"]` overrides the accent tokens (`--blue`, `--accent-hi`, `--accent-glow`, `--logo`, `--on-accent`) for both light and dark; every previously hard-coded blue (hero highlight, bench, glows, shadows, logo square) now uses those tokens. A **three-dot switcher** in the header sets the theme and remembers each visitor's choice; `?accent=red` previews a theme without saving. Default = blue.

**Comparison board:** `screenshots/themes-compare.png`.

## 6m. Animated hero wave (2026-11-23)

**Request:** animate the wave; the stems should move up and down like sample amplitudes.

- `assets/js/hero-wave.js` draws the hero live on a `<canvas>`: 42 channels of a **travelling wave** (crest moves left→right, ~6 s per cycle, slow "breathing" of the amplitude) on the same 3D view as the still render (elev 24°, azim −62°).
- Front edge = a **stem plot of the sampled signal**: 24 stems from a zero line, each rising *and falling* with the current amplitude, with a dot on each tip.
- Colours follow the theme (`data-accent`) and switch instantly. Theme extras: blue: twinkling star flares; red: a faint mirrored reflection under the floor and stronger glow; gold: slowly drifting gold and teal bokeh.
- Glow = a quarter-size copy of the canvas blurred by CSS (cheap). Edges fade via CSS mask; the left gradient keeps the title readable.
- **Fallbacks:** without JS the still `hero-{accent}.webp` image shows; with *reduce motion* one still frame is drawn; the loop pauses when the hero is off-screen or the tab is hidden.
- **Measured:** about 1.2 ms per frame (fine for 60 fps); no overflow at 375 px; no console errors. Renders: `screenshots/wave-*.png`. Asset version is `v=40`.

## 6n. Mission & vision + visitor theme choice (2026-11-24)

**Request:** add a combined mission & vision in the About section, written from the owner's notes (limited research facilities in Bangladesh; few experienced PhD mentors who sit with students in a friendly way; no research-lab culture yet; publish foundational, translational and applied work that works in real life; produce research scientists for the world and for Bangladesh; members learn from basics to advanced). Keep all three themes and let visitors choose.

**Draft on the site (Home → About, `#mission`):**
- *Why we exist:* Bangladesh has no shortage of talented students, but few places where they can do serious research. Facilities are limited, experienced researchers are few and stretched thin, and a day-to-day research-lab culture has yet to take root. INSIA was started to change that.
- *Vision:* A Bangladesh where world-class research is done at home, and where scientists trained here help shape their fields worldwide.
- *Mission:* To build the research culture Bangladesh is missing: a friendly lab where students work side by side with experienced researchers, grow from the fundamentals to the frontier, and publish work that matters in the real world.
- Four commitments: 01 Mentorship up close · 02 From basics to frontier · 03 Work that matters (foundational, translational, applied) · 04 Scientists for Bangladesh and the world.

Tone choice: states the gap plainly but positively (no criticism of people or institutions).

**Theme choice for visitors:** the three header dots now sit in one outlined pill so they read as a control, and the footer has a labelled picker (Theme: Blue · Red · Golden). Both stay in sync and remember the choice. Default stays Blue.

Verified: dark/blue and light/gold desktop renders, 375 px (no overflow), picker sync. Asset version is `v=42`.

## 6o. Level 3 and Level 2 members (2026-11-28)

- **Source:** `New Members/` (kept out of git): Level 2 photos + `Info.docx`/`Labib.docx` (links), Level 3 sign-up sheet `Level 3.xlsx` (links; photos only as Google Drive links).
- **Groups:** two new Team sections after *Undergraduate Lab Members*, before *Alumni*: **Level 3 Members** (third-year) then **Level 2 Members** (second-year). Level = MIST academic year.
- **Order:** chronological within each level. Level 3 by sign-up-sheet timestamp; Level 2 by the time each photo/file was submitted (Mayesha, Rafid, Puja, Labib, Shahriar on 16 Oct; Sahiba 17 Oct; Ayesha, Jarin 20 Nov).
- **Telling them apart:** own section heading and intro line, plus a badge on every photo: Level 3 solid accent pill, Level 2 outlined pill (theme-aware, CSS v16).
- **Photos:** Level 2 cropped to head and shoulders, 720×900 WebP (Puja's HEIC converted with Windows imaging, Labib's taken from his .docx). Level 3 cards show initials until photos are added: drop `assets/img/team/<slug>.webp` and add `photo:` to the person in `data.js`.
- **Links cleaned:** tracking parameters removed, Scholar links reduced to `?user=ID`. Skipped: Rafiul's LinkedIn (none yet) and ResearchGate ("Machine", not a link); Sahiba has Scholar only.

## 7. Go-live checklist

- [x] Copy the images from Google Sites into `assets/img/` and relink them (done, step 17–22)
- [x] Match the logo to the original (done, step 21)
- [ ] Optional: add a figure for the "Single-Channel Wearable EEG" news item (`assets/img/news/`, then set `image:` in `data.js`)
- [ ] Create the GitHub repo and push (§5)
- [ ] Turn on GitHub Pages and check that the custom domain `www.insia-lab.com` is accepted
- [ ] Update DNS at the registrar (§5) and remove the Google Sites mapping
- [ ] Enforce HTTPS
- [ ] Check every page on a phone

## 9. Deployment (2026-11-24)

- **Repo:** https://github.com/knfaisal/insia-lab-website (public, branch `main`, GitHub Pages from `/`).
- **Preview (live now):** https://knfaisal.github.io/insia-lab-website/ (the old-URL redirect pages and the 404 page use root paths, so they only work once the custom domain is active).
- **Not published:** `Theme/` (third-party reference images), `screenshots/`, `.claude/`. `CNAME` is held back until DNS points to GitHub, otherwise the preview would redirect to the old Google Site.
- **DNS (Namecheap → Domain List → insia-lab.com → Advanced DNS):**
  1. `www` CNAME: change `ghs.googlehosted.com` → `knfaisal.github.io`
  2. `@`: delete the URL Redirect record and add four A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  3. Keep any TXT records (Google verification, email).
- **After DNS:** commit `CNAME` (`www.insia-lab.com`), set the custom domain in Pages, wait for the certificate, turn on *Enforce HTTPS*, then remove the custom URL from Google Sites.
- **Live (2026-11-24):** www.insia-lab.com serves the GitHub site; Let's Encrypt certificate issued (valid to Feb 2027) and *Enforce HTTPS* on. The bare domain uses a Namecheap URL Forward to `https://www.insia-lab.com` (fine for `http://insia-lab.com`; replace it with the four A records if `https://insia-lab.com` ever needs to work). Keep the TXT records (Google Search Console verification, Namecheap email-forwarding SPF).
- **Bare domain https (2026-11-24, update):** the Namecheap URL Forward was replaced by the four A records, and GitHub was asked for a certificate covering `www.insia-lab.com` + `insia-lab.com`. DNS, CAA and GitHub's health check are all fine, but the request sat at state `new` for 5+ hours, even after the custom domain was cleared and set again. While it is pending GitHub refuses *Enforce HTTPS*, so `main.js` now sends any `http://` visitor on insia-lab.com to `https://www.insia-lab.com` itself (`v=44`). Once the certificate is issued: `gh api -X PUT repos/knfaisal/insia-lab-website/pages -F https_enforced=true`. If it is still `new` after 24 h, contact GitHub Support (Pages certificate stuck).
- **Clean addresses:** all links use `/research`, `/team` … (GitHub Pages serves `research.html` for `/research`; the old `.html` addresses still work). The redundant `contact/` and `news/` redirect folders were removed because they clashed with `/contact` and `/news`. Local preview: `python tools/serve.py` (mimics Pages: clean URLs + 404 page).
- **Updating the site:** edit files, `git commit`, `git push`; Pages rebuilds in about a minute.

## 8. How to update content later

| To… | Edit |
|---|---|
| Add a paper | Add an object to `publications` in `assets/js/data.js`. It appears on Publications and on the Director's Research tab |
| Add a news highlight | Add an object to the top of `news` in `data.js`, with its image in `assets/img/news/`. The newest 3 also appear on the home page |
| Add or move a team member | Edit `team.groups` in `data.js` and put the photo in `assets/img/team/` |
| Change the nav or footer | `NAV` and the footer template at the top of `assets/js/main.js` |
| Change colors or fonts | The `:root` tokens at the top of `assets/css/style.css` |
