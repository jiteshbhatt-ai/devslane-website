"use client";

import { RefObject, useEffect } from "react";
import { useMotionValue, MotionValue } from "framer-motion";

/**
 * Tracks scroll progress (0 → 1) through a tall container element.
 * Progress 0 = container top is at viewport top.
 * Progress 1 = container bottom is at viewport bottom.
 */
export function useScrollProgress(
  containerRef: RefObject<HTMLDivElement | null>
): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      progress.set(p);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, progress]);

  return progress;
}
