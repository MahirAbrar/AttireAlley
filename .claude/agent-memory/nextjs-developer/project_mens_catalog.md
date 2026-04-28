---
name: Men's Catalog Page Redesign
description: Key decisions and patterns from the Men's product page redesign to utilitarian catalog index
type: project
---

The Men's page (`/products/men`) was fully redesigned as a utilitarian catalog index (no hero image, no daisyUI cards, no AUD suffix). Key decisions:

- `MensHero.js` is left on disk — only import removed from page. Used nowhere else.
- New `MensProductCard` (`src/components/MensProductCard/index.js`) is a page-scoped fork. `CommonListingClient` is untouched.
- Color filter is design-only; `Product` model has no color field. A single `// TODO:` comment marks this in the card component.
- `tailwind.config.js` extended with `ink: "#0b0d0d"` and `paper: "#f6f4ee"` colors.
- `.label` class added to `globals.css` (separate from `.label-mono`; different letter-spacing: 0.20em vs 0.18em).
- `.tabular` class added to `globals.css`.
- The "Men." heading uses `font-sans font-medium` with an explicit `style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}` override so the global `h1` Instrument Serif rule doesn't win (class specificity alone isn't enough for the `h1, h2, h3, h4` rule in globals.css — inline style is needed).
- Pagination: 9 items/page, ellipsis at >7 pages, "End of index" text at last page (no gray box).
- Filters wire against real product data; sort options are functional.

**Why:** User wanted a serious, utilitarian catalog aesthetic matching a reference screenshot.
**How to apply:** When touching the men's page again, do not re-introduce MensHero, daisyUI badges, AUD suffix, or scale-105 hover effects.
