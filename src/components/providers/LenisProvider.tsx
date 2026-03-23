"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import Lenis from "@studio-freight/lenis";

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export const useLenisInstance = () => useContext(LenisContext);

function LenisController({ stopped }: { stopped: boolean }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (stopped) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, stopped]);

  return null;
}

export function LenisProvider({
  children,
  stopped = false,
}: {
  children: ReactNode;
  stopped?: boolean;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.4,
        smoothWheel: true,
      }}
    >
      <LenisController stopped={stopped} />
      <LenisContext.Provider value={{ lenis: lenisRef.current }}>
        {children}
      </LenisContext.Provider>
    </ReactLenis>
  );
}
