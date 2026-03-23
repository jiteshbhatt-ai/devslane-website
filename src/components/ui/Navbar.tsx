"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Link from "next/link";

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
  const bgOpacity = useTransform(progress, [0.8, 0.88], [0.1, 0.6]);

  if (!isVisible) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[70] px-6 md:px-12 py-4"
    >
      <motion.div
        style={{ backgroundColor: `rgba(255, 255, 255, ${bgOpacity.get()})` }}
        className="flex items-center justify-between backdrop-blur-md rounded-full px-6 py-3 border border-slate-200/50"
      >
        {/* Logo — links home */}
        <Link
          href="/"
          className="font-serif text-lg tracking-[0.3em] text-slate-800 uppercase hover:text-devslane-purple transition-colors duration-300"
        >
          Devslane
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-sans text-xs tracking-[0.2em] text-slate-600 uppercase hover:text-devslane-purple transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};
