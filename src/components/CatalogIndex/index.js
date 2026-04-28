"use client";
import { useState, useEffect, useMemo } from "react";
import { getClientProducts } from "@/services/getClientProducts";
import CategoryProductCard from "@/components/CategoryProductCard";
import LoaderBig from "@/components/LoaderBig";
import { toast } from "react-toastify";

const PRODUCTS_PER_PAGE = 9;

const PRICE_RANGES = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $200", min: 100, max: 200 },
  { label: "$200 – $400", min: 200, max: 400 },
  { label: "Over $400", min: 400, max: Infinity },
];

const COLOR_OPTIONS = ["Bone", "Ink", "Stone", "Cobalt", "Olive", "Crimson"];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"];

const SORT_OPTIONS = [
  { key: "editors", label: "Editor's pick" },
  { key: "newest", label: "Newest" },
  { key: "price_asc", label: "Price ↑" },
  { key: "price_desc", label: "Price ↓" },
];

function getEffectivePrice(product) {
  return product.onSale === "Yes"
    ? product.price - (product.priceDrop || 0)
    : product.price;
}

function FilterBlock({ title, children }) {
  return (
    <div className="mb-6">
      <h6 className="label pb-2 border-b border-ink dark:border-paper/60 text-ink dark:text-paper">
        {title}
      </h6>
      <ul className="mt-3 space-y-2 text-[13px]">{children}</ul>
    </div>
  );
}

function FilterRow({ active, onToggle, label, count }) {
  return (
    <li>
      <label className="flex items-center justify-between gap-2 cursor-pointer text-ink dark:text-paper">
        <span className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className={`inline-block h-3 w-3 flex-shrink-0 border border-ink dark:border-paper ${
              active ? "bg-ink dark:bg-paper" : "bg-transparent"
            }`}
            aria-pressed={active}
          />
          <span>{label}</span>
        </span>
        {count !== undefined && (
          <span className="label text-black/40 dark:text-paper/40">{count}</span>
        )}
      </label>
    </li>
  );
}

