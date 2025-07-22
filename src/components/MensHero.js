"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MensHero = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text animation
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out"
        }
      );

      // Image parallax on scroll
      gsap.to(imageRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[70vh] w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div ref={imageRef} className="relative h-[120%] w-full">
          <Image
            src="/landingpage/coverpageman3.webp"
            alt="Men's Fashion Collection"
            fill
            className="object-cover object-[50%_30%] lg:object-center xl:object-[50%_25%]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Hero Content */}
      <div ref={textRef} className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-7xl">
            Men&apos;s
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Collection
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90 drop-shadow-md md:text-2xl">
            Modern Style for the Contemporary Gentleman
          </p>
          
          {/* Scroll indicator */}
          <div className="mt-8 animate-bounce">
            <svg 
              className="mx-auto h-8 w-8 text-white drop-shadow-lg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full">
          <path 
            fill="currentColor" 
            className="text-white dark:text-backgroundDark"
            d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,37.3C1248,32,1344,32,1392,32L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default MensHero;