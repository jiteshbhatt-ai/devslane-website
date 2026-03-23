"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue } from "framer-motion";
import { useWheelProgress } from "@/hooks/useWheelProgress";
import { Navbar } from "@/components/ui/Navbar";
import { GradientText } from "@/components/bits/GradientText";
import { CountUp } from "@/components/bits/CountUp";
import { Stack } from "@/components/bits/Stack";
import { DecryptedText } from "@/components/bits/DecryptedText";
import { ChevronDown, Zap, Heart, Users, Rocket } from "lucide-react";
import Link from "next/link";

const stats = [
  { value: 8, suffix: "+", label: "Years of Experience", color: "#A855F7" },
  { value: 200, suffix: "+", label: "Projects Delivered", color: "#3B82F6" },
  { value: 50, suffix: "+", label: "Team Members", color: "#34D399" },
  { value: 15, suffix: "+", label: "Countries Served", color: "#F472B6" },
];

const values = [
  { title: "Innovation First", desc: "We don't follow trends — we create them. Every solution pushes the boundary of what's possible.", icon: Zap, gradient: "from-slate-800/90 to-slate-700/85", accent: "#A855F7" },
  { title: "Quality Obsessed", desc: "From pixel-perfect UI to rock-solid backends, we refuse to ship anything less than exceptional.", icon: Heart, gradient: "from-slate-800/90 to-slate-700/85", accent: "#F472B6" },
  { title: "Client Partners", desc: "Your success is our success. We embed with your team and treat your product as our own.", icon: Users, gradient: "from-slate-800/90 to-slate-700/85", accent: "#60A5FA" },
  { title: "Always Shipping", desc: "Fast iterations, continuous delivery. We believe in momentum over perfection.", icon: Rocket, gradient: "from-slate-800/90 to-slate-700/85", accent: "#34D399" },
];

export default function AboutPage() {
  const progress = useWheelProgress(true, 0.0003, 0.07);
  const [activeValue, setActiveValue] = useState(0);

  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if (p >= 0.45 && p < 0.85) {
        const idx = Math.floor(((p - 0.45) / 0.40) * values.length);
        setActiveValue(Math.max(0, Math.min(values.length - 1, idx)));
      }
    });
    return unsub;
  }, [progress]);

  return (
    <main className="relative h-screen overflow-hidden bg-transparent">
      <Navbar isVisible={true} progress={progress} />

      <div className="relative h-screen overflow-hidden z-[1]">
        <AboutHero progress={progress} />
        <StatsSection progress={progress} />

        {/* Values — full-screen cards */}
        <ValuesSection activeValue={activeValue} progress={progress} />

        <ClosingSection progress={progress} />
        <ScrollHint progress={progress} />
      </div>
    </main>
  );
}

function AboutHero({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if (!ref.current) return;
      ref.current.style.opacity = String(Math.max(0, 1 - p / 0.1));
      ref.current.style.transform = `translateY(${-p * 250}px) scale(${Math.max(0.8, 1 - p * 0.3)})`;
    });
    return unsub;
  }, [progress]);

  return (
    <div ref={ref} className="absolute inset-0 z-[30] flex flex-col items-center justify-center text-center pointer-events-none">
      <p className="font-sans text-xs tracking-[0.4em] text-devslane-glow/60 uppercase mb-4">
        <DecryptedText text="Who We Are" animateOn="view" speed={40} sequential revealDirection="start" />
      </p>
      <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl tracking-[0.06em] text-white">
        About
        <br />
        <GradientText>Devslane</GradientText>
      </h1>
      <p className="mt-6 font-sans text-sm text-white/40 max-w-md leading-relaxed">
        A team of engineers, designers, and strategists building the future of digital products.
      </p>
    </div>
  );
}

