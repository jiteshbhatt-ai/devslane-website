"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkyTransitionProps {
  isLoading: boolean;
  loadProgress: number;
  onReady: () => void;
  minFramesForStart?: number;
  loadedCount: number;
}

export const SkyTransition = ({
  isLoading,
  loadProgress,
  onReady,
  minFramesForStart = 400,
  loadedCount,
}: SkyTransitionProps) => {
  // Once enough frames loaded, signal ready to start playback
  useEffect(() => {
    if (loadedCount >= minFramesForStart) {
      onReady();
    }
  }, [loadedCount, minFramesForStart, onReady]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-[80] flex flex-col items-center justify-center bg-[#0a0b14]"
        >
          {/* Sky-blue ambient glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(135, 206, 235, 0.2) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 text-center">
            <h2 className="font-serif text-2xl md:text-4xl tracking-[0.1em] text-white mb-4">
              Preparing Your Journey
            </h2>
            <p className="font-sans text-xs text-white/50 tracking-[0.2em] uppercase mb-8">
              Loading experience...
            </p>

            {/* Progress bar */}
            <div className="w-48 md:w-64 mx-auto">
              <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-devslane-glow rounded-full"
                  style={{ width: `${Math.min(loadProgress, 100)}%` }}
                  transition={{ duration: 0.15, ease: "linear" }}
                />
              </div>
              <p className="mt-3 text-center text-xs tracking-[0.15em] text-white/30 font-sans">
                {Math.round(loadProgress)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
