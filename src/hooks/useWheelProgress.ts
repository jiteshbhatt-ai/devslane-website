"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, MotionValue } from "framer-motion";

/**
 * Drives a 0→1 progress value via wheel events (no actual page scrolling).
 * The page stays fixed at 100vh. Wheel deltas accumulate into progress.
 *
 * @param enabled - Whether wheel events are captured (false = locked)
 * @param sensitivity - How much one wheel tick moves progress (lower = slower scroll)
 * @param lerp - Smoothing factor (0-1, lower = smoother/slower interpolation)
 */
export function useWheelProgress(
  enabled: boolean,
  sensitivity: number = 0.0004,
  lerp: number = 0.08
): MotionValue<number> {
  const progress = useMotionValue(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Smooth interpolation loop
    const animate = () => {
      const current = progress.get();
      const target = targetRef.current;
      const diff = target - current;

      // Only update if difference is meaningful
      if (Math.abs(diff) > 0.0001) {
        progress.set(current + diff * lerp);
      } else if (current !== target) {
        progress.set(target);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [progress, lerp]);

  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY * sensitivity;
      targetRef.current = Math.max(0, Math.min(1, targetRef.current + delta));
    };

    // Must use { passive: false } to call preventDefault
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [enabled, sensitivity]);

  // Also handle touch events for mobile
  useEffect(() => {
    if (!enabled) return;

    let lastTouchY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const delta = (lastTouchY - currentY) * sensitivity * 3;
      targetRef.current = Math.max(0, Math.min(1, targetRef.current + delta));
      lastTouchY = currentY;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [enabled, sensitivity]);

  return progress;
}
