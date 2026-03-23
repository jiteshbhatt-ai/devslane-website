"use client";

import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";
import { Users, Rocket, Brain, Code2, Link2, Smartphone, Palette, Server } from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  accent: string;
}

const services: ServiceItem[] = [
  { title: "Team Augmentation", description: "Add experienced, vetted engineers to your team with transparent accountability and expertise tailored to your goals.", tags: ["Cultural fit", "Top 1%", "Instant hire"], icon: "Users", accent: "rgba(168,85,247,0.5)" },
  { title: "MVP Development", description: "Bring Your Vision to Life with MVP Development: Launch Fast, Iterate Smarter.", tags: ["MVP", "Rapid Prototyping", "Agile"], icon: "Rocket", accent: "rgba(96,165,250,0.5)" },
  { title: "AI Development", description: "Leverage the power of artificial intelligence to stay ahead of the competition.", tags: ["RAG", "LangChain", "LlamaIndex", "AutoGPT"], icon: "Brain", accent: "rgba(192,132,252,0.5)" },
  { title: "Full-Stack Development", description: "A complete team led by a dedicated tech lead ensuring alignment, ownership, and results.", tags: ["Node.js", "React", "Python", "AWS"], icon: "Code2", accent: "rgba(74,222,128,0.5)" },
  { title: "Blockchain", description: "Unlock the Future with Custom Blockchain Solutions: Secure, Scalable, and Innovative.", tags: ["Smart Contracts", "Web3", "NFT"], icon: "Link2", accent: "rgba(250,204,21,0.5)" },
  { title: "App Development", description: "From concept to app store — intuitive design with robust functionality.", tags: ["React Native", "Flutter", "Mobile"], icon: "Smartphone", accent: "rgba(244,114,182,0.5)" },
  { title: "UI/UX Design", description: "Transform Ideas into Stunning Experiences: Intuitive, User-Centric Designs.", tags: ["Wireframing", "Figma", "XD"], icon: "Palette", accent: "rgba(251,146,60,0.5)" },
  { title: "DevOps", description: "Streamline Your Development Pipeline: Agile, Automated, and Reliable.", tags: ["Kubernetes", "Docker", "AWS", "IaC"], icon: "Server", accent: "rgba(56,189,248,0.5)" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const icons: Record<string, any> = { Users, Rocket, Brain, Code2, Link2, Smartphone, Palette, Server };

interface HorizontalShowcaseProps {
  progress: MotionValue<number>;
}

export const HorizontalShowcase = ({ progress }: HorizontalShowcaseProps) => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const totalCards = services.length;

  useEffect(() => {
    const update = (p: number) => {
      const showcaseP = Math.max(0, Math.min(1, (p - 0.08) / 0.84));
      const raw = showcaseP * totalCards;
      const activeIndex = Math.min(totalCards - 1, Math.floor(raw));

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

      if (counterRef.current) {
        counterRef.current.textContent = `${activeIndex + 1} / ${totalCards}`;
      }
    };

    const unsub = progress.on("change", update);
    return unsub;
  }, [progress, totalCards]);

  return (
    <div className="absolute inset-0 z-[20]">
      <div className="absolute inset-0 flex items-center justify-center">
        {services.map((service, i) => {
          const Icon = icons[service.icon];
          return (
            <div
              key={service.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="absolute w-[340px] md:w-[380px] rounded-2xl p-6 md:p-8 bg-white/60 backdrop-blur-xl border border-slate-200/60"
              style={{ opacity: 0, transform: "translateY(50px) scale(0.95)", willChange: "transform, opacity" }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: service.accent.replace("0.5", "0.12") }}>
                {Icon && <Icon className="w-7 h-7 text-slate-700" strokeWidth={1.3} />}
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-slate-800 mb-2">{service.title}</h3>
              <p className="font-sans text-xs md:text-sm text-slate-500 leading-relaxed mb-5">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-[10px] md:text-xs tracking-wider font-sans text-slate-500 bg-white/50 border border-slate-200/60">{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div ref={counterRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 font-sans text-xs tracking-[0.3em] text-slate-400 uppercase">
        1 / {totalCards}
      </div>
    </div>
  );
};
