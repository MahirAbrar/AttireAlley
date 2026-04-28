"use client";

import React, { useState, useRef, useEffect } from "react";
import { getAiClothSuggestions } from "@/services/ai";
import { toast } from "react-toastify";

const CANVAS_W = 800;
const CANVAS_H = 600;

const EXAMPLE_COMBOS = [
  {
    title: "Cool Tones",
    colors: ["#2E5090", "#5B8FB9", "#B6D5E1", "#F5F5F5"],
    desc: "Blue eyes and cool-undertone skin.",
    hexes: ["#2E5090", "#5B8FB9", "#B6D5E1", "#F5F5F5"],
  },
  {
    title: "Warm Earth",
    colors: ["#8B4513", "#D2691E", "#F4A460", "#FFDAB9"],
    desc: "Brown eyes and warm-undertone skin.",
    hexes: ["#8B4513", "#D2691E", "#F4A460", "#FFDAB9"],
  },
  {
    title: "Neutral Classic",
    colors: ["#2F4F4F", "#708090", "#C0C0C0", "#F0F8FF"],
    desc: "Versatile across every complexion.",
    hexes: ["#2F4F4F", "#708090", "#C0C0C0", "#F0F8FF"],
  },
];

const COLOR_SLOTS = [
  { key: "eyeColor", label: "Eye color" },
  { key: "hairColor", label: "Hair color" },
  { key: "skinColor", label: "Skin tone" },
];

const DEMO_IMAGES = [
  { src: "/landingpage/coverpagewoman.webp", label: "Woman" },
  { src: "/landingpage/coverpageman.webp", label: "Men" },
  { src: "/landingpage/red%20and%20black%20girl%20model%202.jpeg", label: "Studio" },
  { src: "/landingpage/red%20and%20black%20black%20kid%20model.png", label: "Kid" },
];

