"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

interface Ember {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "burning" | "entering">("idle");
  const [embers, setEmbers] = useState<Ember[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const burnLineRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);

  // Animate burn with requestAnimationFrame for smooth mask
  const animateBurn = useCallback(() => {
    const el = contentRef.current;
    const line = burnLineRef.current;
    if (!el) return;

    const duration = 700;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const ease = t * t; // easeIn — starts slow, accelerates

      const burnY = ease * 110;
      el.style.maskImage = `linear-gradient(to top, transparent ${burnY}%, black ${burnY + 8}%)`;
      el.style.webkitMaskImage = `linear-gradient(to top, transparent ${burnY}%, black ${burnY + 8}%)`;
      el.style.opacity = String(Math.max(0, 1 - t * 0.5));

      if (line) {
        line.style.bottom = `${burnY}%`;
        line.style.opacity =
          t < 0.1 ? String(t * 10) : t > 0.85 ? String((1 - t) * 6.6) : "1";
      }

      if (t < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  // Generate random embers
  const spawnEmbers = useCallback(() => {
    const newEmbers: Ember[] = [];
    for (let i = 0; i < 25; i++) {
      newEmbers.push({
        id: i,
        x: Math.random() * 100,
        y: 50 + Math.random() * 50,
        size: 3 + Math.random() * 8,
        delay: Math.random() * 0.3,
        duration: 0.6 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 80,
      });
    }
    setEmbers(newEmbers);
  }, []);

  // Navigate handler
  const handleNavigate = useCallback(
    (href: string) => {
      if (href === pathname || phase !== "idle") return;

      setPhase("burning");
      spawnEmbers();
      animateBurn();

      setTimeout(() => {
        router.push(href);
      }, 650);
    },
    [pathname, phase, router, spawnEmbers, animateBurn],
  );

  // When pathname changes, enter new page
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      setPhase("entering");

      // Reset content mask
      if (contentRef.current) {
        contentRef.current.style.maskImage = "none";
        contentRef.current.style.webkitMaskImage = "none";
        contentRef.current.style.opacity = "1";
      }

      const timer = setTimeout(() => {
        setPhase("idle");
        setEmbers([]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Expose navigate function globally
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__pageTransition =
      handleNavigate;
    return () => {
      delete (window as unknown as Record<string, unknown>).__pageTransition;
    };
  }, [handleNavigate]);

  return (
    <>
      {/* Page content */}
      <div
        ref={contentRef}
        className="relative z-[1]"
        style={{
          animation: phase === "entering" ? "fadeIn 0.4s ease-out" : undefined,
        }}
      >
        {children}
      </div>

      {/* Ember particles + burn line */}
      {phase === "burning" && (
        <div className="fixed inset-0 z-[99] pointer-events-none overflow-hidden">
          {embers.map((ember) => (
            <div
              key={ember.id}
              className="absolute rounded-full"
              style={
                {
                  left: `${ember.x}%`,
                  top: `${ember.y}%`,
                  width: ember.size,
                  height: ember.size,
                  background: `radial-gradient(circle, #ff6b35 0%, #ff4500 40%, #cc3700 70%, transparent 100%)`,
                  boxShadow: `0 0 ${ember.size * 2}px rgba(255, 107, 53, 0.6)`,
                  animation: `emberFloat ${ember.duration}s ease-out ${ember.delay}s forwards`,
                  "--ember-drift": `${ember.drift}px`,
                } as React.CSSProperties
              }
            />
          ))}

          {/* Burn glow line */}
          <div
            ref={burnLineRef}
            className="absolute left-0 right-0 h-[3px]"
            style={{
              bottom: "0%",
              opacity: 0,
              background:
                "linear-gradient(90deg, transparent 5%, rgba(255,107,53,0.6) 30%, rgba(255,200,50,0.8) 50%, rgba(255,107,53,0.6) 70%, transparent 95%)",
              boxShadow:
                "0 0 20px rgba(255,107,53,0.5), 0 0 40px rgba(255,69,0,0.3)",
              filter: "blur(1px)",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes emberFloat {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--ember-drift, 0), -300px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};
