"use client";

import { useState, useEffect, useMemo } from "react";
import { MotionValue, useTransform, useMotionValueEvent } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { ShatterPlane } from "@/components/three/ShatterPlane";

interface GlassShatterProps {
  progress: MotionValue<number>;
  lastFrame: HTMLImageElement | undefined;
}

function ShatterScene({
  texture,
  shatterProgress,
}: {
  texture: THREE.Texture;
  shatterProgress: number;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 2, 5]} intensity={0.4} />
      <ShatterPlane texture={texture} shatterProgress={shatterProgress} />
    </>
  );
}

export const GlassShatter = ({ progress, lastFrame }: GlassShatterProps) => {
  const [mounted, setMounted] = useState(false);
  const [currentShatter, setCurrentShatter] = useState(0);

  const shatterProgress = useTransform(progress, [0.7, 0.85], [0, 1]);
  const containerOpacity = useTransform(
    progress,
    [0.68, 0.72, 0.83, 0.86],
    [0, 1, 1, 0]
  );

  // Lazy mount/unmount with hysteresis
  useMotionValueEvent(progress, "change", (v) => {
    if (v > 0.65 && !mounted) setMounted(true);
    if (v < 0.60 && mounted) setMounted(false);
  });

  // Track shatter progress for the Three.js scene
  useMotionValueEvent(shatterProgress, "change", (v) => {
    setCurrentShatter(Math.max(0, Math.min(1, v)));
  });

  // Create texture from last frame
  const texture = useMemo(() => {
    if (!lastFrame || !lastFrame.width) return null;
    const canvas = document.createElement("canvas");
    canvas.width = lastFrame.width;
    canvas.height = lastFrame.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(lastFrame, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [lastFrame]);

  // Update container opacity via DOM
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef) return;
    const unsubscribe = containerOpacity.on("change", (v) => {
      containerRef.style.opacity = String(v);
    });
    return unsubscribe;
  }, [containerRef, containerOpacity]);

  if (!mounted || !texture) return null;

  return (
    <div
      ref={setContainerRef}
      className="absolute inset-0 z-[30]"
      style={{ opacity: 0 }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ShatterScene texture={texture} shatterProgress={currentShatter} />
      </Canvas>
    </div>
  );
};
