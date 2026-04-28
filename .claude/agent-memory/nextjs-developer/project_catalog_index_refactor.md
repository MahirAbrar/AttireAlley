---
name: Catalog Index Shared Component
description: CatalogIndex + CategoryProductCard extraction — apiCategory casing per route and component locations
type: project
---

All three category catalog pages now delegate to shared components. The design and behavior (masthead, sidebar, grid, pagination, empty state) lives in one place.

- `src/components/CatalogIndex/index.js` — shared page shell, accepts `category`, `title`, `breadcrumb`, `apiCategory` props
- `src/components/CategoryProductCard/index.js` — shared card, accepts `category` prop to build correct href `/products/${category}/${id}`
- Old `src/components/MensProductCard/index.js` is kept on disk (could be removed later) but is no longer imported anywhere

**apiCategory casing per route (must match MongoDB documents):**
- Men: `"men"` (lowercase)
- Women: `"Women"` (capital W — that is what the old women/page.js passed to getClientProducts)
- Kids: `"kids"` (lowercase)

**Why:** The Product schema stores category as a mixed-case string seeded by the admin. Changing the case would break existing DB rows.

**How to apply:** If the women's bucket is re-seeded, verify the category field in MongoDB still uses capital "Women". If it changes to lowercase, update `apiCategory` in `src/app/products/women/page.js`.