function StatsSection({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if (!ref.current) return;
      const fadeIn = Math.max(0, Math.min(1, (p - 0.12) / 0.08));
      const fadeOut = Math.max(0, Math.min(1, (p - 0.38) / 0.06));
      ref.current.style.opacity = String(Math.max(0, fadeIn - fadeOut));
    });
    return unsub;
  }, [progress]);

  return (
    <div ref={ref} className="absolute inset-0 z-[25] flex items-center justify-center" style={{ opacity: 0 }}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-serif text-5xl md:text-7xl text-white mb-2" style={{ textShadow: `0 0 30px ${stat.color}40` }}>
              <CountUp target={stat.value} suffix={stat.suffix} />
            </div>
            <div className="font-sans text-[10px] md:text-xs text-slate-400 tracking-[0.2em] uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValuesSection({ progress }: { activeValue: number; progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const totalCards = values.length;

  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if (!ref.current) return;
      const fadeIn = Math.max(0, Math.min(1, (p - 0.43) / 0.05));
      const fadeOut = Math.max(0, Math.min(1, (p - 0.85) / 0.05));
      ref.current.style.opacity = String(Math.max(0, fadeIn - fadeOut));
    });
    return unsub;
  }, [progress]);

  return (
    <div ref={ref} className="absolute inset-0 z-[25] flex items-center justify-center" style={{ opacity: 0 }}>
      <div style={{ width: "min(640px, 85vw)", height: 420 }}>
        <Stack
          randomRotation={true}
          sensitivity={180}
          sendToBackOnClick={true}
          autoplay={true}
          autoplayDelay={3500}
          pauseOnHover={true}
          cards={values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className={`w-full h-full rounded-3xl bg-gradient-to-br ${v.gradient} backdrop-blur-xl border border-slate-600/30 p-10 md:p-14 overflow-hidden relative`}
              >
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-25" style={{ background: v.accent }} />
                <div className="relative z-10">
                  <p className="font-sans text-xs tracking-[0.3em] text-slate-400 uppercase mb-6">
                    {String(i + 1).padStart(2, "0")} / {String(totalCards).padStart(2, "0")}
                  </p>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: `${v.accent}20` }}>
                    <Icon className="w-7 h-7" style={{ color: v.accent }} strokeWidth={1.3} />
                  </div>
                  <h3 className="font-serif text-3xl md:text-5xl text-white mb-4">{v.title}</h3>
                  <p className="font-sans text-sm md:text-base text-slate-300 leading-relaxed max-w-lg">{v.desc}</p>
                </div>
              </div>
            );
          })}
        />
      </div>
    </div>
  );
}

function ClosingSection({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if (!ref.current) return;
      const opacity = Math.max(0, Math.min(1, (p - 0.90) / 0.07));
      ref.current.style.opacity = String(opacity);
      ref.current.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
    });
    return unsub;
  }, [progress]);

  return (
    <div ref={ref} className="absolute inset-0 z-[30] flex items-center justify-center" style={{ opacity: 0, pointerEvents: "none" }}>
      <div className="text-center">
        <p className="font-sans text-xs tracking-[0.4em] text-devslane-purple/60 uppercase mb-4">Our Promise</p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-3">
          Built by Engineers.
          <br />
          <span className="text-white/40">Designed by Dreamers.</span>
        </h2>
        <div className="mt-8">
          <Link href="/contact" className="inline-flex items-center gap-3 rounded-full border border-devslane-purple/30 bg-devslane-purple/15 backdrop-blur-md px-10 py-4 font-sans text-sm tracking-[0.2em] uppercase text-white/80 transition-all duration-300 hover:bg-devslane-purple/25 hover:shadow-[0_0_40px_rgba(192,132,252,0.25)]">
            Work With Us
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if (ref.current) ref.current.style.opacity = p < 0.03 ? "1" : "0";
    });
    return unsub;
  }, [progress]);
  return (
    <div ref={ref} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[40] flex flex-col items-center gap-2 pointer-events-none">
      <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-slate-400">Scroll</span>
      <ChevronDown className="w-4 h-4 text-slate-300 animate-bounce" />
    </div>
  );
}

