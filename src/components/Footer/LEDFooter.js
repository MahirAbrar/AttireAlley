"use client";

import Link from "next/link";

const LEDFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { name: "All Products", href: "/products" },
      { name: "Men's Fashion", href: "/products/men" },
      { name: "Women's Fashion", href: "/products/women" },
      { name: "Kids' Fashion", href: "/products/kids" },
    ],
    Support: [
      { name: "Contact Us", href: "/contact" },
      { name: "FAQs", href: "/faq" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Terms", href: "/terms" },
      { name: "Privacy", href: "/privacy" },
    ],
  };

  return (
    <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      {/* LED Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary led-glow"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-bold mb-4">
            <span className="text-primary led-glow-text">Stay Connected</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Subscribe to get special offers, new arrivals, and exclusive deals
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border-2 border-primary/30 focus:border-primary focus:outline-none transition-all led-border"
            />
            <button
              type="submit"
              className="neon-button"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-flex items-center space-x-3 mb-4">
              <div className="bg-primary text-white font-bold text-lg px-3 py-1.5 rounded-lg led-glow">
                AA
              </div>
              <span className="text-xl font-bold text-primary">AttireAlley</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your destination for fashion that speaks to your unique style.
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Payment */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
              <a
                key={social}
                href={`#${social}`}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition-all hover:scale-110 hover:led-glow"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  {social === 'facebook' && (
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  )}
                  {social === 'twitter' && (
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  )}
                  {social === 'instagram' && (
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                  )}
                  {social === 'youtube' && (
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  )}
                </svg>
              </a>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Secure Payments</span>
            <div className="flex gap-2">
              {["💳", "🔒", "✅"].map((icon, index) => (
                <span key={index} className="text-xl">{icon}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} AttireAlley. All rights reserved. Made with{" "}
            <span className="text-primary animate-pulse">💙</span> in NYC
          </p>
        </div>
      </div>

      {/* Bottom LED Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent led-glow"></div>
    </footer>
  );
};

export default LEDFooter;