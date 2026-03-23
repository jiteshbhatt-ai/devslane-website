"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { useWheelProgress } from "@/hooks/useWheelProgress";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

type Phase = "hero" | "form" | "success";

const serviceOptions = [
  { value: "web", label: "Web Development" },
  { value: "ai", label: "AI Solutions" },
  { value: "saas", label: "SaaS Products" },
  { value: "app", label: "App Development" },
  { value: "blockchain", label: "Blockchain" },
  { value: "devops", label: "DevOps" },
  { value: "uiux", label: "UI/UX" },
  { value: "team", label: "Team Augmentation" },
];

export default function ContactPage() {
  const progress = useWheelProgress(false);
  const [phase, setPhase] = useState<Phase>("hero");
  const [formData, setFormData] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Mouse parallax for hero text
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }, []
  );

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPhase("success");
  }, []);

  return (
    <main className="relative h-screen overflow-hidden bg-transparent">
      <Navbar isVisible={true} progress={progress} />

      <div className="relative h-screen overflow-hidden z-[1]">
        <AnimatePresence mode="wait">
          {/* ========== PHASE 1: HERO — Giant "LET'S TALK" ========== */}
          {phase === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
            >
              {/* Giant outlined text */}
              <HeroText mouseRef={mouseRef} />

              {/* Start button */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                onClick={() => setPhase("form")}
                className="mt-12 group relative rounded-full border border-devslane-purple/30 bg-devslane-purple/15 backdrop-blur-md px-12 py-4 font-sans text-sm tracking-[0.3em] uppercase text-slate-700 transition-all duration-500 hover:bg-devslane-purple/25 hover:border-devslane-purple/50 hover:shadow-[0_0_60px_rgba(192,132,252,0.3)] hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Begin
                  <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </span>
                {/* Glow pulse ring */}
                <span className="absolute inset-0 rounded-full border border-devslane-glow/20 animate-ping opacity-20" />
              </motion.button>
            </motion.div>
          )}

          {/* ========== PHASE 2: FORM ========== */}
          {phase === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center z-20 px-6"
            >
              <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-5">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-10">
                  <h2 className="font-serif text-3xl md:text-5xl text-slate-800 mb-2">Tell Us Your Vision</h2>
                  <p className="font-sans text-xs text-slate-600 tracking-[0.2em] uppercase">Every great product starts with a conversation</p>
                </motion.div>

                {/* Fields with staggered entrance + colored left borders */}
                {[
                  { name: "name", placeholder: "Your Name", type: "text", color: "#A855F7", delay: 0.15, required: true },
                  { name: "email", placeholder: "Email Address", type: "email", color: "#3B82F6", delay: 0.2, required: true },
                  { name: "company", placeholder: "Company (optional)", type: "text", color: "#34D399", delay: 0.25, required: false },
                ].map((field) => (
                  <motion.div key={field.name} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: field.delay, duration: 0.5 }}>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full bg-white/70 border-l-2 border-y border-r border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 font-sans tracking-wide outline-none focus:bg-white/90 transition-all duration-300"
                      style={{ borderLeftColor: field.color }}
                    />
                  </motion.div>
                ))}

                {/* Service pills (not dropdown) */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                  <p className="font-sans text-xs text-slate-600 tracking-[0.15em] uppercase mb-3">What do you need?</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, service: p.service === opt.value ? "" : opt.value }))}
                        className={`px-4 py-2 rounded-full text-xs tracking-wider font-sans border transition-all duration-300 ${
                          formData.service === opt.value
                            ? "border-devslane-purple/50 bg-devslane-purple/15 text-slate-800 shadow-[0_0_15px_rgba(192,132,252,0.2)]"
                            : "border-slate-200 bg-white/40 text-slate-500 hover:border-slate-300 hover:text-slate-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
                  <textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full bg-white/70 border-l-2 border-y border-r border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 font-sans tracking-wide outline-none focus:bg-white/90 transition-all duration-300 resize-none"
                    style={{ borderLeftColor: "#F472B6" }}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                  <button
                    type="submit"
                    className="group w-full relative overflow-hidden bg-gradient-to-r from-devslane-purple via-neon-purple to-neon-blue rounded-xl px-8 py-4 font-sans text-sm tracking-[0.2em] uppercase text-white transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] hover:scale-[1.01]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Send Message
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {/* ========== PHASE 3: SUCCESS ========== */}
          {phase === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
            >
              {/* Sparkle particles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.cos((i / 12) * Math.PI * 2) * (120 + Math.random() * 80),
                    y: Math.sin((i / 12) * Math.PI * 2) * (120 + Math.random() * 80),
                  }}
                  transition={{ duration: 1.2, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ background: `hsl(${260 + i * 15}, 80%, 70%)` }}
                />
              ))}

              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-devslane-purple to-neon-purple flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(168,85,247,0.4)]"
              >
                <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-4xl md:text-6xl text-slate-800 mb-4"
              >
                Message Sent!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-sans text-sm text-slate-500 tracking-[0.15em] uppercase mb-10"
              >
                We&apos;ll be in touch within 24 hours
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex gap-4"
              >
                <Link href="/" className="rounded-full border border-slate-200 bg-white/60 px-8 py-3 font-sans text-xs tracking-[0.2em] text-slate-600 uppercase hover:bg-white/80 transition-all duration-300">
                  Back Home
                </Link>
                <button
                  onClick={() => { setPhase("form"); setFormData({ name: "", email: "", company: "", service: "", message: "" }); }}
                  className="rounded-full border border-devslane-purple/30 bg-devslane-purple/15 px-8 py-3 font-sans text-xs tracking-[0.2em] text-devslane-purple uppercase hover:bg-devslane-purple/25 transition-all duration-300"
                >
                  Send Another
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/** Giant "LET'S TALK" hero text with mouse parallax */
function HeroText({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      if (textRef.current && mouseRef.current) {
        const { x, y } = mouseRef.current;
        textRef.current.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef]);

  return (
    <div ref={textRef} className="text-center select-none">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-serif text-[15vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] tracking-[0.04em]"
        style={{
          WebkitTextStroke: "1.5px rgba(107, 33, 168, 0.4)",
          color: "transparent",
          textShadow: "0 0 60px rgba(168, 85, 247, 0.15)",
        }}
      >
        LET&apos;S
        <br />
        TALK
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-6 font-sans text-xs md:text-sm tracking-[0.3em] text-slate-400 uppercase"
      >
        We&apos;re ready when you are
      </motion.p>
    </div>
  );
}
