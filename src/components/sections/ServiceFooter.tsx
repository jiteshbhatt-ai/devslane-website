"use client";

import { useEffect, useState } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { Code2, Brain, Rocket, Zap } from "lucide-react";
import { Stack } from "@/components/bits/Stack";

interface ServiceFooterProps {
  progress: MotionValue<number>;
  onStartProject: () => void;
}

const services = [
  { icon: Code2, title: "Web Development", description: "Modern full-stack applications with Next.js, React, and scalable backends." },
  { icon: Brain, title: "AI Solutions", description: "Intelligent automation, NLP, and ML integrations for your business." },
  { icon: Rocket, title: "SaaS Products", description: "End-to-end SaaS from MVP to scale. Multi-tenant, built for growth." },
  { icon: Zap, title: "Automation", description: "Streamline workflows with custom tooling and process automation." },
];

export const ServiceFooter = ({ progress, onStartProject }: ServiceFooterProps) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const containerOpacity = useTransform(progress, [0.83, 0.89], [0, 1]);
  const headingY = useTransform(progress, [0.86, 0.91], [60, 0]);
  const headingOpacity = useTransform(progress, [0.86, 0.91], [0, 1]);
  const ctaOpacity = useTransform(progress, [0.95, 0.98], [0, 1]);
  const ctaY = useTransform(progress, [0.95, 0.98], [30, 0]);
  const glowWidth = useTransform(progress, [0.86, 0.93], ["0%", "100%"]);

  useEffect(() => {
    if (!containerRef) return;
    const unsub = containerOpacity.on("change", (v) => {
      containerRef.style.opacity = String(v);
      containerRef.style.pointerEvents = v > 0.1 ? "auto" : "none";
    });
    return unsub;
  }, [containerRef, containerOpacity]);


  return (
    <div
      ref={setContainerRef}
      className="absolute inset-0 z-[40]"
      style={{ opacity: 0, pointerEvents: "none" }}
    >
      <div className="absolute inset-0 bg-[#0a0b14]/95 backdrop-blur-sm" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(168, 85, 247, 0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-12">
        {/* Heading */}
        <motion.div style={{ y: headingY, opacity: headingOpacity }} className="text-center mb-12">
          <p className="font-sans text-xs md:text-sm tracking-[0.4em] text-devslane-purple/80 uppercase mb-4">What We Build</p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-[0.08em] text-white">Solutions That Scale</h2>
          <div className="flex justify-center mt-6">
            <motion.div style={{ width: glowWidth }} className="h-[1px] max-w-[200px] bg-gradient-to-r from-transparent via-devslane-glow to-transparent" />
          </div>
        </motion.div>

        {/* Service cards — Stack */}
        <div className="relative w-full max-w-md h-[280px] mb-14">
          <Stack
            randomRotation={true}
            sensitivity={160}
            sendToBackOnClick={true}
            autoplay={true}
            autoplayDelay={3500}
            pauseOnHover={true}
            cards={services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="w-full h-full rounded-2xl p-6 md:p-7 text-center border border-slate-600/30" style={{ background: "linear-gradient(145deg, rgba(30,41,59,0.92), rgba(51,65,85,0.88))" }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-devslane-purple/20 mb-5">
                    <Icon className="w-6 h-6 text-devslane-glow" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg md:text-xl text-white mb-2">{service.title}</h3>
                  <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          />
        </div>

        {/* CTA */}
        <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="text-center">
          <h3 className="font-serif text-2xl md:text-4xl tracking-[0.06em] text-white mb-3">Start Your Project</h3>
          <p className="font-sans text-slate-500 text-xs md:text-sm tracking-[0.15em] uppercase mb-7">We break complexity into clarity</p>
          <button
            onClick={onStartProject}
            className="group relative overflow-hidden border border-devslane-purple/40 text-devslane-purple px-9 py-3.5 rounded-full font-sans text-xs md:text-sm tracking-[0.25em] uppercase transition-all duration-300 hover:border-devslane-purple hover:shadow-[0_0_30px_rgba(192,132,252,0.25)]"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Get In Touch</span>
            <span className="absolute inset-0 bg-gradient-to-r from-devslane-purple to-neon-purple scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
          </button>
        </motion.div>

        {/* Footer bar */}
        <motion.div style={{ opacity: ctaOpacity }} className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-8 md:px-12">
          <span className="font-serif text-xs tracking-[0.2em] text-slate-300 uppercase">Devslane</span>
          <p className="font-sans text-[10px] text-slate-300 tracking-widest uppercase">&copy; {new Date().getFullYear()} All rights reserved</p>
        </motion.div>
      </div>
    </div>
  );
};
