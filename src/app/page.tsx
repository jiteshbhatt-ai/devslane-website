"use client";

import { useState, useCallback, useEffect } from "react";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useLazyImagePreloader } from "@/hooks/useLazyImagePreloader";
import { useWheelProgress } from "@/hooks/useWheelProgress";
import { CanvasScroller } from "@/components/sections/CanvasScroller";
import { SkyPlayer } from "@/components/sections/SkyPlayer";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { Preloader } from "@/components/ui/Preloader";
import { Navbar } from "@/components/ui/Navbar";
import { FrameCTA } from "@/components/ui/FrameCTA";
import { SkyOverlay } from "@/components/ui/SkyOverlay";
import { SkyTransition } from "@/components/ui/SkyTransition";
import { SkyEnding } from "@/components/ui/SkyEnding";
import { ContactForm } from "@/components/ui/ContactForm";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { ScrollText } from "@/components/ui/ScrollText";

// Flow 1: Explore intro — frames 42 through 1856 (1815 frames @ 30fps)
const FLOW1_COUNT = 1815;
const FLOW1_PATH = "/frames/frame_";
const FLOW1_START = 42;

// Flow 2: Sky flight — frames 69 through 3656 (3576 frames @ 60fps, some gaps)
const FLOW2_COUNT = 3576;
const FLOW2_PATH = "/sky-frames/frame_";
const FLOW2_START = 69;

const FRAME_PAD = 10;
const MIN_SKY_FRAMES_TO_START = 400;

type AppState =
  | "loading"
  | "hero"
  | "exploring"
  | "skyFlight"
  | "skyEnding"
  | "contact";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [flightProgress, setFlightProgress] = useState(0);
  const [skyReady, setSkyReady] = useState(false);

  // Flow 1: Load immediately
  const flow1 = useImagePreloader(
    FLOW1_COUNT,
    FLOW1_PATH,
    FRAME_PAD,
    80,
    FLOW1_START,
  );

  // Flow 2: Load lazily when sky flight is triggered
  const [startSkyLoad, setStartSkyLoad] = useState(false);
  const flow2 = useLazyImagePreloader(
    FLOW2_COUNT,
    FLOW2_PATH,
    FRAME_PAD,
    120,
    startSkyLoad,
    FLOW2_START,
  );

  // Wheel progress for Flow 1
  const exploreProgress = useWheelProgress(
    appState === "exploring",
    0.0004,
    0.08,
  );

  // Auto-transition: loading → hero
  useEffect(() => {
    if (flow1.isComplete && appState === "loading") {
      setAppState("hero");
    }
  }, [flow1.isComplete, appState]);

  const handleExplore = useCallback(() => setAppState("exploring"), []);

  const handleStartProject = useCallback(() => {
    setStartSkyLoad(true);
    setAppState("skyFlight");
  }, []);

  const handleSkyReady = useCallback(() => setSkyReady(true), []);

  // Flight complete → cinematic ending (NOT directly to contact)
  const handleFlightComplete = useCallback(() => setAppState("skyEnding"), []);

  // Ending complete → contact form
  const handleEndingComplete = useCallback(() => setAppState("contact"), []);

  const handleContactClose = useCallback(() => {
    setAppState("exploring");
    setSkyReady(false);
    setFlightProgress(0);
  }, []);

  const skyLoadProgress =
    FLOW2_COUNT > 0 ? (flow2.loadedCount / FLOW2_COUNT) * 100 : 0;
  const showSkyTransition = appState === "skyFlight" && !skyReady;
  const showSkyPlayer = appState === "skyFlight" && skyReady;

  return (
    <main className="relative h-screen overflow-hidden bg-transparent">
      {/* ============ PRELOADER ============ */}
      {appState === "loading" && (
        <Preloader progress={(flow1.loadedCount / FLOW1_COUNT) * 100} />
      )}

      {/* ============ NAVBAR ============ */}
      <Navbar
        isVisible={appState === "exploring" || appState === "skyFlight"}
        progress={exploreProgress}
      />

      {/* ============ MAIN VIEWPORT ============ */}
      <div
        className={`relative h-screen overflow-hidden transition-opacity duration-1000 ease-in-out ${
          appState !== "loading" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative h-screen overflow-hidden">
          {/* ---- FLOW 1: Canvas ---- */}
          {(appState === "hero" || appState === "exploring") && (
            <CanvasScroller
              images={flow1.images}
              frameCount={FLOW1_COUNT}
              progress={exploreProgress}
              scrollRange={[0, 1]}
            />
          )}

          {/* ---- HERO ---- */}
          {appState === "hero" && (
            <HeroOverlay
              isExploring={false}
              onExplore={handleExplore}
              progress={exploreProgress}
            />
          )}

          {/* ---- Text overlays ---- */}
          {appState === "exploring" && (
            <ScrollText progress={exploreProgress} />
          )}

          {/* ---- Scroll indicator ---- */}
          <ScrollIndicator
            isVisible={appState === "exploring"}
            progress={exploreProgress}
          />

          {/* ---- Start Your Project button ---- */}
          {appState === "exploring" && (
            <FrameCTA
              progress={exploreProgress}
              onStartProject={handleStartProject}
            />
          )}

          {/* ---- FLOW 2: Sky flight ---- */}
          {appState === "skyFlight" && (
            <>
              <SkyTransition
                isLoading={showSkyTransition}
                loadProgress={skyLoadProgress}
                onReady={handleSkyReady}
                minFramesForStart={MIN_SKY_FRAMES_TO_START}
                loadedCount={flow2.loadedCount}
              />
              {showSkyPlayer && (
                <SkyPlayer
                  images={flow2.images}
                  loadedCount={flow2.loadedCount}
                  isPlaying={true}
                  onProgress={setFlightProgress}
                  onComplete={handleFlightComplete}
                />
              )}
              {showSkyPlayer && (
                <SkyOverlay flightProgress={flightProgress} isActive={true} />
              )}
            </>
          )}

          {/* ---- Cinematic sky ending ---- */}
          <SkyEnding
            isActive={appState === "skyEnding"}
            onComplete={handleEndingComplete}
          />

          {/* ---- CONTACT FORM ---- */}
          {appState === "contact" && (
            <ContactForm isOpen={true} onClose={handleContactClose} />
          )}

          {/* ---- Cockpit HUD (optional, always rendered) ---- */}
          {/* <CockpitHUD /> */}
        </div>
      </div>
    </main>
  );
}
