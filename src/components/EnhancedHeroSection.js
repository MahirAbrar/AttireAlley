"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";

const EnhancedHeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const collections = [
    {
      title: "Summer Vibes",
      subtitle: "Light & Breezy",
      image: "/landingpage/seconddiv1.jpg",
      color: "#FF006E",
      link: "/products/women"
    },
    {
      title: "Urban Edge",
      subtitle: "Street Style",
      image: "/landingpage/seconddiv2.jpg",
      color: "#00D9FF",
      link: "/products/men"
    },
    {
      title: "Kid's World",
      subtitle: "Fun & Colorful",
      image: "/landingpage/seconddiv3.webp",
      color: "#FFE66D",
      link: "/products/kids"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % collections.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [collections.length]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-white to-secondary/10 dark:from-backgroundDark dark:via-gray-900 dark:to-secondary/5">
      {/* Dynamic gradient background that follows mouse */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${collections[activeIndex].color}40 0%, transparent 50%)`
        }}
      />

      {/* Enhanced animated circles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="enhanced-pulse"
            style={{
              left: `${20 + i * 20}%`,
              top: `${20 + (i % 2) * 40}%`,
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">
        {/* Main heading with gradient animation */}
        <h2 className="gradient-text-animated mb-8 text-center text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl">
          Discover Your Style
        </h2>

        {/* Interactive collection showcase */}
        <div className="mb-12 flex w-full max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-stretch">
          {/* Collection cards */}
          <div className="flex gap-6 lg:w-1/2">
            {collections.map((collection, index) => (
              <div
                key={index}
                className={`feature-card group relative cursor-pointer overflow-hidden rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-500 dark:bg-gray-800/80 ${
                  activeIndex === index ? "scale-105" : "scale-95 opacity-70"
                }`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="relative z-10">
                  <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                    {collection.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{collection.subtitle}</p>
                </div>
                <div
                  className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30"
                  style={{ backgroundColor: collection.color }}
                />
              </div>
            ))}
          </div>

          {/* Featured image display */}
          <div className="relative lg:w-1/2">
            <div className="group relative h-[500px] w-full overflow-hidden rounded-3xl shadow-2xl">
              {collections.map((collection, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    activeIndex === index
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-110"
                  }`}
                >
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="mb-4 text-4xl font-bold text-white">
                      {collection.title}
                    </h3>
                    <Link href={collection.link}>
                      <button className="group/btn relative overflow-hidden rounded-full bg-white px-8 py-3 font-semibold text-gray-900 transition-all hover:scale-105">
                        <span className="relative z-10">Shop Now</span>
                        <div
                          className="absolute inset-0 -translate-x-full transition-transform group-hover/btn:translate-x-0"
                          style={{ backgroundColor: collection.color }}
                        />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="mt-6 flex justify-center gap-2">
              {collections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 transition-all ${
                    activeIndex === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-gray-300 dark:bg-gray-600"
                  } rounded-full`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: "✨", title: "Premium Quality", desc: "Hand-picked materials" },
            { icon: "🚚", title: "Free Shipping", desc: "On orders over $50" },
            { icon: "♻️", title: "Sustainable", desc: "Eco-friendly fashion" }
          ].map((feature, index) => (
            <div
              key={index}
              className="feature-card group rounded-xl bg-white/70 p-6 text-center backdrop-blur-sm dark:bg-gray-800/70"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-3 text-4xl transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h4 className="mb-2 text-xl font-semibold">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedHeroSection;