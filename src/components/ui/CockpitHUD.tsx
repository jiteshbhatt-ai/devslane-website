"use client";

import { useEffect, useRef } from "react";
import { useMouseParallax } from "@/hooks/useMouseParallax";

interface CockpitHUDProps {
  flightProgress: number;
  isActive: boolean;
}

const sectors = [
  { start: 0.05, end: 0.18, name: "FINTECH ZONE" },
  { start: 0.20, end: 0.33, name: "AI SECTOR" },
  { start: 0.35, end: 0.48, name: "PROPTECH REGION" },
  { start: 0.50, end: 0.63, name: "INFRASTRUCTURE GRID" },
  { start: 0.65, end: 0.78, name: "APP TERRITORY" },
  { start: 0.80, end: 0.93, name: "PLATFORM NETWORK" },
];

export const CockpitHUD = ({ flightProgress, isActive }: CockpitHUDProps) => {
  const { mouse } = useMouseParallax();
  const reticleRef = useRef<HTMLDivElement>(null);

  // Crosshair follows mouse slightly
  useEffect(() => {
    if (!isActive) return;
    let raf: number;
    const animate = () => {
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate(${mouse.current.x * 25}px, ${mouse.current.y * 18}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isActive, mouse]);

  if (!isActive) return null;

  const altitude = Math.floor(flightProgress * 42000);
  const speed = (0.72 + Math.sin(flightProgress * 12) * 0.12).toFixed(2);
  const activeSector = sectors.find(s => flightProgress >= s.start && flightProgress <= s.end);

  return (
    <div className="absolute inset-0 z-[52] pointer-events-none font-mono">
      {/* Scanline overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,200,0.05) 2px, rgba(0,255,200,0.05) 4px)",
      }} />

      {/* Top bar — sector info */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center">
        {activeSector ? (
          <div className="animate-pulse">
            <p className="text-[10px] tracking-[0.4em] text-cyan-400/40 uppercase">Entering Sector</p>
            <p className="text-sm tracking-[0.3em] text-cyan-300/70 uppercase mt-1">{activeSector.name}</p>
          </div>
        ) : (
          <p className="text-[10px] tracking-[0.4em] text-cyan-400/20 uppercase">Cruising</p>
        )}
      </div>

      {/* Left — Altitude */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <p className="text-[8px] tracking-[0.3em] text-cyan-400/30 uppercase rotate-[-90deg] origin-center mb-4">Alt</p>
        <div className="w-[3px] h-40 bg-cyan-900/20 rounded-full relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-400/60 to-cyan-300/30 rounded-full transition-all duration-300"
            style={{ height: `${flightProgress * 100}%` }}
          />
        </div>
        <p className="text-[9px] text-cyan-400/40 tabular-nums">{altitude.toLocaleString()}ft</p>
      </div>

      {/* Bottom left — Speed */}
      <div className="absolute bottom-8 left-8">
        <p className="text-[8px] tracking-[0.3em] text-cyan-400/25 uppercase">Speed</p>
        <p className="text-lg text-cyan-300/50 tabular-nums">MACH {speed}</p>
      </div>

      {/* Bottom right — Radar */}
      <div className="absolute bottom-8 right-8">
        <div className="w-20 h-20 rounded-full border border-cyan-400/10 relative">
          <div className="absolute inset-0 rounded-full border border-cyan-400/5" style={{ margin: "25%" }} />
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/50" />
          {/* Client blips */}
          {sectors.map((s, i) => {
            const isNear = Math.abs(flightProgress - (s.start + s.end) / 2) < 0.15;
            const angle = (i / sectors.length) * Math.PI * 2;
            const r = isNear ? 12 : 25;
            return (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full transition-all duration-500 ${isNear ? "bg-cyan-300/80 shadow-[0_0_6px_rgba(0,255,200,0.5)]" : "bg-cyan-400/20"}`}
                style={{
                  top: `${50 + Math.sin(angle) * r}%`,
                  left: `${50 + Math.cos(angle) * r}%`,
                }}
              />
            );
          })}
          {/* Sweep line */}
          <div
            className="absolute top-1/2 left-1/2 w-[40%] h-[1px] bg-gradient-to-r from-cyan-400/40 to-transparent origin-left"
            style={{ transform: `rotate(${flightProgress * 720}deg)` }}
          />
        </div>
        <p className="text-[8px] tracking-[0.2em] text-cyan-400/20 uppercase text-center mt-1">Radar</p>
      </div>

      {/* Center — Reticle (follows mouse) */}
      <div ref={reticleRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-cyan-400/15" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-cyan-400/15" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-cyan-400/15" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-cyan-400/15" />
          <div className="absolute inset-3 rounded-full border border-cyan-400/10" />
        </div>
      </div>

      {/* Progress bar — top */}
      <div className="absolute top-4 left-1/4 right-1/4 h-[1px] bg-cyan-900/20">
        <div className="h-full bg-cyan-400/30 transition-all duration-200" style={{ width: `${flightProgress * 100}%` }} />
      </div>
    </div>
  );
};
