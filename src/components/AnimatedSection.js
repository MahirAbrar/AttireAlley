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

  useEffect(() => {
    const image1 = image1Ref.current;
    const image2 = image2Ref.current;
    const image3 = image3Ref.current;

    // Create matchMedia instances
    const mm = gsap.matchMedia();

    // Desktop animations (sm and above)
    mm.add("(min-width: 640px)", () => {
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

      tl1.to(image1, {
        x: "-100%",
        ease: "none",
      });

      // Second image animation
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: image2,
          start: "top 70%",
          end: "+=300",
          markers: true,
          scrub: 1,
        },
      });

      tl2.to(image2, {
        x: "-100%",
        ease: "none",
      });

      // Third image animation
      const tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: image3,
          start: "top 50%",
          end: "+=300",
          markers: true,
          scrub: 1,
        },
      });

      tl3.to(image3, {
        x: "-100%",
        ease: "none",
      });
    });

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
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background to-backgroundDark">
      {/* Desktop Layout */}
      <div className="relative hidden h-screen w-full sm:block">
        {/* First image - centered and large */}
        <div
          ref={image1Ref}
          className="absolute left-1/2 top-1/2 h-[70vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg"
        >
          <Image
            src="/landingpage/coverpageman3.png"
            alt="Fashion model 1"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Second image - offset to the right and slightly higher */}
        <div
          ref={image2Ref}
          className="absolute right-[10%] top-[20%] h-[50vh] w-[35vw] overflow-hidden rounded-lg"
        >
          <Image
            src="/landingpage/coverpageman3.png"
            alt="Fashion model 2"
            fill
            className="object-cover"
          />
        </div>

        {/* Third image - offset to the left and slightly lower */}
        <div
          ref={image3Ref}
          className="absolute bottom-[15%] left-[10%] h-[45vh] w-[30vw] overflow-hidden rounded-lg"
        >
          <Image
            src="/landingpage/coverpageman3.png"
            alt="Fashion model 3"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-8 px-4 py-12 sm:hidden">
        <div
          ref={image1Ref}
          className="relative h-[60vh] w-full overflow-hidden rounded-lg"
        >
          <Image
            src="/landingpage/coverpageman3.png"
            alt="Fashion model 1"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div
          ref={image2Ref}
          className="relative h-[50vh] w-full overflow-hidden rounded-lg"
        >
          <Image
            src="/landingpage/coverpageman3.png"
            alt="Fashion model 2"
            fill
            className="object-cover"
          />
        </div>

        <div
          ref={image3Ref}
          className="relative h-[45vh] w-full overflow-hidden rounded-lg"
        >
          <Image
            src="/landingpage/coverpageman3.png"
            alt="Fashion model 3"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedSection;
