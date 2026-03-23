"use client";

import { Navbar } from "@/components/ui/Navbar";
import { useWheelProgress } from "@/hooks/useWheelProgress";
import { Stack } from "@/components/bits/Stack";
import { GradientText } from "@/components/bits/GradientText";
import { DecryptedText } from "@/components/bits/DecryptedText";
import Link from "next/link";

interface ClientItem {
  name: string;
  tagline: string;
  industry: string;
  accent: string;
}

const clients: ClientItem[] = [
  {
    name: "Breva",
    tagline: "Small Business Funding & Real-Time Credit Solutions",
    industry: "FinTech",
    accent: "#9333EA",
  },
  {
    name: "Get Domis",
    tagline: "Your Home's Instruction Manual",
    industry: "PropTech",
    accent: "#A855F7",
  },
  {
    name: "Buzz HPC",
    tagline: "Sovereign AI Advanced Compute Cloud",
    industry: "Infrastructure",
    accent: "#7C3AED",
  },
  {
    name: "AQai",
    tagline: "Transforming How People Adapt to Change",
    industry: "AI / HR",
    accent: "#8B5CF6",
  },
  {
    name: "Matrix Rental",
    tagline: "Tenant Analysis in the $500B Rental Market",
    industry: "PropTech",
    accent: "#C084FC",
  },
  {
    name: "Feather",
    tagline: "Next-Gen Vacation Rental Management",
    industry: "SaaS",
    accent: "#A78BFA",
  },
  {
    name: "Bodhi",
    tagline: "Astrological Counseling to 1M+ Users",
    industry: "Consumer",
    accent: "#D946EF",
  },
  {
    name: "Relevvo",
    tagline: "Hyper-Relevant AI Campaigns for Marketing",
    industry: "AI",
    accent: "#7C3AED",
  },
  {
    name: "EkStep",
    tagline: "People-Centric Transformation for Education",
    industry: "EdTech",
    accent: "#A855F7",
  },
  {
    name: "HIVE",
    tagline: "AI Solutions & Bitcoin Mining",
    industry: "Infrastructure",
    accent: "#6D28D9",
  },
  {
    name: "Aampe",
    tagline: "$18M to Scale Personalisation With Agentic AI",
    industry: "AI",
    accent: "#8B5CF6",
  },
  {
    name: "Orby",
    tagline: "$30M for First Large Action Model",
    industry: "AI",
    accent: "#9333EA",
  },
  {
    name: "Rove",
    tagline: "Future of Public EV Fast Charging",
    industry: "CleanTech",
    accent: "#A855F7",
  },
  {
    name: "Pulse Labs",
    tagline: "$2.5M Seed for Voice App Innovation",
    industry: "AI / Voice",
    accent: "#7C3AED",
  },
  {
    name: "Altre",
    tagline: "India's First Tech-Enabled B2B Brokerage",
    industry: "PropTech",
    accent: "#C084FC",
  },
  {
    name: "Citibot",
    tagline: "Multilanguage AI Government Chatbots",
    industry: "GovTech",
    accent: "#D946EF",
  },
  {
    name: "Gen City Labs",
    tagline: "Brand Storytellers & Experience Builders",
    industry: "Creative",
    accent: "#A78BFA",
  },
  {
    name: "INTEGRTR",
    tagline: "Enterprise Digital Transformation",
    industry: "Enterprise",
    accent: "#8B5CF6",
  },
  {
    name: "Zemetric",
    tagline: "Powering Transport Electrification",
    industry: "CleanTech",
    accent: "#9333EA",
  },
  {
    name: "Goodwill",
    tagline: "Write A Will & Plan Your Estate Online",
    industry: "LegalTech",
    accent: "#7C3AED",
  },
  {
    name: "Interfold",
    tagline: "AI-Enabled Commercial Lending",
    industry: "FinTech",
    accent: "#6D28D9",
  },
  {
    name: "ColigoMed",
    tagline: "AI to Improve Patient Health",
    industry: "HealthTech",
    accent: "#A855F7",
  },
  {
    name: "PrimeVault",
    tagline: "#1 Blockchain Operations & Security",
    industry: "Blockchain",
    accent: "#8B5CF6",
  },
  {
    name: "ExitSmarts",
    tagline: "Trusted Exit Planning Platform",
    industry: "FinTech",
    accent: "#C084FC",
  },
  {
    name: "DOME",
    tagline: "Best Policy Events Platform",
    industry: "GovTech",
    accent: "#7C3AED",
  },
  {
    name: "Healum",
    tagline: "AI for Personalised Patient Care",
    industry: "HealthTech",
    accent: "#D946EF",
  },
  {
    name: "Hotspring",
    tagline: "Discover VFX Talent, Deliver Results",
    industry: "Creative",
    accent: "#A78BFA",
  },
  {
    name: "Surfside Foods",
    tagline: "Sustainable Clam Harvesting at Scale",
    industry: "FoodTech",
    accent: "#9333EA",
  },
  {
    name: "VNClagoon",
    tagline: "Secure Communication & Collaboration",
    industry: "Enterprise",
    accent: "#A855F7",
  },
  {
    name: "SafeTravels",
    tagline: "Mobile Tour Operator App",
    industry: "Travel",
    accent: "#8B5CF6",
  },
  {
    name: "Path Light Pro",
    tagline: "QA & Environmental Solutions",
    industry: "Consulting",
    accent: "#7C3AED",
  },
];

