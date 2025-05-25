"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AnimatedSection = () => {
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);
  const decorative1Ref = useRef(null);
  const decorative3Ref = useRef(null);
  const decorative4Ref = useRef(null);

  useEffect(() => {
    const image1 = image1Ref.current;
    const image2 = image2Ref.current;
    const image3 = image3Ref.current;
    const decorative1 = decorative1Ref.current;
    const decorative3 = decorative3Ref.current;
    const decorative4 = decorative4Ref.current;

    // Infinite bouncing animations for decorative elements
    gsap.to(decorative1, {
      y: -20,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.to(decorative3, {
      y: -15,
      duration: 1.8,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1,
    });

    gsap.to(decorative4, {
      y: -25,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1.5,
    });

    // Create matchMedia instances
    const mm = gsap.matchMedia();

    // Desktop animations (sm and above)
    // mm.add("(min-width: 640px)", () => {
    //   // First image animation
    //   const tl1 = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: image1,
    //       start: "top 90%",
    //       end: "+=300",
    //       markers: true,
    //       scrub: 1,
    //     },
    //   });

    //   tl1.to(image1, {
    //     x: "-100%",
    //     ease: "none",
    //   });

    //   // Second image animation
    //   const tl2 = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: image2,
    //       start: "top 70%",
    //       end: "+=300",
    //       markers: true,
    //       scrub: 1,
    //     },
    //   });

    //   tl2.to(image2, {
    //     x: "-100%",
    //     ease: "none",
    //   });

    //   // Third image animation
    //   const tl3 = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: image3,
    //       start: "top 50%",
    //       end: "+=300",
    //       markers: true,
    //       scrub: 1,
    //     },
    //   });

    //   tl3.to(image3, {
    //     x: "-100%",
    //     ease: "none",
    //   });
    // });

    // Mobile animations (below sm)
    mm.add("(max-width: 639px)", () => {
      // First image animation
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: image1,
          start: "top 90%",
          end: "+=300",
          markers: true,
          scrub: 1,
        },
      });

      tl1.from(image1, {
        x: 100,
        opacity: 0,
        duration: 1,
      });

      // Second image animation
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: image2,
          start: "top 90%",
          end: "+=300",
          markers: true,
          scrub: 1,
        },
      });

      tl2.from(image2, {
        x: -100,
        opacity: 0,
        duration: 1,
      });

      // Third image animation
      const tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: image3,
          start: "top 90%",
          end: "+=300",
          markers: true,
          scrub: 1,
        },
      });

      tl3.from(image3, {
        x: 100,
        opacity: 0,
        duration: 1,
      });
    });

    return () => {
      mm.revert(); // Clean up matchMedia
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background to-secondary/30 py-10 dark:from-black dark:to-secondary/30">
      {/* Decorative Background Elements */}
      <div
        ref={decorative1Ref}
        className="absolute left-[10%] top-[15%] h-16 w-16 rounded-full bg-primary blur-sm"
      />
      {/* right background */}
      <div className="absolute right-[-10%] top-[-5%] h-[120vh] w-[50vw] rotate-12 rounded-lg bg-primary/30 blur-sm dark:bg-primary/10" />
      <div
        ref={decorative3Ref}
        className="absolute bottom-[20%] left-[20%] h-20 w-20 rounded-full bg-primary blur-sm"
      />
      <div
        ref={decorative4Ref}
        className="absolute bottom-[25%] left-[9%] h-12 w-12 rounded-lg bg-accent blur-sm"
      />

      {/* Unified Layout - Responsive Images */}
      <div className="relative min-h-screen w-full sm:h-screen">
        {/* First image - main focal point, centered */}
        <div
          ref={image1Ref}
          className="relative mx-4 mb-8 h-[60vh] w-auto overflow-hidden rounded-lg sm:absolute sm:left-[50%] sm:top-[50%] sm:mx-0 sm:mb-0 sm:h-[90vh] sm:w-[55vw] sm:-translate-x-1/2 sm:-translate-y-1/2"
        >
          <Image
            src="/landingpage/coverpageman3.png"
            alt="Fashion model 1"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Second image - smaller, top left */}
        <div
          ref={image2Ref}
          className="relative mx-4 mb-8 h-[50vh] w-auto overflow-hidden rounded-lg sm:absolute sm:left-[2%] sm:top-[5%] sm:z-10 sm:mx-0 sm:mb-0 sm:h-[55vh] sm:w-[40vw]"
        >
          <Image
            src="/landingpage/threewoman.png"
            alt="Fashion model 2"
            fill
            className="object-contain"
          />
        </div>

        {/* Third image - medium size, bottom right */}
        <div
          ref={image3Ref}
          className="relative mx-4 mb-8 h-[45vh] w-auto overflow-hidden rounded-lg sm:absolute sm:bottom-[5%] sm:right-[2%] sm:z-20 sm:mx-0 sm:mb-0 sm:h-[60vh] sm:w-[45vw]"
        >
          <Image
            src="/landingpage/threekids.png"
            alt="Fashion model 3"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedSection;
