"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import LoaderBig from "@/components/LoaderBig";
import Image from "next/image";
import HoverText from "@/components/HoverText";
import NeonButton from "@/components/NeonButton";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImprovedAnimatedSection from "@/components/ImprovedAnimatedSection";
import InteractiveStyleSection from "@/components/InteractiveStyleSection";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer, ScrollTrigger);
}

// AnimatedText component for letter-by-letter animation
const AnimatedText = ({
  text,
  className,
  delay = 0,
  stagger = 0.01,
  as = "h1",
  onComplete = null,
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const letters = textRef.current.querySelectorAll(".letter");

      // Set initial state
      gsap.set(letters, { opacity: 0, y: 50, rotationX: -90 });

      // Animate in
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        delay: delay,
        stagger: stagger,
        ease: "back.out(1.7)",
        onComplete: letters.length <= 1 ? onComplete : undefined,
        onCompleteAll: letters.length > 1 ? onComplete : undefined,
      });
    }
  }, [delay, stagger, onComplete]);

  const Component = as;

  // Split text into words, then letters
  const words = text.split(" ");

  return (
    <Component ref={textRef} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="mr-2 inline-block">
          {word.split("").map((char, charIndex) => (
            <span
              key={`${wordIndex}-${charIndex}`}
              className="letter"
              style={{
                display: "inline-block",
                transformOrigin: "50% 50% -50px",
                transformStyle: "preserve-3d",
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Component>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [pulseCircles, setPulseCircles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  // Create refs for each section
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const thirdSectionRef = useRef(null);
  const imageRefs = useRef([]);
  const sectionsRef = useRef([]);

  // Memoized callback for scroll down animation
  const handleScrollDownAnimation = useCallback(() => {
    // Animate scroll down section after paragraph completes
    gsap.fromTo(
      ".scroll-down",
      {
        opacity: 0,
        y: 30,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.8)",
      }
    );
  }, []);

  const images = useMemo(() => [
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
  ], []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    fetchProducts();

    // Setup smooth scrolling between sections
    const setupSmoothScroll = () => {
      let isScrolling = false;

      const scrollToSection = (index) => {
        if (isScrolling || !sectionsRef.current[index]) return;
        isScrolling = true;
        setCurrentSection(index);

        const targetElement = sectionsRef.current[index];
        if (targetElement) {
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
          setTimeout(() => {
            isScrolling = false;
          }, 1200);
        }
      };

      // Scroll observer for section snapping
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const scroll = self.scroll();
          const windowHeight = window.innerHeight;
          const newSection = Math.round(scroll / windowHeight);
          if (
            newSection !== currentSection &&
            newSection >= 0 &&
            newSection < 3
          ) {
            setCurrentSection(newSection);
          }
        },
      });

      // Keyboard navigation
      const handleKeydown = (e) => {
        if (e.key === "ArrowDown" && currentSection < 2) {
          scrollToSection(currentSection + 1);
        } else if (e.key === "ArrowUp" && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      };

      window.addEventListener("keydown", handleKeydown);
      return () => window.removeEventListener("keydown", handleKeydown);
    };

    const cleanup = setupSmoothScroll();

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
          prev.filter((circle) => circle.id !== newCircle.id)
        );
      }, newCircle.duration * 1000);
    }, 3000);

    // Add GSAP Observer to track scroll direction
    const scrollObserver = Observer.create({
      type: "wheel,touch,scroll,pointer",
      wheelSpeed: -1,
      onUp: () => {
        // Scroll direction tracking handled by observer
      },
      onDown: () => {
        // Scroll direction tracking handled by observer
      },
      tolerance: 10,
    });

    return () => {
      clearInterval(interval);
      if (scrollObserver) scrollObserver.kill();
      if (cleanup) cleanup();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [currentSection]);

  // Setup section refs after mount
  useEffect(() => {
    sectionsRef.current = [
      firstSectionRef.current,
      secondSectionRef.current,
      thirdSectionRef.current,
    ];

    // Refresh ScrollTrigger to ensure animations work properly
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
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
    // Add a small delay to ensure all components and animations are ready
    setTimeout(() => {
      setLoading(false);
    }, 800);
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
        id="section-1"
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
              <AnimatedText
                text='"Style is a way to say who you are without having to speak"'
                className="mb-6 text-5xl font-bold text-white drop-shadow-lg md:text-7xl"
                delay={0.3}
                stagger={0.01}
                as="h1"
              />
              <AnimatedText
                text="At Attire Alley, we believe in making fashion speak volumes about your unique personality"
                className="text-xl text-white/90 drop-shadow-md md:text-2xl"
                delay={0.7}
                stagger={0.005}
                as="p"
                onComplete={handleScrollDownAnimation}
              />
            </div>
          </div>
        </div>
        <div
          className="scroll-down absolute bottom-8 left-1/2 flex -translate-x-1/2 transform flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
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
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>

      {/* 2nd section - Interactive Style Section */}
      <div ref={secondSectionRef} id="section-2">
        <InteractiveStyleSection />
      </div>

      {/* Old 2nd section - Hidden but kept for reference */}
      <div className="relative hidden h-screen w-full overflow-hidden bg-gray-300/50 backdrop-blur-sm dark:bg-backgroundDark/50">
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
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-primary"></div>

      {/* Animated Section */}
      <div ref={thirdSectionRef} id="section-3">
        <ImprovedAnimatedSection />
      </div>

      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-4">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => {
              const section = sectionsRef.current[index];
              if (section) {
                const targetPosition =
                  section.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                  top: targetPosition,
                  behavior: "smooth",
                });
              }
            }}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentSection === index
                ? "scale-125 bg-primary"
                : "bg-gray-400 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-400"
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </main>
  );
}
