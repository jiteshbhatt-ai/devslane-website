"use client";

interface PreloaderProps {
  progress: number;
}

export const Preloader = ({ progress }: PreloaderProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sky-200">
      <h1 className="font-serif text-4xl md:text-6xl tracking-[0.3em] text-slate-800 uppercase mb-12">
        DEVSLANE
      </h1>

      <div className="w-64 md:w-80 relative">
        {/* Track */}
        <div className="h-[2px] w-full bg-slate-300 rounded-full overflow-hidden">
          {/* Fill */}
          <div
            className="h-full bg-devslane-glow rounded-full transition-all duration-150 ease-out animate-glow-bar"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Percentage */}
        <p className="mt-4 text-center text-sm tracking-[0.2em] text-slate-500 font-sans">
          Loading Experience{" "}
          <span className="text-devslane-purple">{Math.round(progress)}%</span>
        </p>
      </div>
    </div>
  );
};
