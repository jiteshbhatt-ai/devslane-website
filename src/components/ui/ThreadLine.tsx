"use client";

import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";

interface ThreadLineProps {
  progress: MotionValue<number>;
  nodeCount: number;
}

export const ThreadLine = ({ progress, nodeCount }: ThreadLineProps) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const update = (p: number) => {
      const threadProgress = Math.max(0, Math.min(1, (p - 0.08) / 0.82));

      if (lineRef.current) {
        lineRef.current.style.height = `${threadProgress * 100}%`;
        lineRef.current.style.opacity = threadProgress > 0.01 ? "1" : "0";
      }

      const cardSpacing = 0.8 / nodeCount;
      nodesRef.current.forEach((node, i) => {
        if (!node) return;
        const cardStart = 0.1 + i * cardSpacing;
        const nodeVisible = p >= cardStart + 0.03;
        node.style.opacity = nodeVisible ? "1" : "0";
        node.style.transform = nodeVisible ? "scale(1)" : "scale(0)";
      });
    };

    const unsub = progress.on("change", update);
    return unsub;
  }, [progress, nodeCount]);

  return (
    <div className="absolute right-[calc(50%_-_min(210px,_calc(50vw_-_20px)))] top-0 bottom-0 z-[10] pointer-events-none">
      {/* Pin at top-right */}
      <div className="w-3 h-3 rounded-full bg-devslane-glow/50" style={{ boxShadow: "0 0 10px rgba(192,132,252,0.4)" }} />

      {/* Glowing thread line */}
      <div
        ref={lineRef}
        className="w-[2px] ml-[4px] transition-none"
        style={{
          opacity: 0,
          height: "0%",
          background: "linear-gradient(180deg, rgba(168,85,247,0.6) 0%, rgba(192,132,252,0.3) 50%, rgba(168,85,247,0.1) 100%)",
          boxShadow: "0 0 8px rgba(168,85,247,0.4), 0 0 20px rgba(168,85,247,0.15)",
        }}
      />

      {/* Node dots at each card position */}
      {Array.from({ length: nodeCount }).map((_, i) => {
        const topPercent = ((i + 0.5) / nodeCount) * 100;
        return (
          <div
            key={i}
            ref={(el) => { nodesRef.current[i] = el; }}
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-devslane-glow transition-all duration-500"
            style={{
              top: `${topPercent}%`,
              opacity: 0,
              transform: "scale(0)",
              boxShadow: "0 0 10px rgba(192,132,252,0.6), 0 0 20px rgba(192,132,252,0.3)",
            }}
          />
        );
      })}
    </div>
  );
};
