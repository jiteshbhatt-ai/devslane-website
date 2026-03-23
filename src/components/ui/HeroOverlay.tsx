"use client";

import { MotionValue } from "framer-motion";

interface HeroOverlayProps {
  isExploring: boolean;
  onExplore: () => void;
  progress: MotionValue<number>;
}

/**
 * Simple transparent overlay with clickable Explore button
 * positioned over the baked-in button in the frame.
 */
export const HeroOverlay = ({ onExplore }: HeroOverlayProps) => {
  return (
    <div className="absolute inset-0 z-[60] pointer-events-none">
      <div className="h-full w-full flex items-center justify-center">
        <button
          onClick={onExplore}
          className="pointer-events-auto absolute cursor-pointer rounded-full border border-white/70 bg-white/60 backdrop-blur-sm px-12 py-6 font-sans text-sm tracking-[0.3em] uppercase text-slate-800 transition-all duration-300 hover:bg-white/80 hover:border-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          style={{
            top: "69.9%",
            left: "51.1%",
            transform: "translateX(-50%)",
          }}
        >
          Explore
        </button>
      </div>
    </div>
  );
};
