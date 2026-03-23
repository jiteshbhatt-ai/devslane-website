"use client";

import { MotionValue } from "framer-motion";
import { Users, Rocket, Brain, Code2, Link2, Smartphone, Palette, Server } from "lucide-react";
import { Stack } from "@/components/bits/Stack";
import { useEffect, useRef } from "react";

interface ServiceItem {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  accent: string;
}

const services: ServiceItem[] = [
  { title: "Team Augmentation", description: "Add experienced, vetted engineers to your team with transparent accountability.", tags: ["Cultural fit", "Top 1%", "Instant hire"], icon: "Users", accent: "rgba(168,85,247,0.5)" },
  { title: "MVP Development", description: "Bring Your Vision to Life: Launch Fast, Iterate Smarter.", tags: ["MVP", "Rapid Prototyping", "Agile"], icon: "Rocket", accent: "rgba(96,165,250,0.5)" },
  { title: "AI Development", description: "Leverage AI to stay ahead of the competition.", tags: ["RAG", "LangChain", "AutoGPT"], icon: "Brain", accent: "rgba(192,132,252,0.5)" },
  { title: "Full-Stack Development", description: "A complete team ensuring alignment, ownership, and results.", tags: ["Node.js", "React", "Python", "AWS"], icon: "Code2", accent: "rgba(74,222,128,0.5)" },
  { title: "Blockchain", description: "Custom Blockchain Solutions: Secure, Scalable, Innovative.", tags: ["Smart Contracts", "Web3", "NFT"], icon: "Link2", accent: "rgba(250,204,21,0.5)" },
  { title: "App Development", description: "From concept to app store — intuitive design with robust functionality.", tags: ["React Native", "Flutter", "Mobile"], icon: "Smartphone", accent: "rgba(244,114,182,0.5)" },
  { title: "UI/UX Design", description: "Stunning Experiences: Intuitive, User-Centric Designs.", tags: ["Wireframing", "Figma", "XD"], icon: "Palette", accent: "rgba(251,146,60,0.5)" },
  { title: "DevOps", description: "Streamline Your Pipeline: Agile, Automated, Reliable.", tags: ["Kubernetes", "Docker", "AWS"], icon: "Server", accent: "rgba(56,189,248,0.5)" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const icons: Record<string, any> = { Users, Rocket, Brain, Code2, Link2, Smartphone, Palette, Server };

interface HorizontalShowcaseProps {
  progress: MotionValue<number>;
}

export const HorizontalShowcase = ({ progress }: HorizontalShowcaseProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if (!ref.current) return;
      const fadeIn = Math.max(0, Math.min(1, (p - 0.06) / 0.06));
      const fadeOut = Math.max(0, Math.min(1, (p - 0.90) / 0.06));
      ref.current.style.opacity = String(Math.max(0, fadeIn - fadeOut));
    });
    return unsub;
  }, [progress]);

  return (
    <div ref={ref} className="absolute inset-0 z-[20] flex items-center justify-center" style={{ opacity: 0 }}>
      <div style={{ width: "min(380px, 85vw)", height: 340 }}>
        <Stack
          randomRotation={true}
          sensitivity={180}
          sendToBackOnClick={true}
          autoplay={true}
          autoplayDelay={3500}
          pauseOnHover={true}
          cards={services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <div
                key={service.title}
                className="w-full h-full rounded-2xl p-6 md:p-8 border border-slate-600/30 overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(30,41,59,0.92), rgba(51,65,85,0.88))", backdropFilter: "blur(16px)" }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: service.accent.replace("0.5", "0.12") }}>
                  {Icon && <Icon className="w-7 h-7 text-white/80" strokeWidth={1.3} />}
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-white mb-2">{service.title}</h3>
                <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed mb-5">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-[10px] md:text-xs tracking-wider font-sans text-slate-300 bg-slate-700/40 border border-slate-500/30">{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        />
      </div>
    </div>
  );
};
