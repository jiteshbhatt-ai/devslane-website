"use client";

import { motion, Variants } from "framer-motion";
import { useMemo } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "char" | "word";
  staggerDelay?: number;
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const SplitText = ({
  text,
  className = "",
  delay = 0,
  animateBy = "char",
  staggerDelay,
}: SplitTextProps) => {
  const units = useMemo(() => {
    if (animateBy === "word") return text.split(" ");
    return text.split("");
  }, [text, animateBy]);

  const variants = animateBy === "word" ? wordVariants : charVariants;
  const baseStagger = staggerDelay ?? (animateBy === "word" ? 0.08 : 0.03);

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      initial="hidden"
      animate="visible"
    >
      {units.map((unit, i) => (
        <motion.span
          key={`${unit}-${i}`}
          custom={i + delay / baseStagger}
          variants={variants}
          className="inline-block"
          style={{ whiteSpace: unit === " " ? "pre" : undefined }}
        >
          {unit === " " ? "\u00A0" : unit}
          {animateBy === "word" && i < units.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
};
