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
  const [showCTA, setShowCTA] = useState(false);
  const hasShownCTARef = useRef(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalImages = 10;

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
      size: "medium"
    },
    {
      src: "/landingpage/threewoman.webp",
      alt: "Summer Collection",
      title: "Summer Breeze",
      category: "Women",
      size: "large"
    },
    {
      src: "/landingpage/ap lifestyle v2.webp",
      alt: "Lifestyle",
      title: "Live Your Style",
      category: "All",
      size: "medium"
    },
    {
      src: "/landingpage/threekids.webp",
      alt: "Kids Active",
      title: "Adventure Ready",
      category: "Kids",
      size: "medium"
    },
    {
      src: "/landingpage/seconddiv1.jpg",
      alt: "Street Style",
      title: "Urban Streets",
      category: "Unisex",
      size: "large"
    },
    {
      src: "/landingpage/seconddiv2.jpg",
      alt: "Business Casual",
      title: "Office Chic",
      category: "Professional",
      size: "medium"
    },
    {
      src: "/landingpage/seconddiv3.jpg",
      alt: "Evening Wear",
      title: "Night Out",
      category: "Formal",
      size: "medium"
    },
    {
      src: "/landingpage/coverpageman3.webp",
      alt: "Athleisure",
      title: "Active Life",
      category: "Sports",
      size: "medium"
    }
  ];

  useEffect(() => {
    // Ensure GSAP is loaded and registered
    if (typeof window === "undefined" || !gsap || !ScrollTrigger) return;
    
    const section = sectionRef.current;
    if (!section) return;

    // Wait for images to be in DOM
    const initAnimations = () => {
      const items = section.querySelectorAll(".fashion-item");
      if (items.length === 0) return;
      
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

    // Enhanced Parallax effect on scroll with varied speeds
    items.forEach((item, index) => {
      const speed = index % 3 === 0 ? -80 : index % 3 === 1 ? -50 : -30;
      gsap.to(item, {
        y: speed,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
      
      // Add subtle rotation for some items
      if (index % 4 === 0) {
        gsap.to(item, {
          rotation: 3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 2
          }
        });
      }
    });

    // CTA Button reveal trigger
    ScrollTrigger.create({
      trigger: section,
      start: "bottom 110%", // Trigger when 90% through section (10% before end)
      onEnter: () => {
        if (!hasShownCTARef.current) {
          setShowCTA(true);
          hasShownCTARef.current = true;
          
          // Add entrance animation with bounce
          setTimeout(() => {
            const ctaButton = document.querySelector('.cta-button');
            if (ctaButton) {
              gsap.fromTo(ctaButton, 
                { scale: 0.8, opacity: 0 },
                { 
                  scale: 1, 
                  opacity: 1, 
                  duration: 0.6,
                  ease: "back.out(1.7)",
                  onComplete: () => {
                    // Add pulse glow effect after entrance
                    gsap.to(ctaButton, {
                      boxShadow: "0 0 30px rgba(87, 167, 168, 0.6)",
                      duration: 1,
                      repeat: 2,
                      yoyo: true,
                      ease: "power2.inOut"
                    });
                  }
                }
              );
            }
          }, 100);
        }
      }
    });

    };

    // Initialize animations after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(initAnimations, 100);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-white via-gray-50 to-secondary/10 py-4 dark:from-gray-900 dark:via-gray-800 dark:to-secondary/5"
    >
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 xl:px-12 2xl:px-20">
        {/* Section header - Overlaid on top */}
        <div className="relative z-20 mb-6 text-center">
          <h2 className="mb-2 text-6xl font-bold md:text-7xl lg:text-8xl xl:text-9xl">
            <span className="bg-gradient-to-r from-primary via-primary/70 to-accent bg-clip-text text-transparent">Fashion</span>
            <span className="text-gray-900 dark:text-white"> Gallery</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300 md:text-xl">
            Immerse yourself in our world of style
          </p>
        </div>

        {/* Dense Bento grid layout */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {fashionItems.map((item, index) => (
            <div
              key={index}
              className={`fashion-item group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:shadow-2xl hover:z-10 dark:bg-gray-800 ${
                item.size === "large" ? "col-span-2 row-span-2" : ""
              } ${imagesLoaded >= totalImages ? "animate-fadeIn" : ""}`}
              style={{
                opacity: imagesLoaded < totalImages ? 1 : undefined,
                transform: imagesLoaded < totalImages ? "translateY(0)" : undefined
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative h-full w-full">
                <div className={`relative overflow-hidden ${
                  item.size === "large" ? "h-[750px] lg:h-[850px]" : "h-[365px] lg:h-[415px]"
                }`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={index < 4}
                    quality={85}
                    onLoad={() => setImagesLoaded(prev => prev + 1)}
                    onError={(e) => {
                      console.error(`Failed to load image: ${item.src}`, e);
                      setImagesLoaded(prev => prev + 1);
                    }}
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

        {/* Floating Call to action - Hidden until end of section */}
        <div className={`fixed bottom-8 left-1/2 z-30 -translate-x-1/2 transform transition-all duration-700 ${
          showCTA 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-20 pointer-events-none'
        }`}>
          <Link href="/products">
            <button className="cta-button group relative overflow-hidden rounded-full bg-primary/90 px-16 py-5 text-xl font-bold text-white shadow-2xl backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary">
              <span className="relative z-10 flex items-center gap-3">
                Explore Full Collection
                <svg className="h-6 w-6 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-secondary to-accent transition-transform group-hover:translate-x-0" />
              
              {/* Animated ring effect */}
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ImprovedAnimatedSection;