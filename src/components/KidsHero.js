"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const KidsHero = () => {
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

      // Fun floating animation for decorative elements
      gsap.to(".float-element", {
        y: -20,
        duration: 2,
        ease: "power1.inOut",
        stagger: 0.2,
        repeat: -1,
        yoyo: true
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[70vh] w-full overflow-hidden bg-gradient-to-b from-yellow-50 to-green-50 dark:from-yellow-900 dark:to-green-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div ref={imageRef} className="relative h-[120%] w-full">
          <Image
            src="/landingpage/coverpagekids3.webp"
            alt="Kids Fashion Collection"
            fill
            className="object-cover object-[50%_30%] lg:object-center xl:object-[50%_25%]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Fun decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <span className="float-element absolute left-10 top-20 text-6xl opacity-20">🌟</span>
        <span className="float-element absolute right-20 top-40 text-5xl opacity-20">🎈</span>
        <span className="float-element absolute left-1/4 bottom-40 text-6xl opacity-20">🌈</span>
        <span className="float-element absolute right-1/3 top-60 text-5xl opacity-20">✨</span>
      </div>

      {/* Hero Content */}
      <div ref={textRef} className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-7xl">
            Kids&apos;
            <span className="block bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
              Collection
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90 drop-shadow-md md:text-2xl">
            Fun, Colorful & Comfortable Fashion for Little Ones
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
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default KidsHero;