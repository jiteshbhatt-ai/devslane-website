"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "hover" | "view" | "click";
  revealDirection?: "start" | "end" | "center";
  sequential?: boolean;
  useOriginalCharsOnly?: boolean;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 15,
  characters = DEFAULT_CHARS,
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  revealDirection = "start",
  sequential = false,
  useOriginalCharsOnly = false,
}: DecryptedTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  // Always start with real text to avoid SSR/hydration mismatch.
  // For 'view' mode, we scramble to random chars client-side after mount.
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== "view");
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scramble to encrypted state client-side only (after hydration).
  // We keep the span invisible until after scramble to prevent the
  // real-text → scrambled-text flash (the "glitch").
  useEffect(() => {
    if (animateOn === "view") {
      setDisplayText(text.replace(/[^\s]/g, () => getRandomChar(characters, useOriginalCharsOnly, text)));
      setIsDecrypted(false);
    }
    // Small delay so the scrambled text is set before we reveal
    const t = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decrypt = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsDecrypted(false);

    const iterations = new Array(text.length).fill(0);
    const revealed = new Array(text.length).fill(false);

    const getRevealOrder = () => {
      const indices = text.split("").map((_, i) => i);
      if (revealDirection === "end") return indices.reverse();
      if (revealDirection === "center") {
        const mid = Math.floor(indices.length / 2);
        const result: number[] = [];
        for (let i = 0; i <= mid; i++) {
          if (mid + i < indices.length) result.push(mid + i);
          if (mid - i >= 0 && mid - i !== mid + i) result.push(mid - i);
        }
        return result;
      }
      return indices;
    };

    const order = getRevealOrder();
    let orderIdx = 0;

    intervalRef.current = setInterval(() => {
      let allDone = true;

      // Reveal characters sequentially or all at once
      if (sequential && orderIdx < order.length) {
        const revealCount = Math.max(1, Math.floor(text.length / maxIterations));
        for (let j = 0; j < revealCount && orderIdx < order.length; j++) {
          revealed[order[orderIdx]] = true;
          orderIdx++;
        }
      }

      const newText = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";

          if (sequential) {
            if (revealed[i]) return char;
            allDone = false;
            return getRandomChar(characters, useOriginalCharsOnly, text);
          }

          iterations[i]++;
          if (iterations[i] >= maxIterations) return char;
          allDone = false;
          return getRandomChar(characters, useOriginalCharsOnly, text);
        })
        .join("");

      setDisplayText(newText);

      if (allDone || (sequential && orderIdx >= order.length)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsDecrypted(true);
        setIsAnimating(false);
      }
    }, speed);
  }, [text, speed, maxIterations, characters, revealDirection, sequential, useOriginalCharsOnly, isAnimating]);

  // Animate on view — only after mount so SSR text isn't scrambled
  useEffect(() => {
    if (animateOn === "view" && isInView && !isDecrypted && isMounted) {
      decrypt();
    }
  }, [animateOn, isInView, isDecrypted, decrypt, isMounted]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleInteraction = () => {
    if (animateOn === "hover") decrypt();
    if (animateOn === "click") decrypt();
  };

  return (
    <span
      ref={ref}
      className={`inline-block ${parentClassName}`}
      onMouseEnter={animateOn === "hover" ? handleInteraction : undefined}
      onClick={animateOn === "click" ? handleInteraction : undefined}
      suppressHydrationWarning
      style={{
        // Hide until mounted to prevent real→scrambled text flash (glitch)
        opacity: animateOn === "view" && !isMounted ? 0 : 1,
        transition: "opacity 0.15s ease",
      }}
    >
      {displayText.split("").map((char, i) => (
        <span
          key={i}
          className={`${isDecrypted || char === text[i] ? className : encryptedClassName || "opacity-60"}`}
          suppressHydrationWarning
        >
          {char}
        </span>
      ))}
    </span>
  );
};

function getRandomChar(characters: string, useOriginal: boolean, text: string): string {
  if (useOriginal) {
    const nonSpace = text.replace(/\s/g, "");
    return nonSpace[Math.floor(Math.random() * nonSpace.length)] || "?";
  }
  return characters[Math.floor(Math.random() * characters.length)];
}
