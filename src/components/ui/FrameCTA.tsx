"use client";

import { useEffect, useState } from "react";
import { MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FrameCTAProps {
  progress: MotionValue<number>;
  onStartProject: () => void;
}

export const FrameCTA = ({ progress, onStartProject }: FrameCTAProps) => {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      const show = v > 0.88;
      setVisible(show);
      if (show && !entered) {
        // Small delay for cinematic entrance
        setTimeout(() => setEntered(true), 100);
      }
      if (!show) setEntered(false);
    });
    return unsub;
  }, [progress, entered]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-[55] pointer-events-none">
      <div className="h-full w-full flex flex-col items-center justify-center">
        {/* Button positioned below the baked-in tagline "We break complexity into clarity" */}
        <div
          className={`absolute transition-all duration-700 ease-out ${
            entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ top: "68%" }}
        >
          <button
            onClick={onStartProject}
            className="pointer-events-auto cursor-pointer rounded-full border border-white/70 bg-white/60 backdrop-blur-md px-10 md:px-14 py-3.5 md:py-4 font-sans text-sm md:text-base tracking-[0.25em] uppercase text-slate-800 transition-all duration-300 hover:bg-white/80 hover:border-white/90 hover:shadow-[0_0_40px_rgba(192,132,252,0.35)] group"
          >
            <span className="flex items-center gap-3">
              Start Your Project
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
