"use client";

import { useState, useRef } from "react";

interface AnimatedInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  accentColor?: string;
}

export const AnimatedInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 4,
  accentColor = "#A855F7",
}: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const isActive = isFocused || value.length > 0;

  const sharedClassName =
    "w-full bg-transparent border-b-2 border-slate-200 px-1 pt-6 pb-2 text-sm font-sans text-slate-800 outline-none transition-colors duration-300 peer";

  return (
    <div className="relative group">
      {/* Floating label */}
      <label
        className={`absolute left-1 font-sans text-sm transition-all duration-300 pointer-events-none ${
          isActive
            ? "top-0 text-xs text-devslane-purple"
            : "top-6 text-slate-400"
        }`}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${sharedClassName} resize-none`}
          style={{ borderColor: isFocused ? accentColor : undefined }}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={sharedClassName}
          style={{ borderColor: isFocused ? accentColor : undefined }}
        />
      )}

      {/* Animated focus bar — expands from center */}
      <div
        className="absolute bottom-0 left-1/2 h-[2px] transition-all duration-300"
        style={{
          width: isFocused ? "100%" : "0%",
          transform: "translateX(-50%)",
          backgroundColor: accentColor,
        }}
      />
    </div>
  );
};
