"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ImprovedAnimatedSection = () => {
  const sectionRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const fashionItems = [
    {
      src: "/landingpage/coverpageman3.webp",
      alt: "Men's Fashion",
      title: "Urban Elegance",
      category: "Men",
      size: "large"
    },
    {
      src: "/landingpage/coverpagewoman.webp",
      alt: "Women's Fashion",
      title: "Timeless Beauty",
      category: "Women",
      size: "medium"
    },
    {
      src: "/landingpage/coverpagekids3.webp",
      alt: "Kids Fashion",
      title: "Playful Style",
      category: "Kids",
      size: "large"
    },
    {
      src: "/landingpage/threewoman.webp",
      alt: "Summer Collection",
      title: "Summer Breeze",
      category: "Women",
      size: "medium"
    },
    {
      src: "/landingpage/ap lifestyle v2.webp",
      alt: "Lifestyle",
      title: "Live Your Style",
      category: "All",
      size: "large"
    },
    {
      src: "/landingpage/threekids.webp",
      alt: "Kids Active",
      title: "Adventure Ready",
      category: "Kids",
      size: "medium"
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Create staggered entrance animations
    const items = section.querySelectorAll(".fashion-item");
    
    gsap.set(items, {
      opacity: 0,
      y: 100,
      scale: 0.8
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: {
            each: 0.1,
            from: "random"
          },
          ease: "power3.out"
        });
      }
    });

    // Parallax effect on scroll
    items.forEach((item, index) => {
      gsap.to(item, {
        y: () => index % 2 === 0 ? -50 : -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full bg-gradient-to-b from-white via-gray-50 to-secondary/10 py-20 dark:from-gray-900 dark:via-gray-800 dark:to-secondary/5"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-5xl font-bold md:text-6xl lg:text-7xl">
            <span className="gradient-text-animated">Fashion</span> is Art
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Every piece tells a story. Find yours in our curated collections.
          </p>
        </div>

        {/* Bento grid layout */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {fashionItems.map((item, index) => (
            <div
              key={index}
              className={`fashion-item group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl dark:bg-gray-800 ${
                item.size === "large" ? "col-span-2 row-span-2" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative h-full w-full">
                <div className={`relative overflow-hidden ${
                  item.size === "large" ? "h-[600px]" : "h-[290px]"
                }`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className={`transform transition-all duration-500 ${
                      hoveredIndex === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}>
                      <p className="mb-1 text-sm font-medium uppercase tracking-wider">
                        {item.category}
                      </p>
                      <h3 className="mb-2 text-2xl font-bold">{item.title}</h3>
                      <button className="group/btn mt-2 inline-flex items-center gap-2 text-sm font-medium">
                        Explore Collection
                        <svg 
                          className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-20 text-center">
          <h3 className="mb-6 text-3xl font-bold">Ready to Redefine Your Wardrobe?</h3>
          <Link href="/products">
            <button className="group relative overflow-hidden rounded-full bg-primary px-12 py-4 text-lg font-semibold text-white transition-all hover:scale-105">
              <span className="relative z-10">View All Collections</span>
              <div className="absolute inset-0 -translate-x-full bg-secondary transition-transform group-hover:translate-x-0" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ImprovedAnimatedSection;