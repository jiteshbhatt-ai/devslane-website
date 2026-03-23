"use client";

import { Navbar } from "@/components/ui/Navbar";
import { useWheelProgress } from "@/hooks/useWheelProgress";
import { Stack } from "@/components/bits/Stack";
import { GradientText } from "@/components/bits/GradientText";
import { DecryptedText } from "@/components/bits/DecryptedText";
import Link from "next/link";

const services = [
  {
    num: "01",
    title: "Web Development",
    desc: "Full-stack applications with React, Next.js, Node.js and scalable backends.",
    tags: ["React", "Next.js", "Node.js", "TypeScript"],
    accent: "#9333EA",
  },
  {
    num: "02",
    title: "App Development",
    desc: "Cross-platform mobile apps combining intuitive design with robust functionality.",
    tags: ["React Native", "Flutter", "iOS", "Android"],
    accent: "#A855F7",
  },
  {
    num: "03",
    title: "AI Integration",
    desc: "Custom AI models, LLM integrations, and intelligent automation for your business.",
    tags: ["RAG", "LangChain", "GPT", "ML"],
    accent: "#C084FC",
  },
  {
    num: "04",
    title: "Cloud & Backend",
    desc: "Scalable infrastructure, DevOps pipelines, and cloud-native architectures.",
    tags: ["AWS", "Docker", "K8s", "Terraform"],
    accent: "#7C3AED",
  },
  {
    num: "05",
    title: "UI/UX Design",
    desc: "User-centric interfaces that are intuitive, beautiful, and conversion-optimized.",
    tags: ["Figma", "Design Systems", "Research"],
    accent: "#8B5CF6",
  },
  {
    num: "06",
    title: "SaaS Products",
    desc: "End-to-end SaaS from MVP to scale. Multi-tenant, built for growth.",
    tags: ["MVP", "Multi-tenant", "Scale"],
    accent: "#6D28D9",
  },
];

export default function ServicesPage() {
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
              text="Our Services"
              animateOn="view"
              speed={40}
              sequential
              revealDirection="start"
            />
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white tracking-[.04em]">
            What We <GradientText>Build</GradientText>
          </h1>
          <p className="font-sans text-sm text-white/40 mt-4">
            Click or drag cards to explore
          </p>
        </div>

        {/* Stack of service cards */}
        <div style={{ width: "min(720px, 85vw)", height: 380 }}>
          <Stack
            randomRotation={true}
            sensitivity={180}
            sendToBackOnClick={true}
            autoplay={true}
            autoplayDelay={4000}
            pauseOnHover={true}
            cards={services.map((s) => (
              <div
                key={s.num}
                className="w-full h-full rounded-2xl border border-slate-600/30 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(30,41,59,0.92), rgba(51,65,85,0.88))",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`,
                  }}
                />
                <div
                  className="absolute top-0 left-0 bottom-0 w-[2px]"
                  style={{
                    background: `linear-gradient(180deg, ${s.accent}50, transparent)`,
                  }}
                />

                <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-sans text-[10px] tracking-[.3em] text-slate-300">
                        {s.num}
                      </span>
                      <div className="flex gap-2">
                        {s.tags.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 rounded-full text-[9px] font-sans border border-slate-500/30 text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="font-serif text-3xl md:text-5xl text-white mb-4">
                      {s.title}
                    </h3>
                    <p className="font-sans text-sm text-slate-300 leading-relaxed max-w-lg">
                      {s.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: s.accent,
                        boxShadow: `0 0 6px ${s.accent}60`,
                      }}
                    />
                    <span className="font-sans text-[10px] text-slate-400 tracking-widest uppercase">
                      Devslane
                    </span>
                  </div>
                </div>
              </div>
            ))}
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <h2 className="font-serif text-2xl md:text-4xl text-white mb-4">
            Ready to Build?
          </h2>
          <Link
            href="/contact"
            className="inline-block mt-2 px-10 py-4 rounded-full border border-devslane-purple/30 bg-devslane-purple/15 font-sans text-xs tracking-[.2em] text-devslane-purple uppercase hover:bg-devslane-purple/25 hover:shadow-[0_0_30px_rgba(192,132,252,.2)] transition-all duration-300"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </main>
  );
}
