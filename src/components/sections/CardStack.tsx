"use client";

import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";
import { ServiceCard, ServiceData } from "@/components/ui/ServiceCard";
import { Stack } from "@/components/bits/Stack";

const services: ServiceData[] = [
  { title: "Team Augmentation", description: "Add experienced, vetted engineers to your team.", tags: ["Cultural fit", "Top 1%", "Instant hire"], side: "left" },
  { title: "MVP Development", description: "Launch Fast, Iterate Smarter.", tags: ["MVP", "Rapid Prototyping", "Agile"], side: "right" },
  { title: "AI Development", description: "Leverage AI to stay ahead.", tags: ["RAG", "LangChain", "AutoGPT"], side: "left" },
  { title: "Full-Stack Development", description: "Complete team with alignment and results.", tags: ["Node.js", "React", "Python", "AWS"], side: "right" },
  { title: "Blockchain Development", description: "Custom Blockchain Solutions.", tags: ["Smart Contracts", "Web3", "NFT"], side: "left" },
  { title: "App Development", description: "From concept to app store.", tags: ["React Native", "Flutter", "Mobile"], side: "right" },
  { title: "UI/UX", description: "Stunning, User-Centric Designs.", tags: ["Wireframing", "Figma", "XD"], side: "left" },
  { title: "DevOps", description: "Agile, Automated, Reliable.", tags: ["Kubernetes", "Docker", "AWS"], side: "right" },
];

interface CardStackProps {
  progress: MotionValue<number>;
}

export const CardStack = ({ progress }: CardStackProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if (!ref.current) return;
      const fadeIn = Math.max(0, Math.min(1, (p - 0.06) / 0.06));
      const fadeOut = Math.max(0, Math.min(1, (p - 0.88) / 0.06));
      ref.current.style.opacity = String(Math.max(0, fadeIn - fadeOut));
    });
    return unsub;
  }, [progress]);

  return (
    <div ref={ref} className="absolute inset-0 z-[20] flex items-center justify-center" style={{ opacity: 0 }}>
      <div style={{ width: "min(420px, 85vw)", height: 320 }}>
        <Stack
          randomRotation={true}
          sensitivity={200}
          sendToBackOnClick={true}
          autoplay={true}
          autoplayDelay={4000}
          pauseOnHover={true}
          cards={services.map((service) => (
            <div key={service.title} className="w-full h-full">
              <ServiceCard service={service} />
            </div>
          ))}
        />
      </div>
    </div>
  );
};
