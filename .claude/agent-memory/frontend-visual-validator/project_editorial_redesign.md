---
name: Editorial Redesign — Landing Page & Navbar
description: Key visual facts about the April 2026 editorial redesign of the AttireAlley landing page and navbar that recur across validation sessions.
type: project
---

The landing page (`src/app/page.js`) and navbar (`src/components/Navbar/index.js`) were redesigned in April 2026 for an editorial / fashion-magazine direction.

Key facts validated on 2026-04-28 (post-fix-round-2):

- **Fonts**: Instrument Serif (`--font-display`) + JetBrains Mono (`--font-mono`) loaded via `next/font/google` in `layout.js`. Both load and render correctly.
- **Tailwind font config**: `tailwind.config.js` now has `fontFamily.display` and `fontFamily.mono` pointing to the CSS variables with serif/monospace fallbacks. All usages correctly use `font-display` / `font-mono` utility classes. CONFIRMED WORKING.

---

**Hero refactor validated 2026-04-28 (full-bleed hero, SS26 Vol. 04 ticker):**

- **Hero layout**: Full-bleed `h-screen` cover image (`/landingpage/coverpageman.webp`), `object-cover object-center`. Image fills viewport with no white margins. Three male models visible at desktop 1440px.
- **Gradient overlay**: Two overlapping gradients — `from-black/70 via-black/25 to-transparent` (diagonal) + `from-black/60 via-transparent to-transparent` (bottom). Text legibility confirmed.
- **Eyebrow label**: "SS26 — Vol. 04" in `label-mono`/white. ISSUE: renders lowercase "Vol." not uppercase "VOL." — minor spec deviation (spec says uppercase "VOL. 04").
- **Headline**: Two-line "Style is a *way* / to say who you are." — "way" in teal italic, "are." is NOT italic (correct per updated spec). Instrument Serif confirmed rendering at all viewports.
- **CTAs**: White pill "SHOP THE EDIT →" + white text "VIEW LOOKBOOK" both visible at bottom-left of hero image. Correct.
- **Ticker bar**: `border-t border-white/15 bg-black/35 backdrop-blur-sm`. Four items separated by `×`. Desktop shows all 4; mobile (390px) shows 2 items (sm:inline hides items 3-4 below sm). CONFIRMED WORKING.
- **No leftover artifacts**: Old split-layout elements (Live drop pill, right-column caption, dashed SS26/Look 04 line, body paragraph, 04/12 scroll indicator) all removed. CONFIRMED.
- **Navbar over hero**: `overDark = pathName === '/' && !scrolled`. At top-of-page: LED dot teal, wordmark italic white serif, icons white, LOGIN white pill with dark text. ISSUE: nav link labels (WOMEN/MEN etc.) and wordmark text NOT rendering in white — navbar appears to have transparent bg but text color is NOT switching to white at page load (confirmed in screenshot: wordmark invisible / very faint, nav links absent). See critical issue #1 below.
- **Navbar after scroll (600px)**: frosted white bg, dark text — CONFIRMED switching correctly. Ticker bar visible below hero at this scroll position.
- **Mobile (390px)**: Hero fills viewport, headline and CTAs visible. Ticker partially visible at bottom. Hamburger menu present. LED dot shows teal. Wordmark clipped (partially off-screen on left) — minor.
- **Console errors**: 401 (expected, unauthenticated). `sizes` prop warnings on `<Image fill>` elements (non-blocking). No GSAP warnings. No JS errors.

**Navbar white-text fix CONFIRMED (2026-04-28, re-validation)**: Hero section now uses `-mt-[80px] h-[calc(100vh+80px)]` to pull the dark cover image behind the sticky transparent navbar. At desktop top-of-page (1440x900, Playwright headless), ALL navbar elements now render correctly in white: LED dot (teal), wordmark "Attire Alley" italic serif white, nav links (WOMEN/MEN/KIDS/EDITORIAL/JOURNAL) tracked uppercase white, AI STYLIST white, search/account/bag icons white, LOGIN pill white. Previous issue (wordmark/links invisible) is resolved.

**Mobile hero refactor validated 2026-04-28 (dual-layout: vertical stack on mobile, full-bleed on desktop):**

