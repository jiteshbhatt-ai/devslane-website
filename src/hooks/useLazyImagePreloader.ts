"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Same as useImagePreloader but only starts loading when `enabled` becomes true.
 * Used for lazy-loading the sky flight frames only when triggered.
 */
export const useLazyImagePreloader = (
  frameCount: number,
  pathPrefix: string,
  padLength: number = 10,
  batchSize: number = 120,
  enabled: boolean = false,
  startIndex: number = 1
) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    imagesRef.current = new Array(frameCount);

    const endIndex = startIndex + frameCount - 1;

    const loadBatch = async (batchStart: number) => {
      const promises: Promise<void>[] = [];

      for (let j = 0; j < batchSize && batchStart + j <= endIndex; j++) {
        const fileNum = batchStart + j;
        const arrayIdx = fileNum - startIndex;
        promises.push(
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              if (!cancelled) {
                imagesRef.current[arrayIdx] = img;
                setLoadedCount((prev) => prev + 1);
              }
              resolve();
            };
            img.onerror = () => {
              if (!cancelled) {
                setLoadedCount((prev) => prev + 1);
              }
              resolve();
            };
            img.src = `${pathPrefix}${String(fileNum).padStart(padLength, "0")}.jpg`;
          })
        );
      }

      await Promise.all(promises);
    };

    const loadAll = async () => {
      for (let i = startIndex; i <= endIndex; i += batchSize) {
        if (cancelled) break;
        await loadBatch(i);
      }
      if (!cancelled) {
        setImages([...imagesRef.current]);
      }
    };

    setLoadedCount(0);
    loadAll();

    return () => {
      cancelled = true;
    };
  }, [frameCount, pathPrefix, padLength, batchSize, enabled, startIndex]);

  return { images, loadedCount, isComplete: loadedCount >= frameCount };
};
