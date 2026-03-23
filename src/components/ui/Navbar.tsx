"use client";

import { useCallback } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface NavbarProps {
  isVisible: boolean;
  progress: MotionValue<number>;
}

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Clients", href: "/clients" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const Navbar = ({ isVisible, progress }: NavbarProps) => {
  const bgOpacity = useTransform(progress, [0.8, 0.88], [0.05, 0.3]);

  const handleNav = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const transition = (window as unknown as Record<string, unknown>).__pageTransition as ((href: string) => void) | undefined;
    if (transition) {
      transition(href);
    } else {
      window.location.href = href;
    }
  }, []);

  if (!isVisible) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[70] px-6 md:px-12 py-4"
    >
      <motion.div
        style={{ backgroundColor: `rgba(10, 11, 20, ${bgOpacity.get()})` }}
        className="flex items-center justify-between backdrop-blur-md rounded-full px-6 py-3 border border-white/5"
      >
        <a
          href="/"
          onClick={(e) => handleNav(e, "/")}
          className="font-serif text-lg tracking-[0.3em] text-white uppercase hover:text-devslane-glow transition-colors duration-300"
        >
          Devslane
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className="font-sans text-xs tracking-[0.2em] text-white/60 uppercase hover:text-devslane-glow transition-colors duration-300 cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};