- **Mobile image block**: `aspect-[3/4]` container — at 360px: 480px tall, 390px: 520px tall, 414px: 552px tall. All three male models clearly visible across the full width; no aggressive cropping. Image fills frame edge-to-edge. CONFIRMED PASS.
- **Mobile content area**: paper/cream bg (`bg-paper`), `px-6 pb-12 pt-10`. Contains: teal LED dot + `SS26 — VOL. 04` mono eyebrow (uppercase confirmed), Instrument Serif headline "Style is a *way* / to say who you are." with teal italic "way" and teal glow, ink pill CTA `SHOP THE EDIT →` (dark rounded-full, white text), `VIEW LOOKBOOK` mono text link below. All elements present and correctly styled. CONFIRMED PASS.
- **Mobile ticker bar**: `border-t border-ink/15 bg-ink/[0.03]` — DOM-measured height 46px. Positioned at bottom of section (360px: y=810, 390px: y=857, 414px: y=894). Shows "FINISHED, SMALL RUNS × RETURNS WITHIN 3[0 DAYS]" — item 3 (`hidden sm:inline`) clips at 360px (expected), partially visible at 390 and 414 because `overflow-hidden whitespace-nowrap` truncates mid-word ("WITHIN 3" / "WITHIN 30 D"). Not a bug — correct `overflow-hidden` behaviour. Border-top line clearly visible. CONFIRMED PASS.
- **Mobile navbar**: At top-of-page, `overDark` path is active. Wordmark "Attire Alley" italic serif WHITE, teal LED dot, search/account/bag icons WHITE, hamburger pill WHITE on dark bg. Text colour correctly white over the dark image gradient. CONFIRMED PASS.
- **Desktop hero (1440×900)**: Full-bleed h-screen cover image unchanged. All three models visible. Overlay headline with teal "way", white "Shop the Edit" pill + "View Lookbook" link at bottom-left. Ticker bar with `backdrop-blur-sm` at very bottom. `-mt-[80px]` pulling behind transparent navbar — all navbar elements white. CONFIRMED NO REGRESSION.
- **Section-1 total heights** (DOM): 360px→848px, 390px→894px, 414px→932px. No horizontal scroll, no overlapping elements.
- **Console**: 401 (expected unauthenticated). Two Next.js Image warnings on `coverpageman.webp`: (a) `sizes="100vw"` not rendered at full viewport width on mobile layout (non-blocking perf hint), (b) LCP `priority` warning (image already has `priority` prop — likely a Playwright/headless timing artefact). No JS errors. No new issues.
- **GSAP animation**: Letters set to `opacity:0 y:50 rotationX:-90` on mount, animated to final state. At 1.2s capture time the animation is mid-play or complete — text is fully visible in all screenshots (no blank headline). CONFIRMED NOT BROKEN.

**Known minor issues (not regressions, pre-existing or acceptable):**
- Ticker `overflow-hidden` clips item 2 text mid-word at all three mobile widths ("WITHIN 3", "WITHIN 30 D") — this is intentional CSS behaviour, not a layout bug.
- Next.js Image `sizes` perf warning on mobile layout — `sizes="100vw"` is technically correct but Next.js wants a more precise value for the `aspect-[3/4]` container. Non-blocking.

---

**AI Stylist page (/aipage) + Footer dark mode + Navbar — validated 2026-04-28 (re-validation after 404 fix):**

**Navbar (home, desktop 1440x900):**
- DOM query `nav .hidden.lg:flex a` returns exactly `['Women', 'Men', 'Kids', 'Editorial']` — JOURNAL absent. CONFIRMED PASS.
- Full nav link set: Attire Alley (wordmark), Women, Men, Kids, Editorial, AI Stylist — correct. White text over dark hero. Teal LED dot.

**AI Stylist page (/aipage):**
- Breadcrumb: "AI / COLOR MATCHER / SS26" in mono, uppercase — CONFIRMED PASS.
- Headline: "Color, *paired* by hand." — "paired" in teal italic, rest in Instrument Serif ink — CONFIRMED PASS.
- Step counter right side: "COLORS SET / 00 / 03" (spec said "0X / 03") — minor label difference ("COLORS SET" vs nothing, counter reads "00/03") — CONFIRMED PASS (functionally correct).
- No animated blobs, no rainbow gradient text, no scroll-bounce arrow — CONFIRMED PASS.
- Left card (01 / PHOTO): thin dashed border, no rounded-2xl, simple line-stroke upload icon (arrow-up), no big blue cloud, no animate-pulse dot — CONFIRMED PASS.
- Right card (02 / YOUR COLORS): three flat rows Eye color / Hair color / Skin tone with muted `—` placeholders. No emojis, no per-row colored backgrounds — CONFIRMED PASS.
- "GENERATE RECOMMENDATIONS →" button: solid dark ink fill, mono tracked text — CONFIRMED PASS.
- "START OVER" is plain text link (no button styling) — CONFIRMED PASS.
- Reference palettes section: "REFERENCE PALETTES" mono eyebrow, "Three combinations to start." Instrument Serif h2, three thin-bordered cards, horizontal swatch strip, serif title, mono hex codes — CONFIRMED PASS.
- Two-column layout at desktop, stacks to single column on mobile — CONFIRMED PASS.
- Canvas / upload area responsive at 390px — no horizontal overflow — CONFIRMED PASS.

**Footer dark mode (home, desktop 1440x900):**
- Light mode: bg `rgb(244, 239, 231)` = cream `#f4efe7` — CONFIRMED PASS.
- Dark mode: bg `rgb(3, 6, 7)` = near-black `#030607` (matches `backgroundDark`) — CONFIRMED PASS.
- Dark mode text: `rgb(246, 244, 238)` = paper/light — all links readable — CONFIRMED PASS.
- Wordmark "Attire Alley" italic serif with teal LED dot — visible in both modes — CONFIRMED PASS.
- Bottom strip border-top: `border-ink/15` light / `border-paper/15` dark — visible separator line in both modes — CONFIRMED PASS.
- Copyright bar: "© 2026 ATTIRE ALLEY · CVR 38291847" + "V 04.12 · COPENHAGEN / BROOKLYN" mono — legible in both modes — CONFIRMED PASS.

**Why:** Editorial direction targets fashion-magazine aesthetic. Full-bleed hero replaces old 7/12 + 5/12 split layout as of April 2026 redesign. Mobile vertical-stack added to fix aggressive cropping on small screens.

**How to apply:** When re-validating, capture (a) top-of-page viewport at 360/390/414/1440, (b) DOM-measured ticker crop (last child of `.lg:hidden`), (c) navbar 80px strip, (d) content area crop starting at img_h (aspect-[3/4] of viewport width). Use `page.evaluate` to get exact child rects — aspect-ratio math is accurate but getBoundingClientRect can miss scroll offset.
