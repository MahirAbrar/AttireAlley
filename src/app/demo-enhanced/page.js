"use client";

import { useState } from "react";
import EnhancedHeroSection from "@/components/EnhancedHeroSection";
import ImprovedAnimatedSection from "@/components/ImprovedAnimatedSection";
import AnimatedSection from "@/components/AnimatedSection";

export default function DemoEnhanced() {
  const [showEnhanced, setShowEnhanced] = useState(true);

  return (
    <div className="w-full">
      {/* Toggle button */}
      <div className="fixed top-24 right-4 z-50">
        <button
          onClick={() => setShowEnhanced(!showEnhanced)}
          className="rounded-full bg-primary px-6 py-3 text-white shadow-lg hover:bg-primary/90 transition-all"
        >
          {showEnhanced ? "Show Original" : "Show Enhanced"} Version
        </button>
      </div>

      {showEnhanced ? (
        <>
          {/* Enhanced Hero Section (replaces boring 2nd section) */}
          <EnhancedHeroSection />
          
          {/* Divider */}
          <div className="h-1 w-full bg-gradient-to-r from-accent via-secondary to-primary dark:from-accentDark dark:via-secondaryDark dark:to-primaryDark"></div>
          
          {/* Improved Animated Section (fixes empty spaces) */}
          <ImprovedAnimatedSection />
        </>
      ) : (
        <>
          {/* Original 2nd section */}
          <div className="relative h-screen w-full overflow-hidden bg-gray-300/50 backdrop-blur-sm dark:bg-backgroundDark/50">
            <div className="relative z-20 flex h-full w-full flex-col justify-center px-4">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-4xl font-bold text-primary sm:text-6xl md:text-7xl lg:text-8xl">
                  Elevate Your Style
                </h2>
                <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
                  Discover collections that speak to your unique style and personality
                </p>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-1 w-full bg-gradient-to-r from-accent via-secondary to-primary"></div>
          
          {/* Original Animated Section */}
          <AnimatedSection />
        </>
      )}
    </div>
  );
}