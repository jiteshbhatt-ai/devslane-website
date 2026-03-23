"use client";

import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";
import { ServiceCard, ServiceData } from "@/components/ui/ServiceCard";

const services: ServiceData[] = [
  { title: "Team Augmentation", description: "Add experienced, vetted engineers to your team with transparent accountability and expertise tailored to your goals.", tags: ["Cultural fit", "Top 1%", "Instant hire"], side: "left" },
  { title: "MVP Development", description: "Bring Your Vision to Life with MVP Development: Launch Fast, Iterate Smarter.", tags: ["MVP", "Rapid Prototyping", "Agile Development"], side: "right" },
  { title: "AI Development", description: "Leverage the power of artificial intelligence to stay ahead of the competition.", tags: ["RAG", "LangChain", "LlamaIndex", "AutoGPT"], side: "left" },
  { title: "Full-Stack Development", description: "Work with a complete team led by a dedicated tech lead ensuring alignment, ownership, and results.", tags: ["Node.js", "React", "Python", "AWS"], side: "right" },
  { title: "Blockchain Development", description: "Unlock the Future with Custom Blockchain Solutions: Secure, Scalable, and Innovative.", tags: ["Smart Contracts", "Web3", "NFT Development"], side: "left" },
  { title: "App Development", description: "From concept to app store, we create mobile applications that combine intuitive design with robust functionality.", tags: ["React Native", "Flutter", "Desktop", "Mobile"], side: "right" },
  { title: "UI/UX", description: "Transform Ideas into Stunning Experiences: Intuitive, User-Centric, and Visually Engaging UI/UX Designs.", tags: ["Wireframing", "Figma", "XD"], side: "left" },
  { title: "DevOps", description: "Streamline Your Development Pipeline: Agile, Automated, and Reliable DevOps Solutions.", tags: ["Kubernetes", "Docker", "AWS", "IaC"], side: "right" },
];

interface CardStackProps {
  progress: MotionValue<number>;
}

export const CardStack = ({ progress }: CardStackProps) => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const totalCards = services.length;

  useEffect(() => {
    const update = (p: number) => {
      const cardZone = Math.max(0, Math.min(1, (p - 0.08) / 0.82));
      const raw = cardZone * totalCards;

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
    };

    const unsub = progress.on("change", update);
    return unsub;
  }, [progress, totalCards]);

  return (
    <div className="absolute inset-0 z-[20]">
      <div className="absolute inset-0 flex items-center justify-center">
        {services.map((service, i) => (
          <div
            key={service.title}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="absolute"
            style={{ opacity: 0, transform: "translateY(50px) scale(0.95)", willChange: "transform, opacity" }}
          >
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
};
