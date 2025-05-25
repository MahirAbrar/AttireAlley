"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import { GlobalContext } from "@/context";

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
  };

  const resetForm = () => {
    setUploadedImage(null);
    setSelectedColor("#000000");
    setUserColors({
      eyeColor: "",
      hairColor: "",
      skinColor: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        mounted && isDark
          ? "bg-backgroundDark text-white"
          : "bg-background text-black"
      }`}
    >
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1
            className={`mb-6 text-5xl font-bold md:text-6xl ${
              mounted && isDark ? "text-white" : "text-black"
            }`}
          >
            AI Match Outfit
          </h1>
          <p
            className={`mx-auto max-w-3xl text-xl md:text-2xl ${
              mounted && isDark ? "text-white/80" : "text-black/80"
            }`}
          >
            Upload your photo and let AI help you find the perfect outfit colors
            that complement your features.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Side - Image Upload and Color Picker */}
            <div
              className={`rounded-xl border-2 p-8 ${
                mounted && isDark
                  ? "border-primary/20 bg-gray-800"
                  : "border-primary/20 bg-white"
              }`}
            >
              <h2
                className={`mb-6 text-2xl font-semibold ${
                  mounted && isDark ? "text-white" : "text-black"
                }`}
              >
                Upload Your Photo
              </h2>

              {/* Upload Area */}
              <div
                className={`mb-6 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  mounted && isDark
                    ? "border-primary/30 bg-gray-700/50 hover:border-primary/50"
                    : "border-primary/30 bg-gray-50 hover:border-primary/50"
                }`}
              >
                {!uploadedImage ? (
                  <div>
                    <svg
                      className="mx-auto mb-4 h-12 w-12 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p
                      className={`mb-2 text-lg ${
                        mounted && isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Click to upload or drag and drop
                    </p>
                    <p
                      className={`text-sm ${
                        mounted && isDark ? "text-white/60" : "text-black/60"
                      }`}
                    >
                      PNG, JPG or JPEG (MAX. 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Zoom Controls */}
                    <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
                      <button
                        onClick={zoomIn}
                        className="rounded bg-primary/80 p-2 text-white hover:bg-primary"
                        title="Zoom In"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={zoomOut}
                        className="rounded bg-primary/80 p-2 text-white hover:bg-primary"
                        title="Zoom Out"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 12H6"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={resetZoom}
                        className="rounded bg-primary/80 p-2 text-white hover:bg-primary"
                        title="Reset Zoom"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
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
                      className={`mx-auto max-h-96 rounded-lg border-2 border-gray-300 ${
                        isDragging ? "cursor-grabbing" : "cursor-crosshair"
                      }`}
                      width={400}
                      height={300}
                    />
                    <div className="mt-2 flex justify-between text-sm">
                      <p
                        className={`${
                          mounted && isDark ? "text-white/70" : "text-black/70"
                        }`}
                      >
                        Click to pick colors • Drag to pan • Scroll to zoom
                      </p>
                      <p
                        className={`${
                          mounted && isDark ? "text-white/70" : "text-black/70"
                        }`}
                      >
                        Zoom: {Math.round(zoomLevel * 100)}%
                      </p>
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
                <div className="mb-6">
                  <h3
                    className={`mb-3 text-lg font-semibold ${
                      mounted && isDark ? "text-white" : "text-black"
                    }`}
                  >
                    Selected Color
                  </h3>
                  <div className="flex items-center gap-4">
                    <div
                      className="h-16 w-16 rounded-lg border-2 border-gray-300"
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                    <div>
                      <p
                        className={`font-mono text-lg ${
                          mounted && isDark ? "text-white" : "text-black"
                        }`}
                      >
                        {selectedColor}
                      </p>
                      <p
                        className={`text-sm ${
                          mounted && isDark ? "text-white/70" : "text-black/70"
                        }`}
                      >
                        Click on your photo to pick colors
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Color Assignment */}
            <div
              className={`rounded-xl border-2 p-8 ${
                mounted && isDark
                  ? "border-primary/20 bg-gray-800"
                  : "border-primary/20 bg-white"
              }`}
            >
              <h2
                className={`mb-6 text-2xl font-semibold ${
                  mounted && isDark ? "text-white" : "text-black"
                }`}
              >
                Your Color Profile
              </h2>

              {/* Color Assignment Buttons */}
              <div className="space-y-6">
                {[
                  { key: "eyeColor", label: "Eye Color", icon: "👁️" },
                  { key: "hairColor", label: "Hair Color", icon: "💇" },
                  { key: "skinColor", label: "Skin Color", icon: "✋" },
                ].map((item) => (
                  <div key={item.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        className={`flex items-center gap-2 text-lg font-medium ${
                          mounted && isDark ? "text-white" : "text-black"
                        }`}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </label>
                      <button
                        onClick={() => handleColorAssignment(item.key)}
                        disabled={!selectedColor}
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        Assign Color
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-lg border-2 border-gray-300"
                        style={{
                          backgroundColor: userColors[item.key] || "#f3f4f6",
                        }}
                      ></div>
                      <span
                        className={`font-mono text-sm ${
                          mounted && isDark ? "text-white/70" : "text-black/70"
                        }`}
                      >
                        {userColors[item.key] || "Not selected"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => {
                    // TODO: Implement AI matching logic
                    alert("AI matching feature coming soon!");
                  }}
                  disabled={
                    !userColors.eyeColor ||
                    !userColors.hairColor ||
                    !userColors.skinColor
                  }
                  className="w-full rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Find My Perfect Colors
                </button>
                <button
                  onClick={resetForm}
                  className={`w-full rounded-lg border-2 px-6 py-3 text-lg font-semibold transition-colors ${
                    mounted && isDark
                      ? "border-gray-600 text-white hover:bg-gray-700"
                      : "border-gray-300 text-black hover:bg-gray-50"
                  }`}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPage;
