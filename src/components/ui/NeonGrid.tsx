"use client";

import { MotionValue, useTransform, motion } from "framer-motion";

interface NeonGridProps {
  progress: MotionValue<number>;
}

export const NeonGrid = ({ progress }: NeonGridProps) => {
  const opacity = useTransform(progress, [0.82, 0.88], [0, 1]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden">
      {/* Perspective grid */}
      <div
        className="absolute inset-0"
        style={{
          perspective: "500px",
          perspectiveOrigin: "50% 40%",
        }}
      >
        <div
          className="absolute w-[200%] h-[200%] left-[-50%] top-[10%]"
          style={{
            transform: "rotateX(60deg)",
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "neonPulse 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Horizon glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(107, 33, 168, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Top fade to dark */}
      <div
        className="absolute top-0 left-0 right-0 h-1/3"
        style={{
          background:
            "linear-gradient(to bottom, #0a0a0a 0%, transparent 100%)",
        }}
      />
    </motion.div>
  );
};
