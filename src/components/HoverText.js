"use client";

import React, { useState, useRef, useEffect } from "react";

const HoverText = ({ text, className = "" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const charPositionsRef = useRef([]);
  const animationFrameRef = useRef(null);

  // Cache character positions on mount and window resize
  useEffect(() => {
    const updateCharPositions = () => {
      if (!containerRef.current) return;

      const chars = containerRef.current.children[0].children;
      charPositionsRef.current = Array.from(chars).map((char) => {
        const rect = char.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      });
    };

    updateCharPositions();
    window.addEventListener("resize", updateCharPositions);
    return () => window.removeEventListener("resize", updateCharPositions);
  }, [text]); // Re-run when text changes

  const handleMouseMove = (e) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const calculateDistance = (index) => {
    const charPos = charPositionsRef.current[index];
    if (!charPos) return 0;

    const dx = mousePosition.x - charPos.x;
    const dy = mousePosition.y - charPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Maximum distance for effect (in pixels)
    const maxDistance = 100;
    return Math.max(0, 1 - distance / maxDistance);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h1 className="inline-block">
        {text.split("").map((char, index) => {
          const distance = calculateDistance(index);
          const translateY = -32 * distance;

          return (
            <span
              key={index}
              className="inline-block transition-all duration-150"
              style={{
                display: "inline-block",
                marginRight: char === " " ? "0.3em" : "0.02em",
                transform: `translateY(${translateY}px)`,
                transitionDelay: "0s",
                transitionProperty: "transform",
                transitionDuration: "150ms",
                transitionTimingFunction: "ease-in-out",
              }}
            >
              {char}
            </span>
          );
        })}
      </h1>
    </div>
  );
};

export default HoverText;
