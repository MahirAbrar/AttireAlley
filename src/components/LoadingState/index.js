"use client";

import React from "react";

const LoadingState = ({ 
  text = "Loading...", 
  size = "medium",
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: "loading-sm",
    medium: "loading-md",
    large: "loading-lg"
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="text-center">
          <span className={`loading loading-spinner ${sizeClasses[size]} text-primary`} />
          {text && <p className="mt-4 text-lg font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <span className={`loading loading-spinner ${sizeClasses[size]} text-primary`} />
      {text && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingState;