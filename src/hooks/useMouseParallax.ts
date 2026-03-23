"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Tracks mouse position as normalized values (-1 to 1) from center.
 * Returns a ref that always has the latest { x, y } values.
 * Components use this to create depth-based parallax effects.
 */
export function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    const animate = () => {
      mouse.current.x += (target.current.x - mouse.current.x) * 0.08;
      mouse.current.y += (target.current.y - mouse.current.y) * 0.08;
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const getTransform = useCallback((depth: number = 1) => {
    return {
      x: mouse.current.x * depth * 20,
      y: mouse.current.y * depth * 15,
    };
  }, []);

  return { mouse, getTransform };
}
