"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

function NeonButton({ 
  children, 
  color = "#00adb5", // Default to primary color
  className = "",
  onClick = () => {}
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleClick = () => {
      // Animate pulse effect
      gsap.timeline()
        .to(button, {
          duration: 0.1,
          scale: 1.2,
          ease: "power2.out"
        })
        .to(button, {
          duration: 0.5,
          scale: 1,
          ease: "elastic.out(1, 0.3)"
        });
    };

    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`
        relative
        px-6 py-3
        border-2
        rounded-lg
        font-bold
        uppercase
        cursor-pointer
        bg-transparent
        transition-all
        duration-300
        ease-in-out
        hover:scale-105
        hover:shadow-[0_0_10px_currentColor,0_0_20px_currentColor]
        hover:text-shadow-[0_0_10px_currentColor,0_0_20px_currentColor]
        active:scale-95
        text-base 2xl:text-lg
        ${className}
      `}
      style={{
        borderColor: color,
        boxShadow: `0 0 2px ${color}, inset 0 0 2px ${color}` 
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default NeonButton; 