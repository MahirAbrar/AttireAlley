"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { GlobalContext } from "@/context";

const Footer = () => {
  const { isDark } = useContext(GlobalContext);
  const [mounted, setMounted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer
        className={`${
          mounted && isDark ? "bg-gray-900" : "bg-gray-50"
        } mt-20 border-t border-gray-200 pb-8 pt-16 transition-all duration-300 dark:border-gray-800`}
      >
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <Link
                href="/"
                className="group mb-4 inline-flex items-center gap-3"
              >
                <div className="rounded-lg bg-primary p-2 transition-all group-hover:shadow-[0_0_15px_rgba(87,167,168,0.5)]">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <span className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                  AttireAlley
                </span>
              </Link>
              <p className="mb-4 max-w-md text-gray-600 dark:text-gray-400 lg:text-lg xl:text-xl">
                Your destination for fashion that speaks to your unique style.
                Discover curated collections for every occasion.
              </p>
            </div>

            {/* Links */}
            <div>
              <h6 className="mb-4 font-semibold text-gray-900 dark:text-white lg:text-lg xl:text-xl">
                Company
              </h6>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 transition-colors hover:text-primary dark:text-gray-400"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 transition-colors hover:text-primary dark:text-gray-400"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-600 transition-colors hover:text-primary dark:text-gray-400"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h6 className="mb-4 font-semibold text-gray-900 dark:text-white lg:text-lg xl:text-xl">
                Connect
              </h6>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/hamid-abrar-mahir/"
                  className="rounded-lg bg-gray-100 p-2 transition-all duration-300 hover:bg-primary hover:text-white dark:bg-gray-800"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/mahirabrar"
                  className="rounded-lg bg-gray-100 p-2 transition-all duration-300 hover:bg-primary hover:text-white dark:bg-gray-800"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.333-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.768.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://mahirabrar.net"
                  className="rounded-lg bg-gray-100 p-2 transition-all duration-300 hover:bg-primary hover:text-white dark:bg-gray-800"
                  aria-label="Website"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-8 text-center dark:border-gray-700">
            <p className="text-sm lg:text-base xl:text-lg text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} AttireAlley. All rights reserved.
              Made with ❤️ by mahirabrar
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 rounded-full bg-primary p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(87,167,168,0.5)] ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0"
        }`}
        aria-label="Back to top"
      >
        <svg
          className="h-6 w-6"
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
