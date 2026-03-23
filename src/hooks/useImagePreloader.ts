"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Preloads a range of frame images.
 * @param frameCount - total frames to load
 * @param pathPrefix - path prefix (e.g. "/frames/frame_")
 * @param padLength - zero-pad length for filename (default 10)
 * @param batchSize - parallel batch size (default 80)
 * @param startIndex - first frame number in the file naming (default 1)
 */
export const useImagePreloader = (
  frameCount: number,
  pathPrefix: string,
  padLength: number = 10,
  batchSize: number = 80,
  startIndex: number = 1
) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(frameCount);

    const endIndex = startIndex + frameCount - 1;

    const loadBatch = async (batchStart: number) => {
      const promises: Promise<void>[] = [];

      for (let j = 0; j < batchSize && batchStart + j <= endIndex; j++) {
        const fileNum = batchStart + j;
        const arrayIdx = fileNum - startIndex; // 0-based index in our array
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
  }, [frameCount, pathPrefix, padLength, batchSize, startIndex]);

  return { images, loadedCount, isComplete: loadedCount >= frameCount };
};
