"use client";

import { motion, Variants, useInView } from "framer-motion";
import { useMemo, useRef } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "characters" | "words";
  direction?: "top" | "bottom" | "left" | "right";
  onAnimationComplete?: () => void;
}

export const BlurText = ({
  text,
  className = "",
  delay = 150,
  animateBy = "characters",
  direction = "top",
  onAnimationComplete,
}: BlurTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const units = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  const getInitialPosition = () => {
    switch (direction) {
      case "top": return { y: -20 };
      case "bottom": return { y: 20 };
      case "left": return { x: -20 };
      case "right": return { x: 20 };
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      ...getInitialPosition(),
    },
    visible: (i: number) => ({
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      x: 0,
      transition: {
        delay: i * (delay / 1000),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onAnimationComplete={onAnimationComplete}
    >
      {units.map((unit, i) => (
        <motion.span
          key={`${unit}-${i}`}
          custom={i}
          variants={variants}
          className="inline-block"
          style={{ whiteSpace: unit === " " ? "pre" : undefined }}
        >
          {unit === " " ? "\u00A0" : unit}
          {animateBy === "words" && i < units.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
};
