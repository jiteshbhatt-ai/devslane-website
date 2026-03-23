"use client";

import { ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  shimmerColor?: string;
}

export const ShimmerButton = ({
  children,
  className = "",
  onClick,
  type = "button",
  shimmerColor = "rgba(255,255,255,0.15)",
}: ShimmerButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
      />
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"
        style={{
          boxShadow: "0 0 30px rgba(168,85,247,0.2), inset 0 0 30px rgba(168,85,247,0.05)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
};
