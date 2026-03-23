"use client";

import { MotionValue, useTransform } from "framer-motion";

/**
 * Maps a sub-range of scroll progress to a frame index.
 * Default: progress [0, 0.7] → frames [0, frameCount-1]
 */
export function useFrameIndex(
  progress: MotionValue<number>,
  frameCount: number,
  scrollRange: [number, number] = [0, 0.7]
): MotionValue<number> {
  return useTransform(progress, scrollRange, [0, frameCount - 1]);
}
