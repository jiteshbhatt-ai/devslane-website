"use client";

import { useEffect, useRef } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { useWheelProgress } from "@/hooks/useWheelProgress";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface ClientItem { name: string; tagline: string; industry: string; accent: string; }

const clients: ClientItem[] = [
  { name: "Breva", tagline: "Small Business Funding & Real-Time Credit Solutions", industry: "FinTech", accent: "#9333EA" },
  { name: "Get Domis", tagline: "Your Home's Instruction Manual", industry: "PropTech", accent: "#A855F7" },
  { name: "Buzz HPC", tagline: "Sovereign AI Advanced Compute Cloud", industry: "Infrastructure", accent: "#7C3AED" },
  { name: "AQai", tagline: "Transforming How People Adapt to Change", industry: "AI / HR", accent: "#8B5CF6" },
  { name: "Matrix Rental", tagline: "Tenant Analysis in the $500B Rental Market", industry: "PropTech", accent: "#C084FC" },
  { name: "Feather", tagline: "Next-Gen Vacation Rental Management", industry: "SaaS", accent: "#A78BFA" },
  { name: "Bodhi", tagline: "Astrological Counseling to 1M+ Users", industry: "Consumer", accent: "#D946EF" },
  { name: "Relevvo", tagline: "Hyper-Relevant AI Campaigns for Marketing", industry: "AI", accent: "#7C3AED" },
  { name: "EkStep", tagline: "People-Centric Transformation for Education", industry: "EdTech", accent: "#A855F7" },
  { name: "HIVE", tagline: "AI Solutions & Bitcoin Mining", industry: "Infrastructure", accent: "#6D28D9" },
  { name: "Aampe", tagline: "$18M to Scale Personalisation With Agentic AI", industry: "AI", accent: "#8B5CF6" },
  { name: "Orby", tagline: "$30M for First Large Action Model", industry: "AI", accent: "#9333EA" },
  { name: "Rove", tagline: "Future of Public EV Fast Charging", industry: "CleanTech", accent: "#A855F7" },
  { name: "Pulse Labs", tagline: "$2.5M Seed for Voice App Innovation", industry: "AI / Voice", accent: "#7C3AED" },
  { name: "Altre", tagline: "India's First Tech-Enabled B2B Brokerage", industry: "PropTech", accent: "#C084FC" },
  { name: "Citibot", tagline: "Multilanguage AI Government Chatbots", industry: "GovTech", accent: "#D946EF" },
  { name: "Gen City Labs", tagline: "Brand Storytellers & Experience Builders", industry: "Creative", accent: "#A78BFA" },
  { name: "INTEGRTR", tagline: "Enterprise Digital Transformation", industry: "Enterprise", accent: "#8B5CF6" },
  { name: "Zemetric", tagline: "Powering Transport Electrification", industry: "CleanTech", accent: "#9333EA" },
  { name: "Goodwill", tagline: "Write A Will & Plan Your Estate Online", industry: "LegalTech", accent: "#7C3AED" },
  { name: "Interfold", tagline: "AI-Enabled Commercial Lending", industry: "FinTech", accent: "#6D28D9" },
  { name: "ColigoMed", tagline: "AI to Improve Patient Health", industry: "HealthTech", accent: "#A855F7" },
  { name: "PrimeVault", tagline: "#1 Blockchain Operations & Security", industry: "Blockchain", accent: "#8B5CF6" },
  { name: "ExitSmarts", tagline: "Trusted Exit Planning Platform", industry: "FinTech", accent: "#C084FC" },
  { name: "DOME", tagline: "Best Policy Events Platform", industry: "GovTech", accent: "#7C3AED" },
  { name: "Healum", tagline: "AI for Personalised Patient Care", industry: "HealthTech", accent: "#D946EF" },
  { name: "Hotspring", tagline: "Discover VFX Talent, Deliver Results", industry: "Creative", accent: "#A78BFA" },
  { name: "Surfside Foods", tagline: "Sustainable Clam Harvesting at Scale", industry: "FoodTech", accent: "#9333EA" },
  { name: "VNClagoon", tagline: "Secure Communication & Collaboration", industry: "Enterprise", accent: "#A855F7" },
  { name: "SafeTravels", tagline: "Mobile Tour Operator App", industry: "Travel", accent: "#8B5CF6" },
  { name: "Path Light Pro", tagline: "QA & Environmental Solutions", industry: "Consulting", accent: "#7C3AED" },
];

