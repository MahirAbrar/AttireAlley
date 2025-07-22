"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import { GlobalContext } from "@/context";
import { getAiClothSuggestions } from "@/services/ai";
import { toast } from "react-toastify";

const AIPage = () => {
  const { isDark } = useContext(GlobalContext);
  const [mounted, setMounted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [userColors, setUserColors] = useState({
    eyeColor: "",
    hairColor: "",
    skinColor: "",
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [isLoadingAiSuggestions, setIsLoadingAiSuggestions] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        // Reset zoom and pan when new image is uploaded
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw image to canvas when uploadedImage, zoomLevel, or panOffset changes
  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = 400;
        canvas.height = 300;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to fit image in canvas while maintaining aspect ratio
        const baseScale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height,
        );
        const scale = baseScale * zoomLevel;

        // Calculate image dimensions and position with zoom and pan
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        const x = canvas.width / 2 - imgWidth / 2 + panOffset.x;
        const y = canvas.height / 2 - imgHeight / 2 + panOffset.y;

        // Draw image
        ctx.drawImage(img, x, y, imgWidth, imgHeight);
      };
      img.src = uploadedImage;
    }
  }, [uploadedImage, zoomLevel, panOffset]);

  const handleCanvasClick = (event) => {
    if (!uploadedImage || !canvasRef.current || isDragging) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);

    // Make sure coordinates are within canvas bounds
    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b] = imageData.data;

      const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      setSelectedColor(hexColor);
    }
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - lastMousePos.x;
    const deltaY = event.clientY - lastMousePos.y;

    setPanOffset((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));

    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel((prev) => Math.max(0.5, Math.min(5, prev * zoomFactor)));
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(5, prev * 1.2));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(0.5, prev / 1.2));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleColorAssignment = (colorType) => {
    setUserColors((prev) => ({
      ...prev,
      [colorType]: selectedColor,
    }));
    toast.success(`${colorType.charAt(0).toUpperCase() + colorType.slice(1).replace('Color', ' color')} assigned successfully!`);
  };

  const resetForm = () => {
    setUploadedImage(null);
    setSelectedColor("#000000");
    setUserColors({
      eyeColor: "",
      hairColor: "",
      skinColor: "",
    });
    setAiSuggestions("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAiMatch = async () => {
    if (
      !userColors.eyeColor ||
      !userColors.hairColor ||
      !userColors.skinColor
    ) {
      toast.error("Please select all three colors first!");
      return;
    }
    setIsLoadingAiSuggestions(true);
    setAiSuggestions(""); // Clear previous suggestions

    try {
      // Use the service function
      const data = await getAiClothSuggestions(userColors);
      setAiSuggestions(data.suggestions);
      toast.success("AI suggestions generated successfully!");
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      toast.error("Failed to generate suggestions. Please try again.");
      setAiSuggestions("");
    } finally {
      setIsLoadingAiSuggestions(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        mounted && isDark
          ? "bg-backgroundDark text-white"
          : "bg-gray-50 text-black"
      }`}
      style={{
        backgroundImage: `radial-gradient(circle, rgba(87, 167, 168, 0.08) 2px, transparent 2px)`,
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0',
      }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 dark:from-primary/20 dark:via-backgroundDark dark:to-secondary/20 py-20">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-pulse animation-delay-2000" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
            AI Style
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Color Matcher
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
            Upload your photo and let AI analyze your features to recommend the perfect outfit colors that complement your unique style
          </p>
          
          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <svg className="mx-auto h-8 w-8 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-7xl lg:px-8 xl:max-w-full xl:px-12">

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Side - Image Upload and Color Picker */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Upload Your Photo
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ready</span>
                </div>
              </div>

              {/* Upload Area */}
              <div
                className={`mb-6 rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer
                  ${uploadedImage 
                    ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' 
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                onClick={() => !uploadedImage && fileInputRef.current?.click()}
              >
                {!uploadedImage ? (
                  <div className="py-8">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-primary/10 p-4">
                        <svg
                          className="h-12 w-12 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Drop your photo here
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      or click to browse • PNG, JPG, JPEG (max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Zoom Controls */}
                    <div className="absolute right-2 top-2 z-10 flex gap-1 bg-white/90 dark:bg-gray-800/90 rounded-lg p-1 backdrop-blur-sm">
                      <button
                        onClick={zoomIn}
                        className="rounded p-2 text-gray-700 dark:text-gray-300 hover:bg-primary/10 transition-colors"
                        title="Zoom In"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                      <button
                        onClick={zoomOut}
                        className="rounded p-2 text-gray-700 dark:text-gray-300 hover:bg-primary/10 transition-colors"
                        title="Zoom Out"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                        </svg>
                      </button>
                      <button
                        onClick={resetZoom}
                        className="rounded p-2 text-gray-700 dark:text-gray-300 hover:bg-primary/10 transition-colors"
                        title="Reset"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>

                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onWheel={handleWheel}
                      className={`mx-auto rounded-lg shadow-inner ${
                        isDragging ? "cursor-grabbing" : "cursor-crosshair"
                      }`}
                      width={400}
                      height={300}
                    />
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-100 dark:bg-gray-700 p-3">
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2z" />
                          </svg>
                          Click to pick
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                          </svg>
                          Drag to pan
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                          Scroll to zoom
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/80"
                >
                  {uploadedImage ? "Change Photo" : "Upload Photo"}
                </button>
              </div>

              {/* Selected Color Display */}
              {selectedColor && (
                <div className="mt-6">
                  <div className="rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Selected Color
                    </h3>
                    <div className="flex items-center gap-4">
                      <div
                        className="h-20 w-20 rounded-xl shadow-lg ring-4 ring-white dark:ring-gray-700"
                        style={{ backgroundColor: selectedColor }}
                      ></div>
                      <div>
                        <p className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedColor}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ready to assign to a feature
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Color Assignment */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Color Profile
                </h2>
                <div className="flex -space-x-2">
                  {Object.values(userColors).filter(Boolean).map((color, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-700"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Color Assignment Cards */}
              <div className="space-y-4">
                {[
                  { key: "eyeColor", label: "Eye Color", icon: "👁️", desc: "Select your eye color" },
                  { key: "hairColor", label: "Hair Color", icon: "💇", desc: "Select your hair color" },
                  { key: "skinColor", label: "Skin Tone", icon: "✋", desc: "Select your skin tone" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`rounded-xl border transition-all ${
                      userColors[item.key]
                        ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                    } p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {item.label}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      {userColors[item.key] ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-10 w-10 rounded-lg shadow-md ring-2 ring-white dark:ring-gray-700"
                            style={{ backgroundColor: userColors[item.key] }}
                          />
                          <code className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {userColors[item.key]}
                          </code>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleColorAssignment(item.key)}
                          disabled={!selectedColor}
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleAiMatch}
                  disabled={
                    !userColors.eyeColor ||
                    !userColors.hairColor ||
                    !userColors.skinColor ||
                    isLoadingAiSuggestions
                  }
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:hover:scale-100"
                >
                  {isLoadingAiSuggestions ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing Colors...
                    </span>
                  ) : (
                    "Generate AI Recommendations"
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions Display */}
        {aiSuggestions && (
          <div className="mt-12 w-full max-w-7xl">
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-gray-800 dark:to-secondary/10 p-1">
              <div className="rounded-2xl bg-white dark:bg-gray-800 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Personalized Color Recommendations
                  </h2>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiSuggestions);
                      toast.success("Recommendations copied to clipboard!");
                    }}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </button>
                </div>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                    {aiSuggestions}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Examples Section */}
        <div className="mt-16 w-full max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Example Color Combinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Cool Tones",
                colors: ["#2E5090", "#5B8FB9", "#B6D5E1", "#F5F5F5"],
                desc: "Perfect for blue eyes and cool skin tones"
              },
              {
                title: "Warm Earth",
                colors: ["#8B4513", "#D2691E", "#F4A460", "#FFDAB9"],
                desc: "Ideal for brown eyes and warm skin tones"
              },
              {
                title: "Neutral Classic",
                colors: ["#2F4F4F", "#708090", "#C0C0C0", "#F0F8FF"],
                desc: "Versatile for any complexion"
              }
            ].map((combo, i) => (
              <div key={i} className="rounded-xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="h-24 flex">
                  {combo.colors.map((color, j) => (
                    <div key={j} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {combo.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {combo.desc}
                  </p>
                  <div className="flex gap-2">
                    {combo.colors.map((color, j) => (
                      <code key={j} className="text-xs font-mono text-gray-600 dark:text-gray-400">
                        {color}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPage;
