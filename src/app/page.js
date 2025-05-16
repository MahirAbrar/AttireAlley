"use client";

import {  useEffect, useState, useRef } from "react";
import Link from "next/link";
import LoaderBig from "@/components/LoaderBig";
import Image from "next/image";
import HoverText from "@/components/HoverText";
import NeonButton from "@/components/NeonButton";
import CollectionsSlider from "@/components/CollectionsSlider";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [pulseCircles, setPulseCircles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: "/landingpage/seconddiv1.jpg",
      alt: "Army Girl"
    },
    {
      src: "/landingpage/seconddiv2.jpg",
      alt: "Third Collection"
    },
    {
      src: "/landingpage/seconddiv3.jpg",
      alt: "Grok Collection"
    }
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
      delay: Math.random() * 4
    }));
    setPulseCircles(initialCircles);

    // Create new pulse circles periodically (increased interval from 2000 to 3000)
    const interval = setInterval(() => {
      const newCircle = {
        id: Date.now(),
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 200 + 100,
        duration: Math.random() * 4 + 4
      };
      setPulseCircles(prev => [...prev, newCircle]);

      // Remove the circle after animation completes
      setTimeout(() => {
        setPulseCircles(prev => prev.filter(circle => circle.id !== newCircle.id));
      }, newCircle.duration * 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
    <main className="w-full -mt-6">
      {/* First Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/backgroundlanding.png')",
            maxWidth: "1920px",
            margin: "0 auto",
            left: "0",
            right: "0"
          }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div 
              onMouseEnter={() => {
                const bg = document.querySelector('.bg-cover');
                if (bg) bg.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={() => {
                const bg = document.querySelector('.bg-cover');
                if (bg) bg.style.transform = 'scale(1)';
              }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-white">
                &quot;Style is a way to say who you are without having to speak&quot;
              </h1>
              <p className="text-xl md:text-2xl drop-shadow-md text-white/90">
                At Attire Alley, we believe in making fashion speak volumes about your unique personality
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-white text-lg drop-shadow-md">Scroll down to explore</p>
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white drop-shadow-md"
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
      <div className="h-1 w-full bg-gradient-to-r dark:from-primary dark:via-secondary dark:to-accent from-secondary  to-accent"></div>

  {/* 2nd section */}
        <div className="w-full h-screen bg-gray-300/50 dark:bg-backgroundDark/50 relative overflow-hidden backdrop-blur-sm">
          {/* Pulse Circles Background */}
          {pulseCircles.map(circle => (
            <div
              key={circle.id}
              className="pulse-circle"
              style={{
                left: `${circle.left}%`,
                top: `${circle.top}%`,
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                animationDuration: `${circle.duration}s`,
                animationDelay: `${circle.delay || 0}s`
              }}
            />
          ))}
          <div className="w-full h-full flex flex-col justify-center px-4 relative z-20">
            {/* Image Accordion/Slider */}
            <div className="flex flex-col md:flex-row h-[40vh] gap-8 mb-12 items-center justify-center relative">
              {/* Mobile Navigation Arrows - Only visible on small screens */}
              <button 
                onClick={prevImage}
                className="lg:hidden absolute left-4 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20"
                aria-label="Previous image"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextImage}
                className="lg:hidden absolute right-4 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20"
                aria-label="Next image"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Mobile Slider - Only visible on small screens */}
              <div className="lg:hidden w-full flex justify-center">
                <div className="group relative w-[90vw] h-[60vw] max-w-[500px] max-h-[500px] transition-all duration-500">
                  <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-black/50 dark:shadow-white/20 glass-container">
                    <Image
                      src={images[currentImageIndex].src}
                      alt={images[currentImageIndex].alt}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                </div>
              </div>

              {/* Desktop View - Only visible on large screens and up */}
              <div className="hidden lg:flex flex-row gap-8 w-[95vw] justify-center">
                {images.map((image, index) => (
                  <div key={index} className="group relative w-[25vw] h-[25vw] min-w-[300px] min-h-[300px] max-w-[600px] max-h-[600px] transition-all duration-500 hover:w-[32vw] hover:h-[32vw]">
                    <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-black/50 dark:shadow-white/20 glass-container">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-12">
              <HoverText text="Elevate Your Style" className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary mb-4" />
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover collections that speak to your unique style and personality
              </p>
            </div>

            {/* Welcome Section */}
            <div className="text-center max-w-4xl mx-auto">
              <Link href="/products" passHref>
                <NeonButton color="#00adb5" className="text-lg md:text-xl">
                  Explore Collections
                </NeonButton>
              </Link>
            </div>
          </div>
        </div>

{/* divider 2 */}
      <div
        className="h-1 w-full bg-gradient-to-r from-accent via-secondary to-primary dark:from-accentDark dark:via-secondaryDark dark:to-primaryDark"
      ></div>

{/* Collections Slider Section */}
<div id="collections-section" className="w-full py-16 relative bg-gray-100 dark:bg-gray-900">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">Featured Collections</h2>
    <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
      Browse through our curated collections and find your perfect style
    </p>
    <CollectionsSlider />
  </div>
</div>
    </main>
  );
}
