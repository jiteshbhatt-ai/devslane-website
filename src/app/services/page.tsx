"use client";

import { useEffect, useRef } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { useWheelProgress } from "@/hooks/useWheelProgress";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const services = [
  { num: "01", title: "Web Development", desc: "Full-stack applications with React, Next.js, Node.js and scalable backends.", tags: ["React", "Next.js", "Node.js", "TypeScript"], accent: "#9333EA" },
  { num: "02", title: "App Development", desc: "Cross-platform mobile apps combining intuitive design with robust functionality.", tags: ["React Native", "Flutter", "iOS", "Android"], accent: "#A855F7" },
  { num: "03", title: "AI Integration", desc: "Custom AI models, LLM integrations, and intelligent automation for your business.", tags: ["RAG", "LangChain", "GPT", "ML"], accent: "#C084FC" },
  { num: "04", title: "Cloud & Backend", desc: "Scalable infrastructure, DevOps pipelines, and cloud-native architectures.", tags: ["AWS", "Docker", "K8s", "Terraform"], accent: "#7C3AED" },
  { num: "05", title: "UI/UX Design", desc: "User-centric interfaces that are intuitive, beautiful, and conversion-optimized.", tags: ["Figma", "Design Systems", "Research"], accent: "#8B5CF6" },
  { num: "06", title: "SaaS Products", desc: "End-to-end SaaS from MVP to scale. Multi-tenant, built for growth.", tags: ["MVP", "Multi-tenant", "Scale"], accent: "#6D28D9" },
];

export default function ServicesPage() {
  const progress = useWheelProgress(true, 0.00012, 0.08);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const totalCards = services.length;

  useEffect(() => {
    const update = (p: number) => {
      if (heroRef.current) {
        const heroOp = Math.max(0, 1 - p / 0.08);
        heroRef.current.style.opacity = String(heroOp);
        heroRef.current.style.transform = `translateY(${-p * 300}px) scale(${Math.max(0.8, 1 - p * 0.3)})`;
      }

      if (hintRef.current) hintRef.current.style.opacity = p < 0.03 ? "1" : "0";

      // Cards: 0.08–0.82
      const cardZone = Math.max(0, Math.min(1, (p - 0.08) / 0.74));
      const raw = cardZone * totalCards;
      const activeIdx = Math.min(totalCards - 1, Math.floor(raw));

      if (counterRef.current) {
        counterRef.current.textContent = `${String(activeIdx + 1).padStart(2, "0")} / ${String(totalCards).padStart(2, "0")}`;
        counterRef.current.style.opacity = cardZone > 0.01 && cardZone < 0.99 ? "1" : "0";
      }

      // Slide-up stack animation
      services.forEach((_, i) => {
        const el = cardsRef.current[i];
        if (!el) return;
        const cp = raw - i;

        if (cp < 0) {
          el.style.opacity = "0";
          el.style.transform = "translateY(50px) scale(0.95)";
          el.style.zIndex = String(totalCards - i);
        } else if (cp < 1) {
          const t = Math.min(1, cp);
          const ease = 1 - Math.pow(1 - t, 4);
          const y = 50 * (1 - ease);
          const sc = 0.95 + 0.05 * ease;
          el.style.opacity = String(Math.min(1, ease * 2));
          el.style.transform = `translateY(${y}px) scale(${sc})`;
          el.style.zIndex = String(totalCards + i);
        } else {
          const exitT = Math.min(1, (cp - 1) * 2);
          const ease = exitT * exitT;
          el.style.opacity = String(Math.max(0, 1 - ease * 1.2));
          el.style.transform = `translateY(${-80 * ease}px) scale(${1 - ease * 0.05})`;
          el.style.zIndex = String(totalCards - Math.floor(cp));
        }
      });

      // CTA: 0.85–0.92
      if (ctaRef.current) {
        const ctaOp = Math.max(0, Math.min(1, (p - 0.85) / 0.07));
        ctaRef.current.style.opacity = String(ctaOp);
        ctaRef.current.style.transform = `translateY(${20 * (1 - ctaOp)}px)`;
        ctaRef.current.style.pointerEvents = ctaOp > 0.5 ? "auto" : "none";
      }
    };

    const unsub = progress.on("change", update);
    return unsub;
  }, [progress, totalCards]);

  return (
    <main className="relative h-screen overflow-hidden bg-transparent">
      <Navbar isVisible={true} progress={progress} />

      <div className="relative h-screen overflow-hidden">
        {/* Hero */}
        <div ref={heroRef} className="absolute inset-0 z-[30] flex flex-col items-center justify-center text-center pointer-events-none">
          <p className="font-sans text-xs tracking-[.3em] text-devslane-purple/60 uppercase mb-4">Our Services</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-slate-800 tracking-[.04em]">
            What We <span className="text-devslane-purple">Build</span>
          </h1>
        </div>

        {/* Card stack */}
        <div className="absolute inset-0 flex items-center justify-center z-[20]">
          {services.map((s, i) => (
            <div
              key={s.num}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="absolute rounded-2xl overflow-hidden border border-slate-200"
              style={{
                width: "min(780px, 85vw)",
                minHeight: "340px",
                opacity: 0,
                transform: "translateY(50px) scale(0.95)",
                background: "linear-gradient(145deg, rgba(255,255,255,0.85), rgba(245,248,255,0.90))",
                backdropFilter: "blur(16px)",
                willChange: "transform, opacity",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }} />
              <div className="absolute top-0 left-0 bottom-0 w-[2px]" style={{ background: `linear-gradient(180deg, ${s.accent}50, transparent)` }} />

              <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-sans text-[10px] tracking-[.3em] text-slate-300">{s.num}</span>
                    <div className="flex gap-2">
                      {s.tags.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full text-[9px] font-sans border border-slate-200 text-slate-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-serif text-3xl md:text-5xl text-slate-800 mb-4">{s.title}</h3>
                  <p className="font-sans text-sm text-slate-500 leading-relaxed max-w-lg">{s.desc}</p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.accent, boxShadow: `0 0 6px ${s.accent}60` }} />
                  <span className="font-sans text-[10px] text-slate-300 tracking-widest uppercase">
                    {i < totalCards - 1 ? `Next: ${services[i + 1].title}` : "All services"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Counter */}
        <div ref={counterRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 font-sans text-xs tracking-[.3em] text-slate-400 z-30 transition-opacity duration-300">
          01 / {String(totalCards).padStart(2, "0")}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="absolute inset-0 z-[35] flex items-center justify-center" style={{ opacity: 0, pointerEvents: "none" }}>
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-5xl text-slate-800 mb-4">Ready to Build?</h2>
            <Link href="/contact" className="inline-block mt-4 px-10 py-4 rounded-full border border-devslane-purple/30 bg-devslane-purple/15 font-sans text-xs tracking-[.2em] text-devslane-purple uppercase hover:bg-devslane-purple/25 hover:shadow-[0_0_30px_rgba(192,132,252,.2)] transition-all duration-300">
              Get In Touch
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[25] flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-500">
          <span className="font-sans text-[9px] tracking-[.3em] text-slate-400 uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-slate-300 animate-bounce" />
        </div>
      </div>
    </main>
  );
}
