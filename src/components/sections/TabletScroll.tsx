"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface TabletScrollProps {
  onComplete: () => void;
}

const stats = [
  { value: "8+", label: "Years" },
  { value: "200+", label: "Projects" },
  { value: "50+", label: "Engineers" },
  { value: "15+", label: "Countries" },
];

export const TabletScroll = ({ onComplete }: TabletScrollProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const heroGroupRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const completedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  useGSAP(
    () => {
      if (!wrapperRef.current || !heroGroupRef.current || !tabletRef.current) return;

      // ===== INITIAL STATES =====
      // Text elements start invisible
      gsap.set(subtitleRef.current, { opacity: 0, letterSpacing: "0.5em" });
      gsap.set(line1Ref.current, { opacity: 0, y: 80 });
      gsap.set(line2Ref.current, { opacity: 0, y: 80 });
      gsap.set(descRef.current, { opacity: 0, y: 30 });
      gsap.set(ctaRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(scrollHintRef.current, { opacity: 0, y: 10 });

      // Tablet starts below screen, scaled down
      gsap.set(tabletRef.current, {
        xPercent: -50,
        yPercent: 10,
        top: "110%",
        scale: 0.8,
      });

      // Stats hidden
      gsap.set(statsRef.current, { opacity: 0 });
      statItemsRef.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 30 });
      });

      // ===== MASTER TIMELINE =====
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (self.progress > 0.95) handleComplete();
          },
        },
      });

      // ===== PHASE 1 (0–0.3): Grand Text Entrance =====
      tl.to(subtitleRef.current, {
        opacity: 1,
        letterSpacing: "0.3em",
        duration: 0.08,
        ease: "power2.out",
      }, 0);

      tl.to(line1Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.1,
        ease: "power3.out",
      }, 0.03);

      tl.to(line2Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.1,
        ease: "power3.out",
      }, 0.06);

      tl.to(descRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.08,
        ease: "power2.out",
      }, 0.1);

      tl.to(ctaRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.08,
        ease: "back.out(1.7)",
      }, 0.14);

      tl.to(scrollHintRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.06,
      }, 0.12);

      // ===== PHASE 2 (0.3–0.7): Text Exit + Tablet Rise =====
      // Hero text exits with blur
      tl.to(heroGroupRef.current, {
        y: -120,
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
      }, 0.3);

      // Scroll hint exits
      tl.to(scrollHintRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.05,
      }, 0.28);

      // Tablet rises into center
      tl.to(tabletRef.current, {
        top: "45%",
        yPercent: -50,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      }, 0.32);

      // ===== PHASE 3 (0.7–1.0): Stats Reveal =====
      tl.to(statsRef.current, {
        opacity: 1,
        duration: 0.05,
      }, 0.72);

      statItemsRef.current.forEach((el, i) => {
        if (el) {
          tl.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.06,
            ease: "power2.out",
          }, 0.74 + i * 0.03);
        }
      });
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="h-[300vh] relative">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center">
        {/* Background gradient for text depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.15) 0%, transparent 70%)",
          }}
        />

        {/* ===== HERO TEXT GROUP ===== */}
        <div
          ref={heroGroupRef}
          className="absolute top-[22%] left-1/2 -translate-x-1/2 text-center z-10 w-full max-w-4xl px-6"
        >
          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-slate-500 text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase mb-6"
          >
            Web Development · AI Solutions · SaaS Products
          </p>

          {/* Main heading — two lines */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl tracking-[0.02em] text-slate-800 leading-[1.1] mb-6">
            <span ref={line1Ref} className="block">
              We Break Complexity
            </span>
            <span ref={line2Ref} className="block mt-1">
              Into{" "}
              <span className="bg-gradient-to-r from-devslane-glow via-neon-purple to-neon-blue bg-clip-text text-transparent">
                Clarity
              </span>
            </span>
          </h1>

          {/* Description */}
          <p
            ref={descRef}
            className="font-sans text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed mb-8"
          >
            A full-stack engineering team building the future of digital products.
            From startups to enterprises, across 15+ countries.
          </p>

          {/* CTA */}
          <button
            ref={ctaRef}
            className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase px-10 py-4 rounded-full border border-devslane-purple/30 bg-devslane-purple/10 text-slate-700 backdrop-blur-sm transition-all duration-300 hover:bg-devslane-purple/20 hover:border-devslane-purple/50 hover:shadow-[0_0_40px_rgba(192,132,252,0.2)]"
          >
            Explore Our Work
          </button>
        </div>

        {/* ===== TABLET MOCKUP ===== */}
        <div
          ref={tabletRef}
          className="absolute left-1/2 w-[82vw] max-w-[920px] aspect-[4/3] bg-black border-[12px] md:border-[16px] border-[#1a1c23] rounded-[24px] md:rounded-[32px] overflow-hidden"
          style={{
            boxShadow: "0 30px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Screen bezel reflection */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
            }}
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-city-skyline-at-night-34477-large.mp4"
          />
        </div>

        {/* Tablet reflection */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[70vw] max-w-[800px] h-[60px] pointer-events-none"
          style={{
            top: "calc(45% + min(30vw, 345px))",
            background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,0,0,0.06) 0%, transparent 70%)",
          }}
        />

        {/* ===== STATS (below tablet, Phase 3) ===== */}
        <div
          ref={statsRef}
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ top: "calc(45% + min(32vw, 360px))" }}
        >
          <div className="flex items-center gap-8 md:gap-14">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                ref={(el) => { statItemsRef.current[i] = el; }}
                className="text-center"
              >
                <div className="font-serif text-2xl md:text-4xl text-slate-800 mb-1">
                  {stat.value}
                </div>
                <div className="font-sans text-[9px] md:text-xs text-slate-400 tracking-[0.2em] uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SCROLL INDICATOR ===== */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-slate-400">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 text-slate-300 animate-bounce" />
        </div>

        {/* ===== FLOATING PARTICLES ===== */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-devslane-glow/20 pointer-events-none"
            style={{
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
              left: `${15 + Math.random() * 70}%`,
              top: `${20 + Math.random() * 60}%`,
              animation: `floatParticle ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
