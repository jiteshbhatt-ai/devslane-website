"use client";

import { useRef, useEffect, useCallback } from "react";

interface SkyPlayerProps {
  images: HTMLImageElement[];
  loadedCount: number;
  isPlaying: boolean;
  onProgress: (progress: number) => void;
  onComplete: () => void;
}

const MAX_DPR = 1.5;
const TARGET_FPS = 30;
const FRAME_DURATION = 1000 / TARGET_FPS; // ~33.3ms

export const SkyPlayer = ({
  images,
  loadedCount,
  isPlaying,
  onProgress,
  onComplete,
}: SkyPlayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const frameIndexRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  // Total effective frames at 30fps (every 2nd frame from 60fps source)

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d", { alpha: false });

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    window.addEventListener("resize", resize);
    resize();

    return () => window.removeEventListener("resize", resize);
  }, []);

  const renderFrame = useCallback(
    (index: number) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      // Play every 2nd frame from 60fps source → 30fps visual
      const sourceIndex = Math.min(index * 2, images.length - 1);
      const img = images[sourceIndex];

      if (!img || !img.width) return;

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const cx = (canvas.width - img.width * ratio) / 2;
      const cy = (canvas.height - img.height * ratio) / 2;

      ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    },
    [images]
  );

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying || images.length === 0) return;

    const effectiveTotalFrames = Math.floor(images.length / 2);
    frameIndexRef.current = 0;
    lastTimeRef.current = 0;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= FRAME_DURATION) {
        lastTimeRef.current = timestamp - (elapsed % FRAME_DURATION);

        const currentFrame = frameIndexRef.current;

        // Check if we've caught up to loaded frames (buffering)
        const maxPlayableFrame = Math.floor(loadedCount / 2) - 1;

        if (currentFrame <= maxPlayableFrame) {
          renderFrame(currentFrame);

          const progress = currentFrame / effectiveTotalFrames;
          onProgress(Math.min(progress, 1));

          frameIndexRef.current++;

          if (frameIndexRef.current >= effectiveTotalFrames) {
            onComplete();
            return;
          }
        }
        // else: buffering — wait for more frames to load
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, images, loadedCount, renderFrame, onProgress, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-screen w-full"
      style={{ willChange: "transform" }}
    />
  );
};
