"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AnimatedSection = () => {
  const containerRef = useRef(null);
  const imageRefs = useRef([]);
  const [masonryLayout, setMasonryLayout] = useState([]);

  const images = [
    {
      src: "/landingpage/coverpageman3.png",
      alt: "Fashion model 1",
      height: 400,
    },
    {
      src: "/landingpage/coverpagewoman.jpg",
      alt: "Fashion model 2",
      height: 300,
    },
    {
      src: "/landingpage/coverpagekids3.png",
      alt: "Fashion model 3",
      height: 450,
    },
    {
      src: "/landingpage/threewoman.png",
      alt: "Fashion model 4",
      height: 350,
    },
    {
      src: "/landingpage/ap lifestyle v2.png",
      alt: "Fashion model 5",
      height: 380,
    },
    {
      src: "/landingpage/threekids.png",
      alt: "Fashion model 6",
      height: 320,
    },
  ];

  const calculateMasonryLayout = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const columns = window.innerWidth >= 1024 ? 3 : 2;
    const gap = 8; // 8px gap between images
    const columnWidth = (containerWidth - gap * (columns - 1)) / columns;
    const columnHeights = new Array(columns).fill(0);
    const layout = [];

    images.forEach((image, index) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      const x = shortestColumn * (columnWidth + gap);
      const y = columnHeights[shortestColumn];

      layout.push({
        x,
        y,
        width: columnWidth,
        height: image.height,
        index,
      });

      columnHeights[shortestColumn] += image.height + gap;
    });

    setMasonryLayout(layout);
  };

  useEffect(() => {
    calculateMasonryLayout();

    const handleResize = () => {
      calculateMasonryLayout();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (masonryLayout.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    // Position images based on masonry layout
    masonryLayout.forEach((item, index) => {
      const img = imageRefs.current[index];
      if (img) {
        gsap.set(img, {
          position: "absolute",
          left: item.x,
          top: item.y,
          width: item.width,
          height: item.height,
        });

        // Add hover animations
        img.addEventListener("mouseenter", () => {
          const imageElement = img.querySelector("img");
          gsap.to(img, {
            scale: 1.15,
            duration: 0.4,
            ease: "power2.out",
            zIndex: 20,
          });

          if (imageElement) {
            // Create a larger container effect by scaling the image itself
            gsap.to(imageElement, {
              scale: 1.2,
              objectFit: "contain",
              duration: 0.4,
              ease: "power2.out",
            });
          }
        });

        img.addEventListener("mouseleave", () => {
          const imageElement = img.querySelector("img");
          gsap.to(img, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            zIndex: 0,
          });

          if (imageElement) {
            gsap.to(imageElement, {
              scale: 1,
              objectFit: "cover",
              duration: 0.4,
              ease: "power2.out",
            });
          }
        });
      }
    });

    // Set container height
    const maxHeight = Math.max(
      ...masonryLayout.map((item) => item.y + item.height),
    );
    gsap.set(container, { height: maxHeight });

    // Create animations for each image
    const imageElements = container.querySelectorAll(".image-item");
    imageElements.forEach((img, index) => {
      gsap.fromTo(
        img,
        {
          opacity: 0,
          scale: 0.8,
          filter: "blur(10px)",
          y: 30,
          x: -20,
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.15,
          scrollTrigger: {
            trigger: img,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [masonryLayout]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background to-secondary/30 py-10 dark:from-black dark:to-secondary/10">
      <div
        ref={containerRef}
        className="relative min-h-[80vh] w-full overflow-visible px-4"
      >
        {images.map((image, index) => (
          <div
            key={index}
            ref={(el) => (imageRefs.current[index] = el)}
            className="image-item overflow-visible rounded-lg bg-white/5 backdrop-blur-sm"
          >
            <div className="relative h-full w-full overflow-visible">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="duration-400 object-cover transition-all ease-out"
                sizes="(max-width: 640px) 45vw, (max-width: 768px) 45vw, 35vw"
                priority={index < 3}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 select-none text-center">
        <h2 className="mb-4 text-[7rem] font-bold text-zinc-800/90 dark:text-zinc-100/90">
          Fashion is the armor to survive everyday life
        </h2>
        <p className="text-xl text-zinc-700/80 dark:text-zinc-200/80">
          Express yourself through style that speaks your truth
        </p>
      </div>
    </section>
  );
};

export default AnimatedSection;
