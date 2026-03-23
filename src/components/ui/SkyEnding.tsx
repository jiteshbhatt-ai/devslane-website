"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkyEndingProps {
  isActive: boolean;
  onComplete: () => void;
}

type Phase = "fadeIn" | "thankYou" | "buildText" | "fadeToContact";

export const SkyEnding = ({ isActive, onComplete }: SkyEndingProps) => {
  const [phase, setPhase] = useState<Phase>("fadeIn");

  useEffect(() => {
    if (!isActive) {
      setPhase("fadeIn");
      return;
    }

    // Cinematic sequence with timeouts
    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setPhase("thankYou"), 600));
    timers.push(setTimeout(() => setPhase("buildText"), 2800));
    timers.push(setTimeout(() => setPhase("fadeToContact"), 4800));
    timers.push(setTimeout(() => onComplete(), 6000));

    return () => timers.forEach(clearTimeout);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-[90]">
      {/* Sky fade overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-sky-100"
      />

      {/* Sky-blue ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(135,206,235,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Horizon glow line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute left-[10%] right-[10%] top-[52%] h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(135,206,235,0.5), transparent)",
          boxShadow: "0 0 30px 5px rgba(135,206,235,0.15)",
        }}
      />

      {/* Text sequence */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "thankYou" && (
            <motion.div
              key="thank"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <p className="font-sans text-xs md:text-sm tracking-[0.4em] text-devslane-purple/60 uppercase mb-4">
                30+ Projects. 15+ Countries.
              </p>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-7xl tracking-[0.08em] text-slate-800">
                Thank You for Flying
                <br />
                <span className="text-slate-400">With Us</span>
              </h2>
            </motion.div>
          )}

          {(phase === "buildText" || phase === "fadeToContact") && (
            <motion.div
              key="build"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{
                opacity: phase === "fadeToContact" ? 0.4 : 1,
                y: 0,
                scale: 1,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <h2 className="font-serif text-3xl md:text-5xl lg:text-7xl tracking-[0.08em] text-slate-800">
                Let&apos;s Build Something
                <br />
                <span className="bg-gradient-to-r from-devslane-glow via-neon-purple to-neon-blue bg-clip-text text-transparent">
                  Extraordinary
                </span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
