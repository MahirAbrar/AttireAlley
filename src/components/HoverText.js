"use client";

import React from 'react';

const HoverText = ({ text, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <h1 className="inline-block">
        {text.split('').map((char, index) => (
          <span 
            key={index}
            className="inline-block transition-transform duration-300 hover:-translate-y-4"
            style={{ 
              display: 'inline-block', 
              marginRight: char === ' ' ? '0.3em' : '0.02em' 
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