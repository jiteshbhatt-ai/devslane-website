"use client";

import { useState, useEffect, useCallback, ReactNode, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";

interface StackProps {
  cards: ReactNode[];
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  scrollToAdvance?: boolean;
}

export const Stack = ({
  cards,
  randomRotation = true,
  sensitivity = 200,
  sendToBackOnClick = true,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  scrollToAdvance = true,
}: StackProps) => {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [hovered, setHovered] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollCooldownRef = useRef(false);

  const sendToBack = useCallback(() => {
    setOrder((prev) => {
      const topCard = prev[prev.length - 1];
      const rest = prev.slice(0, -1);
      return [topCard, ...rest];
    });
  }, []);

  const sendToBackByIndex = useCallback((index: number) => {
    setOrder((prev) => {
      const newOrder = prev.filter((i) => i !== index);
      return [index, ...newOrder];
    });
  }, []);

  // Scroll to cycle cards
  useEffect(() => {
    if (!scrollToAdvance || !containerRef.current) return;

    const el = containerRef.current;
    const handleWheel = (e: WheelEvent) => {
      // Only handle if mouse is over the stack
      if (scrollCooldownRef.current) return;

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 15) return;

      e.preventDefault();
      e.stopPropagation();

      scrollCooldownRef.current = true;

      if (delta > 0) {
        // Scroll down → send top card to back
        sendToBack();
      } else {
        // Scroll up → bring bottom card to top
        setOrder((prev) => {
          const bottomCard = prev[0];
          const rest = prev.slice(1);
          return [...rest, bottomCard];
        });
      }

      // Cooldown to prevent rapid cycling
      setTimeout(() => {
        scrollCooldownRef.current = false;
      }, 300);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [scrollToAdvance, sendToBack]);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    if (pauseOnHover && hovered) return;

    autoplayRef.current = setInterval(() => {
      sendToBack();
    }, autoplayDelay);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, autoplayDelay, pauseOnHover, hovered, sendToBack]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {order.map((cardIndex, stackPos) => {
        const isTop = stackPos === order.length - 1;
        const rotation = randomRotation
          ? (cardIndex % 2 === 0 ? 1 : -1) * ((cardIndex * 3.7 + 1.5) % 8)
          : 0;

        return (
          <StackCard
            key={cardIndex}
            index={cardIndex}
            stackPosition={stackPos}
            totalCards={cards.length}
            rotation={rotation}
            isTop={isTop}
            sensitivity={sensitivity}
            sendToBackOnClick={sendToBackOnClick}
            onSendToBack={sendToBackByIndex}
          >
            {cards[cardIndex]}
          </StackCard>
        );
      })}
    </div>
  );
};

interface StackCardProps {
  children: ReactNode;
  index: number;
  stackPosition: number;
  totalCards: number;
  rotation: number;
  isTop: boolean;
  sensitivity: number;
  sendToBackOnClick: boolean;
  onSendToBack: (index: number) => void;
}

const StackCard = ({
  children,
  index,
  stackPosition,
  totalCards,
  rotation,
  isTop,
  sensitivity,
  sendToBackOnClick,
  onSendToBack,
}: StackCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateZ = useTransform(x, [-sensitivity, 0, sensitivity], [-15, rotation, 15]);
  const cardOpacity = useTransform(x, (latestX) => {
    const latestY = y.get();
    const dist = Math.sqrt(latestX * latestX + latestY * latestY);
    return Math.max(0.5, 1 - dist / (sensitivity * 2));
  });

  const scale = 1 - (totalCards - 1 - stackPosition) * 0.04;
  const yOffset = (totalCards - 1 - stackPosition) * -6;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const dist = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    if (dist > sensitivity) {
      onSendToBack(index);
    }
    animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    animate(y, 0, { type: "spring", stiffness: 300, damping: 20 });
  };

  const handleClick = () => {
    if (sendToBackOnClick && isTop) {
      onSendToBack(index);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden"
      style={{
        x,
        y,
        rotateZ,
        opacity: cardOpacity,
        scale,
        translateY: yOffset,
        zIndex: stackPosition,
      }}
      drag={isTop}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      whileHover={isTop ? { scale: scale * 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.div>
  );
};