export default function AIPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [userColors, setUserColors] = useState({
    eyeColor: "",
    hairColor: "",
    skinColor: "",
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const filledCount = Object.values(userColors).filter(Boolean).length;
  const stepLabel = `0${filledCount} / 03`;

  useEffect(() => {
    if (!uploadedImage || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      canvas.width = CANVAS_W;
      canvas.height = CANVAS_H;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      const baseScale = Math.min(CANVAS_W / img.width, CANVAS_H / img.height);
      const scale = baseScale * zoomLevel;
      const imgW = img.width * scale;
      const imgH = img.height * scale;
      const x = CANVAS_W / 2 - imgW / 2 + panOffset.x;
      const y = CANVAS_H / 2 - imgH / 2 + panOffset.y;
      ctx.drawImage(img, x, y, imgW, imgH);
    };
    img.src = uploadedImage;
  }, [uploadedImage, zoomLevel, panOffset]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleDemoSelect = (src) => {
    setUploadedImage(src);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleCanvasClick = (e) => {
    if (!uploadedImage || !canvasRef.current || isDragging) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      const data = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2])
        .toString(16)
        .slice(1)}`;
      setSelectedColor(hex);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset((prev) => ({
      x: prev.x + (e.clientX - lastMousePos.x),
      y: prev.y + (e.clientY - lastMousePos.y),
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    setZoomLevel((prev) =>
      Math.max(0.5, Math.min(5, prev * (e.deltaY > 0 ? 0.9 : 1.1)))
    );
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(5, prev * 1.2));
  const zoomOut = () => setZoomLevel((prev) => Math.max(0.5, prev / 1.2));
  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleColorAssignment = (colorType) => {
    if (!selectedColor) return;
    setUserColors((prev) => ({ ...prev, [colorType]: selectedColor }));
    const label = COLOR_SLOTS.find((s) => s.key === colorType)?.label ?? colorType;
    toast.success(`${label} assigned.`);
  };

  const clearSlot = (colorType) => {
    setUserColors((prev) => ({ ...prev, [colorType]: "" }));
  };

  const resetForm = () => {
    setUploadedImage(null);
    setSelectedColor(null);
    setUserColors({ eyeColor: "", hairColor: "", skinColor: "" });
    setAiSuggestions("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleAiMatch = async () => {
    if (!userColors.eyeColor || !userColors.hairColor || !userColors.skinColor) {
      toast.error("Assign all three colors first.");
      return;
    }
    setIsLoadingAi(true);
    setAiSuggestions("");
    try {
      const data = await getAiClothSuggestions(userColors);
      setAiSuggestions(data.suggestions);
      toast.success("Recommendations ready.");
    } catch {
      toast.error("Failed to generate suggestions. Please try again.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const allAssigned =
    userColors.eyeColor && userColors.hairColor && userColors.skinColor;

  return (
    <div className="min-h-screen bg-paper dark:bg-backgroundDark text-ink dark:text-paper">

      {/* ── Masthead ── */}
      <div className="border-b border-ink/15 dark:border-paper/15 bg-paper dark:bg-backgroundDark">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="label text-ink/50 dark:text-paper/50">
                AI / Color Matcher / SS26
              </span>
              <h1 className="mt-3 text-[48px] md:text-[72px] leading-[0.92] tracking-[-0.025em] text-ink dark:text-paper">
                Color,{" "}
                <em className="not-italic italic text-primary">paired</em>{" "}
                by hand.
              </h1>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink/65 dark:text-paper/65">
                Upload a photo of yourself, pick colors from it, assign them to
                your eyes, hair, and skin — then let GPT suggest what to wear.
              </p>
            </div>

            <div className="flex-shrink-0">
              <span className="label text-ink/40 dark:text-paper/40 block mb-1">
                Colors set
              </span>
              <span className="font-display text-[40px] leading-none tabular text-ink dark:text-paper">
                {stepLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* ── Left: Photo + Canvas ── */}
        <div className="lg:col-span-7">
          <div className="border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink/30">

            {/* Card header */}
            <div className="flex items-center justify-between border-b border-ink/10 dark:border-paper/10 px-5 py-3">
              <span className="label text-ink/50 dark:text-paper/50">01 / Photo</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="label px-4 py-2 border border-ink/20 dark:border-paper/20 text-ink dark:text-paper hover:border-primary hover:text-primary transition-colors"
              >
                {uploadedImage ? "Change photo" : "Upload"}
              </button>
            </div>

            {/* Canvas / dropzone */}
            {!uploadedImage ? (
              <div className="m-5">
                <div
                  className="border border-dashed border-ink/20 dark:border-paper/20 flex flex-col items-center justify-center py-12 gap-3 cursor-pointer hover:border-ink/40 dark:hover:border-paper/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg
                    className="h-6 w-6 text-ink/30 dark:text-paper/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <span className="label-mono text-ink/40 dark:text-paper/40 text-center px-4">
                    Drop photo or click to browse · PNG / JPG · max 10 MB
                  </span>
                </div>

                <div className="mt-6">
                  <span className="label text-ink/50 dark:text-paper/50">
                    Or try a sample
                  </span>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {DEMO_IMAGES.map((demo) => (
                      <button
                        key={demo.src}
                        type="button"
                        onClick={() => handleDemoSelect(demo.src)}
                        className="group relative aspect-square overflow-hidden border border-ink/15 dark:border-paper/15 hover:border-ink dark:hover:border-paper transition-colors"
                        aria-label={`Use ${demo.label} sample`}
                      >
                        <img
                          src={demo.src}
                          alt={`${demo.label} sample`}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-x-0 bottom-0 label-mono text-[9px] text-white text-center py-1 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity">
                          {demo.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative mx-5 mt-5">
                {/* Zoom pill cluster */}
                <div className="absolute right-2 top-2 z-10 flex border border-ink/15 dark:border-paper/15 bg-paper dark:bg-ink/80">
                  <button
                    onClick={zoomOut}
                    className="label px-3 py-2 text-ink/70 dark:text-paper/70 hover:text-ink dark:hover:text-paper border-r border-ink/15 dark:border-paper/15 transition-colors"
                    title="Zoom out"
                  >
                    −
                  </button>
                  <button
                    onClick={zoomIn}
                    className="label px-3 py-2 text-ink/70 dark:text-paper/70 hover:text-ink dark:hover:text-paper border-r border-ink/15 dark:border-paper/15 transition-colors"
                    title="Zoom in"
                  >
                    +
                  </button>
                  <button
                    onClick={resetZoom}
                    className="label px-3 py-2 text-ink/70 dark:text-paper/70 hover:text-ink dark:hover:text-paper transition-colors"
                    title="Reset"
                  >
                    ↺
                  </button>
                </div>

                {/* Canvas wrapper — aspect-ratio container */}
                <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    className="absolute inset-0 w-full h-full"
                    style={{ cursor: isDragging ? "grabbing" : "crosshair" }}
                  />
                </div>

                {/* Hint row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-2 mb-5 px-0">
                  <div className="flex flex-wrap gap-3 label-mono text-[10px] text-ink/55 dark:text-paper/55">
                    <span>Click to pick</span>
                    <span>·</span>
                    <span>Drag to pan</span>
                    <span>·</span>
                    <span>Scroll to zoom</span>
                  </div>
                  <span className="label-mono text-[10px] tabular text-ink/55 dark:text-paper/55">
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
          </div>

          {/* ── Picked color row ── */}
          <div className="mt-6 border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink/30 px-5 py-4">
            <span className="label text-ink/50 dark:text-paper/50 block mb-3">
              Picked color
            </span>

            {selectedColor ? (
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="h-16 w-16 flex-shrink-0"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="font-mono tabular text-[18px] text-ink dark:text-paper">
                  {selectedColor.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedColor);
                    toast.success("Hex copied.");
                  }}
                  className="label px-3 py-2 border border-ink/20 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:border-ink dark:hover:border-paper hover:text-ink dark:hover:text-paper transition-colors"
                >
                  Copy
                </button>
              </div>
            ) : (
              <span className="label-mono text-ink/30 dark:text-paper/30">
                — click the canvas to pick
              </span>
            )}

            {selectedColor && (
              <div className="flex flex-wrap gap-2 mt-4">
                {COLOR_SLOTS.map((slot) => (
                  <button
                    key={slot.key}
                    onClick={() => handleColorAssignment(slot.key)}
                    disabled={!selectedColor}
                    className="label px-3 py-2.5 border border-ink/20 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:border-ink dark:hover:border-paper hover:text-ink dark:hover:text-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Set as {slot.label.toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Color Profile + AI ── */}
        <div className="lg:col-span-5">
          <div className="border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink/30">

            {/* Card header */}
            <div className="flex items-center justify-between border-b border-ink/10 dark:border-paper/10 px-5 py-3">
              <span className="label text-ink/50 dark:text-paper/50">02 / Your colors</span>
              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {COLOR_SLOTS.map((slot) => (
                  <div
                    key={slot.key}
                    className="h-3 w-3 border border-ink/20 dark:border-paper/20"
                    style={
                      userColors[slot.key]
                        ? { backgroundColor: userColors[slot.key], borderColor: userColors[slot.key] }
                        : {}
                    }
                    title={slot.label}
                  />
                ))}
              </div>
            </div>

            {/* Color rows */}
            <div className="px-5">
              {COLOR_SLOTS.map((slot, i) => (
                <div
                  key={slot.key}
                  className={`flex items-center justify-between py-4 ${
                    i < COLOR_SLOTS.length - 1
                      ? "border-b border-ink/10 dark:border-paper/10"
                      : ""
                  }`}
                >
                  <h4 className="text-[16px] text-ink dark:text-paper">
                    {slot.label}
                  </h4>
                  {userColors[slot.key] ? (
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 flex-shrink-0"
                        style={{ backgroundColor: userColors[slot.key] }}
                      />
                      <span className="font-mono tabular text-[12px] text-ink/70 dark:text-paper/70">
                        {userColors[slot.key].toUpperCase()}
                      </span>
                      <button
                        onClick={() => clearSlot(slot.key)}
                        className="label text-[10px] text-ink/40 dark:text-paper/40 hover:text-ink dark:hover:text-paper transition-colors px-1"
                        title="Clear"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="font-mono text-[14px] text-ink/25 dark:text-paper/25">
                      —
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-5 pb-6 pt-4 space-y-3">
              <button
                onClick={handleAiMatch}
                disabled={!allAssigned || isLoadingAi}
                className="w-full py-3.5 label text-[12px] bg-ink dark:bg-paper text-paper dark:text-ink hover:bg-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingAi ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Analysing…
                  </span>
                ) : (
                  "Generate recommendations →"
                )}
              </button>

              <button
                onClick={resetForm}
                className="w-full label text-[12px] text-ink/50 dark:text-paper/50 py-2 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-ink dark:after:bg-paper hover:after:w-full after:transition-all hover:text-ink dark:hover:text-paper transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Suggestions ── */}
      {aiSuggestions && (
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="border-t border-ink/15 dark:border-paper/15 pt-12 mt-4 mb-20">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <h2 className="text-3xl lg:text-4xl text-ink dark:text-paper">
                Your{" "}
                <em className="italic text-primary">recommendations.</em>
              </h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(aiSuggestions);
                  toast.success("Copied to clipboard.");
                }}
                className="flex-shrink-0 self-start label px-4 py-2.5 border border-ink/20 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:border-ink dark:hover:border-paper hover:text-ink dark:hover:text-paper transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-ink/80 dark:text-paper/80">
              {aiSuggestions}
            </div>
          </div>
        </div>
      )}

      {/* ── Reference Palettes ── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="border-t border-ink/15 dark:border-paper/15 pt-16 pb-20">
          <span className="label text-ink/50 dark:text-paper/50">
            Reference palettes
          </span>
          <h2 className="font-display text-4xl lg:text-5xl mt-4 text-ink dark:text-paper">
            Three combinations to start.
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXAMPLE_COMBOS.map((combo) => (
              <div
                key={combo.title}
                className="border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink/30"
              >
                {/* Swatch row */}
                <div className="flex h-24">
                  {combo.colors.map((color, j) => (
                    <div
                      key={j}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="p-5">
                  <h3 className="text-[18px] text-ink dark:text-paper">
                    {combo.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-ink/55 dark:text-paper/55">
                    {combo.desc}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {combo.hexes.map((hex) => (
                      <span
                        key={hex}
                        className="font-mono tabular text-[11px] text-ink/50 dark:text-paper/50"
                      >
                        {hex}
                      </span>
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
}
