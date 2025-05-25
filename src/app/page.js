"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import LoaderBig from "@/components/LoaderBig";
import Image from "next/image";
import HoverText from "@/components/HoverText";
import NeonButton from "@/components/NeonButton";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedSection from "@/components/AnimatedSection";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer, ScrollTrigger);
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [pulseCircles, setPulseCircles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Create refs for each section
  const firstSectionRef = useRef(null);
  const imageRefs = useRef([]);

  const images = [
    {
      src: "/landingpage/seconddiv1.jpg",
      alt: "Army Girl",
    },
    {
      src: "/landingpage/seconddiv2.jpg",
      alt: "Third Collection",
    },
    {
      src: "/landingpage/seconddiv3.jpg",
      alt: "Grok Collection",
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    fetchProducts();
    // Create initial pulse circles (reduced from 5 to 3)
    const initialCircles = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 200 + 100,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 4,
    }));
    setPulseCircles(initialCircles);

    // Create new pulse circles periodically (increased interval from 2000 to 3000)
    const interval = setInterval(() => {
      const newCircle = {
        id: Date.now(),
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 200 + 100,
        duration: Math.random() * 4 + 4,
      };
      setPulseCircles((prev) => [...prev, newCircle]);

      // Remove the circle after animation completes
      setTimeout(() => {
        setPulseCircles((prev) =>
          prev.filter((circle) => circle.id !== newCircle.id),
        );
      }, newCircle.duration * 1000);
    }, 3000);

    // Add GSAP Observer to track scroll direction
    let lastY = window.scrollY;
    const scrollObserver = Observer.create({
      type: "wheel,touch,scroll,pointer",
      wheelSpeed: -1,
      onUp: () => {
        const currentY = window.scrollY;
        console.log(
          `GSAP Scroll: Y=${currentY}, Direction=DOWN (${currentY - lastY}px)`,
        );
        lastY = currentY;
      },
      onDown: () => {
        const currentY = window.scrollY;
        console.log(
          `GSAP Scroll: Y=${currentY}, Direction=UP (${lastY - currentY}px)`,
        );
        lastY = currentY;
      },
      tolerance: 10,
    });

    return () => {
      clearInterval(interval);
      if (scrollObserver) scrollObserver.kill();
    };
  }, []);

  // Separate useEffect for GSAP animations after refs are set
  useEffect(() => {
    // GSAP Timeline for desktop images animation
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Wait for refs to be populated
      if (imageRefs.current.length > 0) {
        // No animations
      }
    });
  }, [images]); // Run when images change

  const fetchProducts = async () => {
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderBig />
      </div>
    );
  }

  return (
    <main className="-mt-6 w-full">
      {/* First Section */}
      <div
        ref={firstSectionRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/backgroundlanding.png')",
            maxWidth: "1920px",
            margin: "0 auto",
            left: "0",
            right: "0",
          }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div
              onMouseEnter={() => {
                const bg = document.querySelector(".bg-cover");
                if (bg) bg.style.transform = "scale(1.03)";
              }}
              onMouseLeave={() => {
                const bg = document.querySelector(".bg-cover");
                if (bg) bg.style.transform = "scale(1)";
              }}
            >
              <h1 className="mb-6 text-5xl font-bold text-white drop-shadow-lg md:text-7xl">
                &quot;Style is a way to say who you are without having to
                speak&quot;
              </h1>
              <p className="text-xl text-white/90 drop-shadow-md md:text-2xl">
                At Attire Alley, we believe in making fashion speak volumes
                about your unique personality
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform flex-col items-center gap-2">
          <p className="text-lg text-white drop-shadow-md">
            Scroll down to explore
          </p>
          <div className="animate-bounce">
            <svg
              className="h-6 w-6 text-white drop-shadow-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-secondary to-accent dark:from-primary dark:via-secondary  dark:to-accent"></div>

      {/* 2nd section */}
      <div className="relative h-screen w-full overflow-hidden bg-gray-300/50 backdrop-blur-sm dark:bg-backgroundDark/50">
        {/* Pulse Circles Background decoration*/}
        {pulseCircles.map((circle) => (
          <div
            key={circle.id}
            className="pulse-circle"
            style={{
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              animationDuration: `${circle.duration}s`,
              animationDelay: `${circle.delay || 0}s`,
            }}
          />
        ))}
        <div className="relative z-20 flex h-full w-full flex-col justify-center px-4">
          {/* Mobile Navigation Arrows - Only visible on small screens */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 lg:hidden"
            aria-label="Previous image"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 lg:hidden"
            aria-label="Next image"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Unified Image Layout */}
          <div className="image-container relative mb-12 flex h-[40vh] items-center justify-center">
            <div className="flex w-full justify-center gap-8 lg:w-[95vw]">
              {images.map((image, index) => (
                <div
                  key={index}
                  ref={(el) => (imageRefs.current[index] = el)}
                  className={`group relative transition-all duration-500 ${
                    // Mobile: Show only current image, hide others
                    index === currentImageIndex
                      ? "h-[60vw] max-h-[500px] w-[90vw] max-w-[500px] lg:h-[25vw] lg:max-h-[600px] lg:min-h-[300px] lg:w-[25vw] lg:min-w-[300px] lg:max-w-[600px]"
                      : "hidden lg:block lg:h-[25vw] lg:max-h-[600px] lg:min-h-[300px] lg:w-[25vw] lg:min-w-[300px] lg:max-w-[600px]"
                  } lg:hover:h-[30vw] lg:hover:w-[30vw]`}
                >
                  <div className="glass-container absolute inset-0 overflow-hidden rounded-full shadow-2xl shadow-black/50 dark:shadow-white/20">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index === 0}
                    />
                  </div>
                  <div className="absolute bottom-[-1.5rem] left-0 h-1 w-full origin-left scale-x-0 transform bg-primary shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-x-100 dark:shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12 text-center">
            <HoverText
              text="Elevate Your Style"
              className="mb-4 text-4xl font-bold text-primary sm:text-6xl md:text-7xl lg:text-8xl"
            />
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
              Discover collections that speak to your unique style and
              personality
            </p>
          </div>

          {/* Welcome Section */}
          <div className="mx-auto max-w-4xl text-center">
            <Link href="/products" passHref>
              <NeonButton color="#00adb5" className="text-lg md:text-xl">
                Explore Collections
              </NeonButton>
            </Link>
          </div>
        </div>
      </div>

      {/* divider 2 */}
      <div className="dark:from-accentDark dark:via-secondaryDark dark:to-primaryDark h-1 w-full bg-gradient-to-r from-accent via-secondary to-primary"></div>

      {/* Animated Section */}
      <AnimatedSection />
    </main>
  );
}
