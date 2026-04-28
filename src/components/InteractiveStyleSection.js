"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: "women",
    index: "01 / Women",
    title: "Women",
    subtitle: "Elegance, drawn quiet.",
    count: "16 pieces",
    image: "/landingpage/coverpagewoman.webp",
    alt: "Women's capsule",
    href: "/products/women",
  },
  {
    id: "men",
    index: "02 / Men",
    title: "Men",
    subtitle: "Sharp, but not loud.",
    count: "12 pieces",
    image: "/landingpage/coverpageman.webp",
    alt: "Men's capsule",
    href: "/products/men",
  },
  {
    id: "kids",
    index: "03 / Kids",
    title: "Kids",
    subtitle: "Built to be ruined.",
    count: "8 pieces",
    image: "/landingpage/coverpagekids3.webp",
    alt: "Kids' capsule",
    href: "/products/kids",
  },
];

const InteractiveStyleSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const tilesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: 30 });
      gsap.set(tilesRef.current, { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => {
          gsap.to(headerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });
          gsap.to(tilesRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
          });
        },
        onLeaveBack: () => {
          gsap.to(headerRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.5,
          });
          gsap.to(tilesRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.08,
          });
        },
      });
    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-paper text-ink dark:bg-backgroundDark dark:text-paper py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div
          ref={headerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 lg:mb-24"
        >
          <div className="lg:col-span-7">
            <span className="label inline-flex items-center gap-2 text-ink/60 dark:text-paper/60">
              <span
                className="inline-block h-[8px] w-[8px] rounded-full bg-primary shadow-[0_0_0_3px_rgba(87,167,168,.18),0_0_10px_rgba(87,167,168,.7)]"
                aria-hidden="true"
              />
              The Edit · SS26
            </span>
            <h2
              className="mt-6 font-display leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(48px, 8vw, 120px)" }}
            >
              Three capsules.{" "}
              <span
                className="italic text-primary"
                style={{ textShadow: "0 0 24px rgba(87,167,168,0.35)" }}
              >
                One
              </span>{" "}
              season.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-4">
            <p className="max-w-md text-[15px] leading-relaxed text-ink/70 dark:text-paper/70">
              Three lines, drawn with the same hand. Women, men, kids — small
              editions, finished in small runs, restocked never.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 label hover:text-primary transition-colors"
            >
              Browse the full index <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={category.href}
              className={`group block${i === 1 ? " md:mt-12 lg:mt-16" : ""}`}
              ref={(el) => (tilesRef.current[i] = el)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-ink/5 dark:bg-paper/5">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute top-3 left-3 label bg-paper/90 dark:bg-ink/85 text-ink dark:text-paper px-2 py-1">
                  {category.index}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="label text-white inline-flex items-center gap-2">
                    Shop the edit <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-3xl lg:text-4xl">
                  {category.title}
                  <span className="italic text-primary">.</span>
                </h3>
                <span className="label text-ink/50 dark:text-paper/50">
                  {category.count}
                </span>
              </div>
              <p className="mt-2 text-[14px] text-ink/65 dark:text-paper/65 max-w-xs">
                {category.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveStyleSection;
