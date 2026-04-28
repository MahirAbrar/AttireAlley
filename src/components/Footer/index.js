"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const shopLinks = [
  { label: "Women", href: "/products/women" },
  { label: "Men", href: "/products/men" },
  { label: "Kids", href: "/products/kids" },
  { label: "Editorial drops", href: "/about" },
  { label: "Sale", href: "/products" },
];

const helpLinks = [
  { label: "Shipping", href: "#" },
  { label: "Returns", href: "#" },
  { label: "Size guide", href: "#" },
  { label: "Contact", href: "#" },
];

const aboutLinks = [
  { label: "Our story", href: "/about" },
  { label: "Sustainability", href: "#" },
  { label: "Stockists", href: "#" },
  { label: "Press", href: "#" },
];

const connectLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "Spotify", href: "https://spotify.com" },
];

const FooterColumn = ({ heading, items }) => (
  <div>
    <h6 className="label-mono text-ink/55 dark:text-paper/55">{heading}</h6>
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="relative text-[15px] text-ink transition-colors duration-200 hover:text-primary dark:text-paper dark:hover:text-primary"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#f4efe7] text-ink dark:bg-backgroundDark dark:text-paper">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 pt-20 pb-10">
          <div className="grid grid-cols-2 gap-y-14 gap-x-8 md:grid-cols-4 lg:grid-cols-12">
            <div className="col-span-2 md:col-span-4 lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <span
                  className="inline-block h-[10px] w-[10px] rounded-full bg-primary shadow-[0_0_0_3px_rgba(87,167,168,.18),0_0_12px_rgba(87,167,168,.7)]"
                  aria-hidden="true"
                />
                <span className="font-display italic text-[40px] leading-none text-ink dark:text-paper">
                  Attire Alley
                </span>
              </Link>
              <p className="mt-8 max-w-xs text-[15px] leading-relaxed text-ink/65 dark:text-paper/60">
                A small fashion house in Copenhagen, working in capsule
                editions since 2019.
              </p>
            </div>

            <div className="lg:col-span-2">
              <FooterColumn heading="Shop" items={shopLinks} />
            </div>
            <div className="lg:col-span-2">
              <FooterColumn heading="Help" items={helpLinks} />
            </div>
            <div className="lg:col-span-2">
              <FooterColumn heading="About" items={aboutLinks} />
            </div>
            <div className="lg:col-span-2">
              <FooterColumn heading="Connect" items={connectLinks} />
            </div>
          </div>

          <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-ink/15 pt-8 dark:border-paper/15 sm:flex-row sm:items-center">
            <span className="label-mono text-ink/55 dark:text-paper/55">
              © {year} Attire Alley · CVR 38291847
            </span>
            <span className="label-mono text-ink/55 dark:text-paper/55">
              v 04.12 · Copenhagen / Brooklyn
            </span>
          </div>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper shadow-lg transition-all duration-300 hover:bg-primary dark:bg-paper dark:text-ink dark:hover:bg-primary dark:hover:text-paper ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0"
        }`}
        aria-label="Back to top"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </>
  );
};

export default Footer;