export default function ClientsPage() {
  const progress = useWheelProgress(true, 0.00006, 0.07);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const totalCards = clients.length;

  useEffect(() => {
    const update = (p: number) => {
      if (heroRef.current) {
        heroRef.current.style.opacity = String(Math.max(0, 1 - p / 0.06));
        heroRef.current.style.transform = `translateY(${-p * 400}px)`;
      }
      if (hintRef.current) hintRef.current.style.opacity = p < 0.02 ? "1" : "0";

      // Cards: 0.06–0.82
      const cardZone = Math.max(0, Math.min(1, (p - 0.06) / 0.76));
      const raw = cardZone * totalCards;
      const activeIdx = Math.min(totalCards - 1, Math.floor(raw));

      if (counterRef.current) {
        counterRef.current.textContent = `${String(activeIdx + 1).padStart(2, "0")} / ${String(totalCards).padStart(2, "0")}`;
        counterRef.current.style.opacity = cardZone > 0.01 && cardZone < 0.99 ? "1" : "0";
      }

      // Slide-up stack
      clients.forEach((_, i) => {
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

      // CTA: 0.88–0.95
      if (ctaRef.current) {
        const ctaOp = Math.max(0, Math.min(1, (p - 0.88) / 0.07));
        ctaRef.current.style.opacity = String(ctaOp);
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
          <p className="font-sans text-xs tracking-[.3em] text-devslane-purple/60 uppercase mb-4">Portfolio</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-slate-800 tracking-[.04em]">
            Our <span className="text-devslane-purple">Clients</span>
          </h1>
        </div>

        {/* Card stack */}
        <div className="absolute inset-0 flex items-center justify-center z-[20]">
          {clients.map((c, i) => (
            <div
              key={c.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="absolute rounded-2xl overflow-hidden border border-slate-200"
              style={{
                width: "min(680px, 82vw)",
                minHeight: "260px",
                opacity: 0,
                transform: "translateY(50px) scale(0.95)",
                background: "linear-gradient(145deg, rgba(255,255,255,0.85), rgba(245,248,255,0.88))",
                backdropFilter: "blur(12px)",
                willChange: "transform, opacity",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }} />

              <div className="relative z-10 p-7 md:p-10 h-full flex flex-col justify-center">
                <span className="inline-block px-3 py-1 rounded-full text-[9px] font-sans tracking-[.2em] uppercase border mb-4 w-fit" style={{ borderColor: `${c.accent}30`, color: c.accent }}>
                  {c.industry}
                </span>
                <h3 className="font-serif text-2xl md:text-4xl text-slate-800 tracking-[.03em] mb-2">{c.name}</h3>
                <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-lg">{c.tagline}</p>
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
            <h2 className="font-serif text-3xl md:text-5xl text-slate-800 mb-4">Be Our Next Success Story</h2>
            <Link href="/contact" className="inline-block mt-4 px-10 py-4 rounded-full border border-devslane-purple/30 bg-devslane-purple/15 font-sans text-xs tracking-[.2em] text-devslane-purple uppercase hover:bg-devslane-purple/25 hover:shadow-[0_0_30px_rgba(192,132,252,.2)] transition-all duration-300">
              Start Your Project
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[25] flex flex-col items-center gap-2 pointer-events-none">
          <span className="font-sans text-[9px] tracking-[.3em] text-slate-400 uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-slate-300 animate-bounce" />
        </div>
      </div>
    </main>
  );
}
