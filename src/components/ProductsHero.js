"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const ProductsHero = ({ onCategorySelect, onFilterChange, totalProducts }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const heroRef = useRef(null);
  
  const categories = [
    {
      id: "all",
      title: "All Products",
      image: "/landingpage/ap lifestyle v2.webp",
      color: "#57a7a8",
      description: "Explore our entire collection"
    },
    {
      id: "men",
      title: "Men's Fashion",
      image: "/landingpage/coverpageman3.webp", 
      color: "#00D9FF",
      description: "Contemporary styles for modern men"
    },
    {
      id: "women",
      title: "Women's Collection",
      image: "/landingpage/coverpagewoman.webp",
      color: "#FF006E",
      description: "Elegant designs for every occasion"
    },
    {
      id: "kids",
      title: "Kids' Wear",
      image: "/landingpage/coverpagekids3.webp",
      color: "#FFE66D",
      description: "Playful and comfortable styles"
    }
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    // Animate hero entrance
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1 }
      );
      
      gsap.fromTo(
        ".category-card",
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
    
    // Smooth scroll to products
    const productsSection = document.getElementById("products-grid");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSizeToggle = (size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    onFilterChange({ sizes: newSizes, priceRange, sortBy });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    onFilterChange({ sizes: selectedSizes, priceRange, sortBy: newSort });
  };

  return (
    <div ref={heroRef} className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12">
        {/* Hero Title */}
        <div className="hero-content mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discover
            </span>{" "}
            Your Style
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            {totalProducts} carefully curated pieces waiting for you
          </p>
        </div>

        {/* Category Cards */}
        <div className="hero-content mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`category-card group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedCategory === category.id ? "ring-4 ring-offset-2" : ""
              }`}
              style={{ 
                borderColor: selectedCategory === category.id ? category.color : "transparent",
                borderWidth: "2px",
                borderStyle: "solid",
                ringColor: category.color 
              }}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Category info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="mb-1 text-2xl font-bold">{category.title}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>

                {/* Selected indicator */}
                {selectedCategory === category.id && (
                  <div 
                    className="absolute right-4 top-4 rounded-full p-2"
                    style={{ backgroundColor: category.color }}
                  >
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="hero-content rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Sort Options */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`rounded-lg px-3 py-1 text-sm font-medium transition-all ${
                      selectedSizes.includes(size)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => {
                  const newRange = [priceRange[0], parseInt(e.target.value)];
                  setPriceRange(newRange);
                  onFilterChange({ sizes: selectedSizes, priceRange: newRange, sortBy });
                }}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          {(selectedCategory !== "all" || selectedSizes.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {selectedCategory !== "all" && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  {categories.find(c => c.id === selectedCategory)?.title}
                </span>
              )}
              {selectedSizes.map((size) => (
                <span key={size} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  Size {size}
                </span>
              ))}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedSizes([]);
                  setPriceRange([0, 1000]);
                  onCategorySelect("all");
                  onFilterChange({ sizes: [], priceRange: [0, 1000], sortBy });
                }}
                className="ml-auto text-sm text-gray-600 hover:text-primary dark:text-gray-400"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsHero;