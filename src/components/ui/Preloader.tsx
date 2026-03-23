"use client";

import { DecryptedText } from "@/components/bits/DecryptedText";

interface PreloaderProps {
  progress: number;
}

export const Preloader = ({ progress }: PreloaderProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0b18]">
      {/* Subtle sky hint on dark bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(56,115,199,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="font-serif text-4xl md:text-6xl tracking-[0.3em] text-white uppercase mb-3">
          <DecryptedText
            text="DEVSLANE"
            animateOn="view"
            speed={60}
            maxIterations={10}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
            sequential
            revealDirection="start"
            className="text-white"
            encryptedClassName="text-white/35"
          />
        </h1>

        <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-white/50 mb-12">
          Innovation Through Code
        </p>

        <div className="w-64 md:w-80 relative">
          {/* Track */}
          <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
            {/* Fill */}
            <div
              className="h-full bg-devslane-glow rounded-full transition-all duration-150 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Percentage */}
          <p className="mt-4 text-center text-sm tracking-[0.2em] text-white/50 font-sans">
            Loading Experience{" "}
            <span className="text-devslane-purple">{Math.round(progress)}%</span>
          </p>
        </div>
      </div>
    </div>
  );
};
