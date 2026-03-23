"use client";

import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";

interface ScrollTextProps {
  progress: MotionValue<number>;
}

interface TextBlock {
  text: string;
  sub: string;
  fadeIn: number;
  fullIn: number;
  fullOut: number;
  fadeOut: number;
  style: "drip" | "glitch" | "wave" | "typewriter";
}

const textBlocks: TextBlock[] = [
  { text: "Breaking Boundaries", sub: "Shattering the ordinary", fadeIn: 0.23, fullIn: 0.27, fullOut: 0.31, fadeOut: 0.35, style: "glitch" },
  { text: "Entering the System", sub: "Where ideas take form", fadeIn: 0.36, fullIn: 0.40, fullOut: 0.44, fadeOut: 0.48, style: "drip" },
  { text: "Digital Architecture", sub: "Built for scale", fadeIn: 0.49, fullIn: 0.53, fullOut: 0.56, fadeOut: 0.60, style: "wave" },
  { text: "Precision Engineering", sub: "Every detail matters", fadeIn: 0.61, fullIn: 0.65, fullOut: 0.68, fadeOut: 0.72, style: "typewriter" },
];

function getBlockOpacity(p: number, block: TextBlock): number {
  if (p < block.fadeIn || p > block.fadeOut) return 0;
  if (p < block.fullIn) return (p - block.fadeIn) / (block.fullIn - block.fadeIn);
  if (p <= block.fullOut) return 1;
  return 1 - (p - block.fullOut) / (block.fadeOut - block.fullOut);
}

export const ScrollText = ({ progress }: ScrollTextProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const charsRef = useRef<(HTMLSpanElement[] | null)[]>([]);

  useEffect(() => {
    const update = (p: number) => {
      let maxOpacity = 0;

      textBlocks.forEach((block, i) => {
        const el = blocksRef.current[i];
        if (!el) return;

        const opacity = Math.max(0, Math.min(1, getBlockOpacity(p, block)));
        maxOpacity = Math.max(maxOpacity, opacity);

        // Base transforms
        let yOffset = 20 * (1 - opacity);
        if (p > block.fullOut && p <= block.fadeOut) {
          yOffset = -15 * (1 - opacity);
        }

        el.style.opacity = String(opacity);
        el.style.transform = `translate(-50%, -50%) translateY(${yOffset}px)`;

        // Per-character effects based on style
        const chars = charsRef.current[i];
        if (chars && opacity > 0) {
          const enterT = Math.min(1, (p - block.fadeIn) / (block.fullIn - block.fadeIn));

          chars.forEach((ch, ci) => {
            const charDelay = ci / chars.length;
            const charT = Math.max(0, Math.min(1, (enterT - charDelay * 0.5) * 2));

            switch (block.style) {
              case "glitch": {
                const glitch = charT < 0.7 ? (Math.random() - 0.5) * 8 * (1 - charT) : 0;
                const skew = charT < 0.5 ? (Math.random() - 0.5) * 15 : 0;
                ch.style.transform = `translateX(${glitch}px) skewX(${skew}deg)`;
                ch.style.opacity = String(charT > 0.1 ? 1 : 0);
                break;
              }
              case "drip": {
                const dripY = (1 - charT) * 40;
                const stretch = 1 + (1 - charT) * 0.3;
                ch.style.transform = `translateY(${-dripY}px) scaleY(${stretch})`;
                ch.style.opacity = String(charT);
                break;
              }
              case "wave": {
                const wave = Math.sin((ci * 0.5) + p * 20) * 8 * (1 - charT * 0.8);
                ch.style.transform = `translateY(${wave}px)`;
                ch.style.opacity = String(charT);
                break;
              }
              case "typewriter": {
                const show = enterT > charDelay;
                ch.style.opacity = show ? "1" : "0";
                ch.style.transform = show ? "none" : "translateY(5px)";
                break;
              }
            }
          });
        }
      });

      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(maxOpacity * 0.5);
      }
    };

    const unsub = progress.on("change", update);
    return unsub;
  }, [progress]);

  return (
    <div className="absolute inset-0 z-[45] pointer-events-none">
      {/* SVG filter for gooey effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
          </filter>
        </defs>
      </svg>

      {/* Light vignette */}
      <div ref={overlayRef} className="absolute inset-0" style={{
        opacity: 0,
        background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 50%, transparent 80%)",
      }} />

      {/* Text blocks */}
      {textBlocks.map((block, i) => (
        <div
          key={block.text}
          ref={(el) => { blocksRef.current[i] = el; }}
          className="absolute top-1/2 left-1/2 text-center"
          style={{ opacity: 0, transform: "translate(-50%, -50%) translateY(20px)", filter: block.style === "drip" ? "url(#gooey)" : undefined }}
        >
          <h2 className="font-serif text-3xl md:text-5xl lg:text-7xl tracking-[0.08em] text-slate-800 inline-flex flex-wrap justify-center gap-0">
            {block.text.split("").map((char, ci) => (
              <span
                key={ci}
                ref={(el) => {
                  if (!charsRef.current[i]) charsRef.current[i] = [];
                  if (el) charsRef.current[i]![ci] = el;
                }}
                className="inline-block transition-none"
                style={{ textShadow: "0 0 30px rgba(135,206,235,0.4)" }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          <p className="mt-3 md:mt-4 font-sans text-xs md:text-sm tracking-[0.25em] uppercase text-slate-500">
            {block.sub}
          </p>
        </div>
      ))}
    </div>
  );
};
