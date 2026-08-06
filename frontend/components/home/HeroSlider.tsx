"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Photographer } from "@/types";
import { SliderSkeleton } from "@/components/ui/SkeletonLoader";
import Tooltip from "@/components/ui/Tooltip";

interface HeroSliderProps {
  photographers: Photographer[];
}

const AUTOPLAY_INTERVAL = 5000;

export default function HeroSlider({ photographers }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);
  // Track which image indexes failed — never request them again
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = photographers.length;

  const goTo = useCallback(
    (index: number) => setCurrent((index + total) % total),
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay — starts once first slide is considered ready
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next]);

  // Mark as loaded immediately on mount
  useEffect(() => {
    setLoaded(true);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      touchDeltaX.current > 0 ? prev() : next();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setPaused(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  };

  const handleImageError = (index: number) => {
    setFailedIndexes((prev) => new Set(prev).add(index));
  };

  if (!photographers.length) return null;

  return (
    <section
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] lg:h-screen overflow-hidden bg-background"
      aria-label="Photographer showcase gallery"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* Skeleton until ready */}
      {!loaded && <SliderSkeleton />}

      {/* Slides */}
      <div
        className={`relative w-full h-full transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {photographers.map((photographer, index) => {
          const isActive = index === current;
          const hasFailed = failedIndexes.has(index);

          return (
            <div
              key={photographer.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${total}: ${photographer.name}`}
              aria-hidden={!isActive}
            >
              <Tooltip
                content={`Visit ${photographer.name}'s profile`}
                position="bottom"
              >
                <Link
                  href={photographer.socialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 group cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold focus-visible:ring-inset"
                  aria-label={`${photographer.altText} — click to visit their social profile`}
                  tabIndex={isActive ? 0 : -1}
                >
                  {/* Native img — no Next.js optimization pipeline, no server-side requests */}
                  {!hasFailed ? (
                    <img
                      src={photographer.imageUrl}
                      alt={photographer.altText}
                      onError={() => handleImageError(index)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                      }}
                      className={`transition-transform duration-700 ease-out ${
                        isActive ? "group-hover:scale-105" : ""
                      }`}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    // Dark placeholder when image is missing
                    <div
                      className="absolute inset-0 bg-background-elevated flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2a2a2a"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}

                  {/* Bottom gradient for dot visibility */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Hover icon overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    aria-hidden="true"
                  >
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 border border-gold/40">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c9a84c"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </Tooltip>
            </div>
          );
        })}
      </div>

      {/* Prev button */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-border hover:border-gold text-silver hover:text-gold flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label="Previous slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-border hover:border-gold text-silver hover:text-gold flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label="Next slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
        role="tablist"
        aria-label="Slide indicators"
      >
        {photographers.map((photographer, index) => (
          <button
            key={photographer.id}
            onClick={() => goTo(index)}
            role="tab"
            aria-selected={index === current}
            aria-label={`Go to slide ${index + 1}: ${photographer.name}`}
            className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              index === current
                ? "w-6 h-2 bg-gold shadow-[0_0_8px_rgba(201,168,76,0.7)]"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Pause indicator */}
      {paused && (
        <div
          className="absolute top-4 right-4 z-20 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-silver text-xs font-sans flex items-center gap-1.5"
          aria-live="polite"
          aria-label="Slideshow paused"
        >
          <span className="w-1 h-3 bg-silver rounded-sm inline-block" aria-hidden="true" />
          <span className="w-1 h-3 bg-silver rounded-sm inline-block" aria-hidden="true" />
          Paused
        </div>
      )}
    </section>
  );
}
