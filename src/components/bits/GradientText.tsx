"use client";

import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

export const GradientText = ({
  children,
  className = "",
  colors = ["#C084FC", "#A855F7", "#3B82F6", "#A855F7", "#C084FC"],
  animationSpeed = 4,
}: GradientTextProps) => {
  const gradient = colors.join(", ");

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradient})`,
        backgroundSize: "300% 100%",
        animation: `gradientShift ${animationSpeed}s ease-in-out infinite`,
      }}
    >
      {children}
    </span>
  );
};
