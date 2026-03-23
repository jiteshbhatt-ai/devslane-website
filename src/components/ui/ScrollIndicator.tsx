"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, MotionValue } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  isVisible: boolean;
  progress: MotionValue<number>;
}

export const ScrollIndicator = ({ isVisible, progress }: ScrollIndicatorProps) => {
  const [show, setShow] = useState(isVisible);

  // Hide once user starts scrolling
  useEffect(() => {
    if (!isVisible) {
      setShow(false);
      return;
    }
    setShow(true);
    const unsub = progress.on("change", (v) => {
      if (v > 0.03) setShow(false);
    });
    return unsub;
  }, [isVisible, progress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[55] flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-slate-500">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
