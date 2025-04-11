"use client";

import React from 'react';

const HoverText = ({ text, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <h1 className="inline-block">
        {text.split('').map((char, index) => (
          <span 
            key={index}
            className="inline-block transition-transform duration-300 hover:-translate-y-4 delay-0 hover:delay-0"
            style={{ 
              display: 'inline-block', 
              marginRight: char === ' ' ? '0.3em' : '0.02em',
              transitionDelay: '0s',
              transitionProperty: 'transform',
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease-in-out'
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default HoverText; 