export default function ClientsPage() {
  const progress = useWheelProgress(false);

  return (
    <main
      className="relative min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #1e4d8c 0%, #3873C7 30%, #73B8F2 70%, #ADD9F8 100%)",
      }}
    >
      <Navbar isVisible={true} progress={progress} />

      <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="font-sans text-xs tracking-[.3em] text-devslane-glow/60 uppercase mb-4">
            <DecryptedText
              text="Portfolio"
              animateOn="view"
              speed={40}
              sequential
              revealDirection="start"
            />
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white tracking-[.04em]">
            Our <GradientText>Clients</GradientText>
          </h1>
          <p className="font-sans text-sm text-white/40 mt-4">
            Click or drag to browse {clients.length}+ clients
          </p>
        </div>

        {/* Stack of client cards */}
        <div style={{ width: "min(640px, 82vw)", height: 300 }}>
          <Stack
            randomRotation={true}
            sensitivity={160}
            sendToBackOnClick={true}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            cards={clients.map((c) => (
              <div
                key={c.name}
                className="w-full h-full rounded-2xl border border-slate-600/30 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(30,41,59,0.92), rgba(51,65,85,0.88))",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`,
                  }}
                />

                <div className="relative z-10 p-7 md:p-10 h-full flex flex-col justify-center">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[9px] font-sans tracking-[.2em] uppercase border mb-4 w-fit"
                    style={{ borderColor: `${c.accent}30`, color: c.accent }}
                  >
                    {c.industry}
                  </span>
                  <h3 className="font-serif text-2xl md:text-4xl text-white tracking-[.03em] mb-2">
                    {c.name}
                  </h3>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed max-w-lg">
                    {c.tagline}
                  </p>
                </div>
              </div>
            ))}
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <h2 className="font-serif text-2xl md:text-4xl text-white mb-4">
            Be Our Next Success Story
          </h2>
          <Link
            href="/contact"
            className="inline-block mt-2 px-10 py-4 rounded-full border border-devslane-purple/30 bg-devslane-purple/15 font-sans text-xs tracking-[.2em] text-devslane-purple uppercase hover:bg-devslane-purple/25 hover:shadow-[0_0_30px_rgba(192,132,252,.2)] transition-all duration-300"
          >
            Start Your Project
          </Link>
        </div>
      </div>
    </main>
  );
}
