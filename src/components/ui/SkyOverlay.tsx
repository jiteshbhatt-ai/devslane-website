"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SkyOverlayProps {
  flightProgress: number;
  isActive: boolean;
}

interface Client {
  name: string;
  tagline: string;
  metric?: string;
}

interface ClientGroup {
  start: number;
  end: number;
  label: string;
  accent: string;
  clients: Client[];
}

const clientGroups: ClientGroup[] = [
  {
    start: 0.05, end: 0.18, label: "FinTech & Business", accent: "rgba(96, 165, 250, 0.5)",
    clients: [
      { name: "Breva", tagline: "Small Business Funding & Real-Time Credit Solutions", metric: "50K+ SMBs" },
      { name: "Interfold", tagline: "AI-Enabled Commercial Lending", metric: "$2B+ Processed" },
      { name: "PrimeVault", tagline: "#1 Blockchain Operations & Security Platform", metric: "$240M+ Managed" },
      { name: "Goodwill", tagline: "Write A Will & Plan Your Estate Online", metric: "100K+ Wills" },
      { name: "Decimal", tagline: "Smart Shipping Options for eCommerce", metric: "1M+ Shipments" },
    ],
  },
  {
    start: 0.20, end: 0.33, label: "AI & Data", accent: "rgba(168, 85, 247, 0.5)",
    clients: [
      { name: "AQai", tagline: "Transforming How People Adapt to Change", metric: "500K+ Assessed" },
      { name: "Relevvo", tagline: "Hyper-Relevant AI Campaigns for Marketing & Sales", metric: "10x ROI" },
      { name: "Aampe", tagline: "$18M to Scale Personalisation With Agentic AI", metric: "$18M Raised" },
      { name: "Orby", tagline: "$30M for First Large Action Model", metric: "$30M Raised" },
      { name: "ColigoMed", tagline: "AI to Improve Patient Health", metric: "50K+ Patients" },
    ],
  },
  {
    start: 0.35, end: 0.48, label: "PropTech & Real Estate", accent: "rgba(74, 222, 128, 0.5)",
    clients: [
      { name: "Matrix Rental", tagline: "Tenant Analysis in the $500B Rental Market" },
      { name: "Feather", tagline: "Next-Gen Vacation Rental Management" },
      { name: "Get Domis", tagline: "Your Home's Instruction Manual" },
      { name: "Altre", tagline: "India's First Tech-Enabled B2B Brokerage" },
    ],
  },
  {
    start: 0.50, end: 0.63, label: "Infrastructure & Cloud", accent: "rgba(56, 189, 248, 0.5)",
    clients: [
      { name: "Buzz HPC", tagline: "Sovereign AI Advanced Compute Cloud" },
      { name: "HIVE", tagline: "AI Solutions & Bitcoin Mining" },
      { name: "Zemetric", tagline: "Powering Transport Electrification" },
      { name: "Rove", tagline: "Future of Public EV Fast Charging" },
      { name: "INTEGRTR", tagline: "Enterprise Digital Transformation" },
    ],
  },
  {
    start: 0.65, end: 0.78, label: "Apps & Consumer", accent: "rgba(244, 114, 182, 0.5)",
    clients: [
      { name: "Bodhi", tagline: "Astrological Counseling to 1M+ Users" },
      { name: "Citibot", tagline: "Multilanguage AI-Powered Chatbots" },
      { name: "SafeTravels", tagline: "Mobile Tour Operator App" },
      { name: "Pulse Labs", tagline: "$2.5M for Voice App Innovation" },
      { name: "VNClagoon", tagline: "Secure Communication & Collaboration" },
    ],
  },
  {
    start: 0.80, end: 0.93, label: "Platforms & Impact", accent: "rgba(250, 204, 21, 0.5)",
    clients: [
      { name: "EkStep", tagline: "People-Centric Education Transformation" },
      { name: "Gen City Labs", tagline: "Brand Storytellers & Experience Builders" },
      { name: "ExitSmarts", tagline: "Exit Planning Platform" },
      { name: "DOME", tagline: "Best Policy Events Platform" },
      { name: "Healum", tagline: "AI for Healthcare" },
      { name: "Hotspring", tagline: "Discover VFX Talent, Deliver Results" },
      { name: "Surfside Foods", tagline: "Sustainable Clam Harvesting at Scale" },
      { name: "Path Light Pro", tagline: "QA & Environmental Solutions" },
    ],
  },
];

export const SkyOverlay = ({ flightProgress, isActive }: SkyOverlayProps) => {
  if (!isActive) return null;

  const activeGroup = clientGroups.find(
    (g) => flightProgress >= g.start && flightProgress <= g.end
  );

  // Progress within the active group (0→1)
  const groupProgress = activeGroup
    ? (flightProgress - activeGroup.start) / (activeGroup.end - activeGroup.start)
    : 0;

  return (
    <div className="absolute inset-0 z-[50] pointer-events-none">
      <AnimatePresence mode="wait">
        {activeGroup && (
          <motion.div
            key={activeGroup.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-end justify-center pr-6 md:pr-14"
          >
            {/* Group label */}
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: activeGroup.accent }}
            >
              {activeGroup.label}
            </motion.p>

            {/* Client cards — staggered entrance */}
            <div className="flex flex-col gap-2.5 items-end max-w-sm">
              {activeGroup.clients.map((client, i) => {
                const cardDelay = 0.15 + i * 0.1;
                const isVisible = groupProgress > i / activeGroup.clients.length;

                return (
                  <motion.div
                    key={client.name}
                    initial={{ opacity: 0, x: 40, scale: 0.9 }}
                    animate={{
                      opacity: isVisible ? 1 : 0,
                      x: isVisible ? 0 : 40,
                      scale: isVisible ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.5, delay: cardDelay, ease: "easeOut" }}
                    className="rounded-xl px-5 py-3 bg-white/60 backdrop-blur-md border border-white/40 text-right"
                    style={{
                      borderColor: isVisible ? activeGroup.accent.replace("0.5", "0.3") : "rgba(255,255,255,0.4)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-serif text-sm md:text-base text-slate-800">
                        {client.name}
                      </span>
                      {client.metric && (
                        <span className="font-mono text-[9px] md:text-[10px] tracking-wider px-2 py-0.5 rounded-full bg-white/40 text-slate-500">
                          {client.metric}
                        </span>
                      )}
                    </div>
                    <span className="font-sans text-[10px] md:text-xs text-slate-400 leading-tight block mt-0.5">
                      {client.tagline}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Counter */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-[10px] tracking-[0.2em] text-slate-300 mt-4"
            >
              {clientGroups.indexOf(activeGroup) + 1} / {clientGroups.length}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