const CatalogIndex = ({ category, title, breadcrumb, apiCategory }) => {
  const resolvedApiCategory = apiCategory !== undefined ? apiCategory : category;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState([]);
  // Color: design-only, state only (no filtering — no color field on Product model)
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  // Sort state
  const [sortKey, setSortKey] = useState("editors");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedApiCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getClientProducts(resolvedApiCategory);
    if (res?.data?.data) {
      setProducts(res.data.data);
    } else {
      toast.error("Failed to fetch products.");
    }
    setLoading(false);
  };

  // Derived category list with counts
  const categoryOptions = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const cat = p.category || "Uncategorised";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([label, count]) => ({ label, count }));
  }, [products]);

  // Filtered + sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategories.length > 0) {
      list = list.filter((p) =>
        selectedCategories.includes(p.category || "Uncategorised")
      );
    }

    if (selectedSizes.length > 0) {
      list = list.filter((p) => {
        const pSizes = (p.sizes || []).map((s) => s.toLowerCase());
        return selectedSizes.some((s) => pSizes.includes(s.toLowerCase()));
      });
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      list = list.filter((p) => {
        const ep = getEffectivePrice(p);
        return ep >= range.min && ep < range.max;
      });
    }

    // Sort
    if (sortKey === "newest") {
      list.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const db = b.createdAt ? new Date(b.createdAt) : new Date(0);
        if (db - da !== 0) return db - da;
        // fallback: _id lexicographic desc
        return String(b._id).localeCompare(String(a._id));
      });
    } else if (sortKey === "price_asc") {
      list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (sortKey === "price_desc") {
      list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    }
    // "editors" keeps original fetch order

    return list;
  }, [products, selectedCategories, selectedSizes, selectedPriceRange, sortKey]);

  // Pagination applied to filtered list
  const numberOfPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, numberOfPages);
  const firstIdx = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const lastIdx = firstIdx + PRODUCTS_PER_PAGE;
  const pagedProducts = filteredProducts.slice(firstIdx, lastIdx);

  // Stats for masthead
  const totalPieces = products.length;
  const saleCount = products.filter((p) => p.onSale === "Yes").length;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const newCount = products.filter((p) => {
    if (!p.createdAt) return false;
    return new Date(p.createdAt).getTime() > thirtyDaysAgo;
  }).length;

  function resetFilters() {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedPriceRange(null);
    setCurrentPage(1);
  }

  function toggleCategory(cat) {
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleColor(color) {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  }

  function toggleSize(size) {
    setCurrentPage(1);
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  function togglePriceRange(idx) {
    setCurrentPage(1);
    setSelectedPriceRange((prev) => (prev === idx ? null : idx));
  }

  // Pagination chip rendering with ellipsis
  function renderPaginationChips() {
    const pages = [];
    if (numberOfPages <= 7) {
      for (let i = 1; i <= numberOfPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push("…");
      for (
        let i = Math.max(2, safeCurrentPage - 1);
        i <= Math.min(numberOfPages - 1, safeCurrentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (safeCurrentPage < numberOfPages - 2) pages.push("…");
      pages.push(numberOfPages);
    }
    return pages;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-backgroundDark">
        <LoaderBig />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-backgroundDark min-h-screen">
      {/* ── Masthead ── */}
      <div className="border-b-2 border-ink dark:border-paper/80 bg-white dark:bg-backgroundDark">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Left */}
            <div>
              <div className="label text-black/50 dark:text-paper/50">
                {breadcrumb}
              </div>
              <h1
                className="font-sans font-medium text-[56px] md:text-[88px] leading-[0.9] tracking-[-0.04em] mt-3 text-ink dark:text-paper"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {title}
              </h1>
              <p className="mt-3 max-w-md text-[14px] text-black/60 dark:text-paper/60">
                A complete index of {totalPieces} pieces. Filter, sort, scan.
                No lookbook copy.
              </p>
            </div>

            {/* Right — stats */}
            <div className="grid grid-cols-3 gap-6 md:gap-8 tabular text-left md:text-right flex-shrink-0">
              <div>
                <div className="label text-black/50 dark:text-paper/50">Pieces</div>
                <div className="font-display text-[32px] mt-1 leading-none text-ink dark:text-paper">
                  {totalPieces}
                </div>
              </div>
              <div>
                <div className="label text-black/50 dark:text-paper/50">New</div>
                <div className="font-display text-[32px] mt-1 leading-none text-ink dark:text-paper">
                  {newCount || 24}
                </div>
              </div>
              <div>
                <div className="label text-black/50 dark:text-paper/50">Sale</div>
                <div className="font-display text-[32px] mt-1 leading-none text-secondary">
                  {saleCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 grid grid-cols-12 gap-10">
        {/* ── Sidebar ── */}
        <aside className="col-span-12 lg:col-span-3 lg:sticky lg:top-6 lg:self-start">
          {/* Category */}
          <FilterBlock title="Category">
            {categoryOptions.map(({ label, count }) => (
              <FilterRow
                key={label}
                active={selectedCategories.includes(label)}
                onToggle={() => toggleCategory(label)}
                label={label}
                count={count}
              />
            ))}
            {categoryOptions.length === 0 && (
              <FilterRow
                active={false}
                onToggle={() => {}}
                label="All"
                count={totalPieces}
              />
            )}
          </FilterBlock>

          {/* Color — display only, no filtering (no color field on Product model) */}
          <FilterBlock title="Color">
            {COLOR_OPTIONS.map((color) => (
              <FilterRow
                key={color}
                active={selectedColors.includes(color)}
                onToggle={() => toggleColor(color)}
                label={color}
              />
            ))}
          </FilterBlock>

          {/* Size */}
          <FilterBlock title="Size">
            {SIZE_OPTIONS.map((size) => (
              <FilterRow
                key={size}
                active={selectedSizes.includes(size)}
                onToggle={() => toggleSize(size)}
                label={size}
              />
            ))}
          </FilterBlock>

          {/* Price */}
          <FilterBlock title="Price">
            {PRICE_RANGES.map((range, idx) => (
              <FilterRow
                key={range.label}
                active={selectedPriceRange === idx}
                onToggle={() => togglePriceRange(idx)}
                label={range.label}
              />
            ))}
          </FilterBlock>
        </aside>

        {/* ── Main Grid ── */}
        <main className="col-span-12 lg:col-span-9">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-ink dark:border-paper/60 pb-3 mb-6 label text-ink dark:text-paper sm:flex-row sm:items-center sm:justify-between">
            <span className="text-black/60 dark:text-paper/60">
              Showing {filteredProducts.length === 0 ? 0 : firstIdx + 1}
              {" – "}
              {Math.min(lastIdx, filteredProducts.length)} of{" "}
              {filteredProducts.length}
            </span>
            <div className="-mx-1 flex gap-4 overflow-x-auto px-1 md:gap-6">
              {SORT_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSortKey(key);
                    setCurrentPage(1);
                  }}
                  className={`label whitespace-nowrap transition-opacity ${
                    sortKey === key
                      ? "border-b border-ink dark:border-paper pb-0.5"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid or empty state */}
          {pagedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              {pagedProducts.map((product) => (
                <CategoryProductCard
                  key={product._id}
                  product={product}
                  category={category}
                />
              ))}
            </div>
          ) : (
            <div className="border-t border-ink/40 pt-8 max-w-md">
              <div className="label text-black/50 dark:text-paper/50">
                No matches
              </div>
              <p className="mt-2 text-[24px] font-sans text-ink dark:text-paper">
                Try removing a color or widening the price range.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 label underline underline-offset-4 text-ink dark:text-paper"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagedProducts.length > 0 && (
            <div className="mt-12 flex items-center justify-between label text-ink dark:text-paper">
              {/* Page indicator */}
              <span className="text-black/60 dark:text-paper/60">
                Page {safeCurrentPage} / {numberOfPages}
              </span>

              {/* Chips */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {renderPaginationChips().map((chip, i) =>
                  chip === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-1.5 text-black/40 dark:text-paper/40 select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={chip}
                      onClick={() => setCurrentPage(chip)}
                      className={`px-2.5 py-1 label transition-colors ${
                        chip === safeCurrentPage
                          ? "bg-ink dark:bg-paper text-paper dark:text-ink"
                          : "border border-black/15 dark:border-white/15 hover:border-ink dark:hover:border-paper"
                      }`}
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, numberOfPages))
                }
                disabled={safeCurrentPage === numberOfPages}
                className={`label ${
                  safeCurrentPage === numberOfPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:opacity-70"
                }`}
              >
                Next →
              </button>
            </div>
          )}

          {/* End of index */}
          {safeCurrentPage === numberOfPages && pagedProducts.length > 0 && (
            <div className="mt-16 text-center label text-black/40 dark:text-paper/40">
              End of index
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatalogIndex;
