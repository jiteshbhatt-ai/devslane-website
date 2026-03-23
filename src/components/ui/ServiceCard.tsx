"use client";

import { Users, Rocket, Brain, Code2, Link2, Smartphone, Palette, Server } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  "Team Augmentation": Users,
  "MVP Development": Rocket,
  "AI Development": Brain,
  "Full-Stack Development": Code2,
  "Blockchain Development": Link2,
  "App Development": Smartphone,
  "UI/UX": Palette,
  "DevOps": Server,
};

export interface ServiceData {
  title: string;
  description: string;
  tags: string[];
  side: "left" | "right";
}

interface ServiceCardProps {
  service: ServiceData;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const Icon = iconMap[service.title] || Code2;
  const isRight = service.side === "right";

  return (
    <div className="glass-card rounded-2xl p-6 md:p-7 w-[340px] md:w-[420px] transition-all duration-300 group">
      <div className={`flex gap-5 ${isRight ? "flex-row-reverse" : "flex-row"}`}>
        {/* Icon area */}
        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-devslane-purple/30 to-neon-purple/10 flex items-center justify-center border border-slate-200/50">
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-devslane-purple/80" strokeWidth={1.2} />
        </div>

        {/* Content */}
        <div className={`flex-1 min-w-0 ${isRight ? "text-right" : "text-left"}`}>
          <h3 className="font-serif text-lg md:text-xl text-slate-800 mb-1.5">
            {service.title}
          </h3>
          <p className="font-sans text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className={`flex flex-wrap gap-2 mt-4 ${isRight ? "justify-end" : "justify-start"}`}>
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-[10px] md:text-xs tracking-wider font-sans text-slate-500 bg-white/40 border border-slate-200/50"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
