"use client";

import { useRef, useEffect } from "react";
import { MotionValue, useTransform } from "framer-motion";

interface CanvasScrollerProps {
  images: HTMLImageElement[];
  frameCount: number;
  progress: MotionValue<number>;
  scrollRange?: [number, number];
}

const MAX_DPR = 1.5;

export const CanvasScroller = ({
  images,
  frameCount,
  progress,
  scrollRange = [0, 0.7],
}: CanvasScrollerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastRenderedIndexRef = useRef(-1);

  const frameIndex = useTransform(progress, scrollRange, [0, frameCount - 1]);

  // Canvas stays fully visible through the entire animation — no fade out
  // The last frames (1800-1920) already contain the final CTA screen

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d", { alpha: false });

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      lastRenderedIndexRef.current = -1;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;

      if (ctx && canvas && images.length > 0) {
        const index = Math.floor(frameIndex.get());
        const safeIndex = Math.max(0, Math.min(index, images.length - 1));

        if (lastRenderedIndexRef.current !== safeIndex) {
          const img = images[safeIndex] || images[0];

          if (img && img.width) {
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShiftX = (canvas.width - img.width * ratio) / 2;
            const centerShiftY = (canvas.height - img.height * ratio) / 2;

            ctx.drawImage(
              img,
              0,
              0,
              img.width,
              img.height,
              centerShiftX,
              centerShiftY,
              img.width * ratio,
              img.height * ratio
            );

            lastRenderedIndexRef.current = safeIndex;
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [images, frameIndex]);

  return (
    <canvas
      ref={canvasRef}
      style={{ willChange: "transform" }}
      className="absolute inset-0 h-screen w-full object-cover"
    />
  );
};
