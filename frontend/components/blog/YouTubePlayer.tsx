
  "use client";
  import { useState } from "react";
  import Image from "next/image";

  interface YouTubePlayerProps {
    videoId: string;
  }

  export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
    const [activated, setActivated] = useState(false);
    const isValid = videoId && videoId.trim().length > 0;

    // Fallback — invalid or empty video ID
    if (!isValid) {
      return (
        <div className="w-full aspect-video bg-background-elevated border border-border rounded-xl flex flex-col items-center justify-center gap-3">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-silver-dark text-sm font-sans">
            Video currently unavailable
          </p>
        </div>
      );
    }

    // Facade pattern — show thumbnail until user clicks play
    // This avoids loading the heavy YouTube iframe on page load
    if (!activated) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      return (
        <button
          onClick={() => setActivated(true)}
          className="group relative w-full aspect-video bg-background-elevated rounded-xl overflow-hidden border border-border hover:border-gold transition-colors duration-300
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"aria-label="Play latest YouTube video"
        >
          {/* Thumbnail */}
          <Image
            src={thumbnailUrl}
            alt="Latest video from Technician Ideas — click to play"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1100px"
            onError={(e) => {
              // Fall back to hqdefault if maxresdefault doesn't exist
              const target = e.target as HTMLImageElement;
              if (target.src !== fallbackUrl) target.src = fallbackUrl;
            }}
          />

          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"
            aria-hidden="true"
          />

          {/* Play button */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/90 group-hover:bg-gold group-hover:shadow-gold-glow-strong flex items-center justify-center transition-all
  duration-300 group-hover:scale-110">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="#0a0a0a"
                stroke="none"
                aria-hidden="true"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>

          {/* YouTube badge */}
          <div
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff0000" aria-hidden="true">
              <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.2c-.6.1-1.9.1-31.3C1.3 51 7 1 7S.7 9.2.7 11.5v2.1c0 2.2.3 4.4.3 4.4s.3 21.2 2.8c1.1  1.2 2.6 1.1 3.3 1.2C7.5 22.2 12 22.2 12 22.2s4.2 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.4v-2.1C23.3 9.2 23 7 23 7z" />
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
            </svg>
            <span className="text-white text-xs font-sans font-medium">YouTube</span>
          </div>
        </button>
      );
    }

    // Activated — render the actual iframe
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden border border-border">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`}
          title="Latest video from Technician Ideas"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    );
  }
