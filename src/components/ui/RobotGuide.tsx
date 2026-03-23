"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export const RobotGuide = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  // Eyes follow mouse
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      const ex = mx * 3;
      const ey = my * 2;
      if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate(${ex}px, ${ey}px)`;
      if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate(${ex}px, ${ey}px)`;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Context-aware message
  const getMessage = () => {
    if (pathname === "/contact") return "Ready to help!";
    if (pathname === "/services") return "Scroll to browse!";
    if (pathname === "/clients") return "Our portfolio!";
    if (pathname === "/about") return "Our story!";
    return "Hey there!";
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[80] cursor-pointer transition-all duration-300 ${hovered ? "scale-110" : "scale-100"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animation: "robotFloat 3s ease-in-out infinite" }}
    >
      {/* Chat bubble */}
      <div className={`absolute -top-10 right-0 whitespace-nowrap transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div className="bg-white/80 backdrop-blur-md rounded-lg px-3 py-1.5 border border-slate-200">
          <p className="font-sans text-[10px] text-slate-600 tracking-wider">{getMessage()}</p>
        </div>
      </div>

      {/* Robot body */}
      <div ref={bodyRef} className="relative w-12 h-14">
        {/* Head */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-8 rounded-xl bg-gradient-to-b from-devslane-glow/30 to-devslane-purple/30 border border-slate-200 overflow-hidden">
          {/* Visor */}
          <div className="absolute inset-x-1 top-1.5 h-4 rounded-md bg-slate-800/60 flex items-center justify-center gap-2">
            {/* Left eye */}
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/20 flex items-center justify-center">
              <div ref={leftEyeRef} className="w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_4px_rgba(0,255,200,0.8)]" />
            </div>
            {/* Right eye */}
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/20 flex items-center justify-center">
              <div ref={rightEyeRef} className="w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_4px_rgba(0,255,200,0.8)]" />
            </div>
          </div>
          {/* Mouth — changes with hover */}
          <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 transition-all duration-300 ${hovered ? "w-3 h-1.5 rounded-b-full bg-cyan-300/40" : "w-2 h-0.5 rounded-full bg-cyan-400/20"}`} />

          {/* Antenna */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-slate-300" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-devslane-glow/50 shadow-[0_0_6px_rgba(192,132,252,0.6)]"
            style={{ animation: "blink 3s ease-in-out infinite" }}
          />
        </div>

        {/* Body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-6 rounded-b-xl bg-gradient-to-b from-devslane-purple/25 to-devslane-purple/15 border border-slate-200/50 border-t-0">
          {/* Chest light */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full bg-devslane-glow/40"
            style={{ animation: "chestPulse 2s ease-in-out infinite" }}
          />
        </div>

        {/* Arms */}
        <div className={`absolute top-8 -left-1 w-1.5 h-4 rounded-full bg-devslane-purple/20 border border-slate-200/50 transition-transform duration-300 origin-top ${hovered ? "rotate-[-30deg]" : "rotate-[5deg]"}`} />
        <div className={`absolute top-8 -right-1 w-1.5 h-4 rounded-full bg-devslane-purple/20 border border-slate-200/50 transition-transform duration-300 origin-top ${hovered ? "rotate-[30deg]" : "rotate-[-5deg]"}`} />
      </div>
    </div>
  );
};
