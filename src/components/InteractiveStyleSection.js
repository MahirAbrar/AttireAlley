"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const InteractiveStyleSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const bgRef = useRef(null);

  const categories = [
    {
      id: 0,
      title: "Women's Collection",
      subtitle: "Elegance Redefined",
      description: "Discover timeless pieces that celebrate your unique style",
      image: "/landingpage/coverpagewoman.webp",
      color: "#FF006E",
      accent: "#FFB6C1",
      products: [
        { name: "Summer Dress", price: "$89", img: "/landingpage/seconddiv1.jpg" },
        { name: "Casual Blazer", price: "$129", img: "/landingpage/seconddiv2.jpg" },
        { name: "Evening Gown", price: "$249", img: "/landingpage/seconddiv3.jpg" }
      ],
      link: "/products/women"
    },
    {
      id: 1,
      title: "Men's Collection",
      subtitle: "Modern Sophistication",
      description: "Sharp looks for the contemporary gentleman",
      image: "/landingpage/coverpageman3.webp",
      color: "#00D9FF",
      accent: "#87CEEB",
      products: [
        { name: "Tailored Suit", price: "$399", img: "/landingpage/seconddiv2.jpg" },
        { name: "Casual Shirt", price: "$79", img: "/landingpage/seconddiv1.jpg" },
        { name: "Premium Jacket", price: "$199", img: "/landingpage/seconddiv3.jpg" }
      ],
      link: "/products/men"
    },
    {
      id: 2,
      title: "Kids' Collection",
      subtitle: "Playful & Comfortable",
      description: "Fun fashion for your little ones",
      image: "/landingpage/seconddiv3.webp",
      color: "#FFE66D",
      accent: "#FFF4A3",
      products: [
        { name: "Rainbow Tee", price: "$29", img: "/landingpage/seconddiv1.jpg" },
        { name: "Denim Set", price: "$49", img: "/landingpage/seconddiv2.jpg" },
        { name: "Party Dress", price: "$59", img: "/landingpage/seconddiv3.jpg" }
      ],
      link: "/products/kids"
    }
  ];

  useEffect(() => {
    // Mouse tracking for interactive background
    const handleMouseMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // GSAP Animations
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(titleRef.current, { opacity: 0, y: 50 });
      gsap.set(cardsRef.current, { opacity: 0, y: 100, scale: 0.8 });
      
      // Title animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
          });
        },
        onLeaveBack: () => {
          gsap.to(titleRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.5
          });
        }
      });
      
      // Cards animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.to(cardsRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
          });
        },
        onLeaveBack: () => {
          gsap.to(cardsRef.current, {
            opacity: 0,
            y: 100,
            scale: 0.8,
            duration: 0.5,
            stagger: 0.1
          });
        }
      });

      // Parallax background effect
      gsap.to(bgRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, sectionRef);
    
    // Refresh ScrollTrigger after component is fully mounted
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      }, 500);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-backgroundDark dark:to-gray-800"
    >
      {/* Animated Background */}
      <div 
        ref={bgRef}
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${categories[activeCategory].color}40 0%, transparent 60%)`
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20">
        {/* Section Title */}
        <div ref={titleRef} className="mb-16 text-center">
          <h2 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Elevate Your Style
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
            Explore our curated collections designed to match your unique personality
          </p>
        </div>

        {/* Interactive Category Cards */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={category.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all duration-500 dark:bg-gray-800 ${
                activeCategory === index 
                  ? "scale-105 shadow-2xl ring-4 ring-offset-2" 
                  : "hover:scale-105"
              }`}
              style={{
                borderColor: activeCategory === index ? category.color : "transparent",
                borderWidth: "2px",
                borderStyle: "solid",
                ringColor: category.color,
                ringOffsetColor: category.accent
              }}
              onClick={() => setActiveCategory(index)}
              onMouseEnter={() => setActiveCategory(index)}
            >
              {/* Card Background Gradient */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                style={{
                  background: `linear-gradient(135deg, ${category.color}, ${category.accent})`
                }}
              />

              {/* Card Content */}
              <div className="relative z-10">
                <h3 
                  className="mb-2 text-2xl font-bold text-gray-900 dark:text-white"
                  style={{ color: activeCategory === index ? category.color : "" }}
                >
                  {category.title}
                </h3>
                <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {category.subtitle}
                </p>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>

                {/* Mini Product Preview */}
                <div className="mb-6 flex gap-2">
                  {category.products.slice(0, 3).map((product, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 w-16 overflow-hidden rounded-lg opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <Image
                        src={product.img}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Link href={category.link}>
                  <button
                    className="relative overflow-hidden rounded-full px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="relative z-10">Explore Collection</span>
                    <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 hover:translate-x-0" />
                  </button>
                </Link>
              </div>

              {/* Decorative Corner */}
              <div
                className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-20"
                style={{ backgroundColor: category.accent }}
              />
            </div>
          ))}
        </div>

        {/* Featured Product Showcase */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative h-[400px] overflow-hidden rounded-2xl">
              <Image
                src={categories[activeCategory].image}
                alt={categories[activeCategory].title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                style={{
                  background: `linear-gradient(to top, ${categories[activeCategory].color}80, transparent)`
                }}
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Featured from {categories[activeCategory].title}
              </h3>
              <div className="mb-6 space-y-4">
                {categories[activeCategory].products.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                        <Image
                          src={product.img}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <span
                      className="font-bold"
                      style={{ color: categories[activeCategory].color }}
                    >
                      {product.price}
                    </span>
                  </div>
                ))}
              </div>
              <Link href={categories[activeCategory].link} className="inline-block">
                <button className="group relative overflow-hidden rounded-full bg-gray-900 px-8 py-4 font-semibold text-white transition-all hover:scale-105 dark:bg-white dark:text-gray-900">
                  <span className="relative z-10">Shop Full Collection</span>
                  <div
                    className="absolute inset-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0"
                    style={{ backgroundColor: categories[activeCategory].color }}
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveStyleSection;