"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ShimmerButton } from "@/components/bits/ShimmerButton";
import { AnimatedInput } from "@/components/bits/AnimatedInput";
import BlurText from "@/components/ui/BlurText";

interface Answers {
  lookingFor: string;
  service: string;
  budget: string;
  source: string;
  name: string;
  email: string;
  message: string;
}

const steps = {
  1: {
    question: "What are you looking for?",
    options: [
      "Start a new project",
      "Join our team",
      "Drop a quick word",
      "Join our newsletters",
    ],
    key: "lookingFor" as keyof Answers,
  },
  2: {
    question: "What can we do for you?",
    options: [
      "Complete Website",
      "UX & Web design",
      "Mobile App",
      "Branding",
      "Digital Campaign",
    ],
    key: "service" as keyof Answers,
  },
  3: {
    question: "What is your budget range for this project?",
    options: ["10-30k", "30-50k", "50-75k", "75-100k", "100k +"],
    key: "budget" as keyof Answers,
  },
  4: {
    question: "How'd you learn about us?",
    options: [
      "Awwwards",
      "A project we did",
      "An article",
      "A friend",
      "Social Media",
    ],
    key: "source" as keyof Answers,
  },
} as const;

const motionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

export default function ContactPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    lookingFor: "",
    service: "",
    budget: "",
    source: "",
    name: "",
    email: "",
    message: "",
  });

  const handleSelect = useCallback((key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    // Auto-advance after a brief delay for visual feedback
    setTimeout(() => setStep((s) => s + 1), 250);
  }, []);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(1, s - 1));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted:", answers);
      setStep(6);
    },
    [answers],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAnswers((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );

  return (
    <main
      className="relative min-h-screen bg-transparent"
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-6">
        <Link
          href="/"
          className="font-sans text-sm font-semibold tracking-[0.15em] uppercase text-white"
        >
          Devslane
        </Link>
        <nav className="hidden md:flex items-center gap-16">
          <Link
            href="/services"
            className="font-sans text-xs tracking-[0.15em] uppercase text-white hover:opacity-60 transition-opacity"
          >
            Services
          </Link>
          <Link
            href="/about"
            className="font-sans text-xs tracking-[0.15em] uppercase text-white hover:opacity-60 transition-opacity"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="font-sans text-xs tracking-[0.15em] uppercase text-white hover:opacity-60 transition-opacity"
          >
            Contact
          </Link>
        </nav>
      </header>

      {/* Content */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <AnimatePresence mode="wait">
          {/* Steps 1-4: Question + Oval Options */}
          {step >= 1 && step <= 4 && (
            <motion.div
              key={`step-${step}`}
              {...motionProps}
              className="flex flex-col items-center text-center"
            >
              <BlurText
                key={steps[step as 1 | 2 | 3 | 4].question}
                text={steps[step as 1 | 2 | 3 | 4].question}
                delay={50}
                animateBy="words"
                direction="top"
                className="font-sans text-3xl md:text-5xl font-bold text-white mb-10 leading-tight justify-center"
              />

              <div className="flex flex-wrap justify-center gap-3">
                {steps[step as 1 | 2 | 3 | 4].options.map((option) => {
                  const currentKey = steps[step as 1 | 2 | 3 | 4].key;
                  const isSelected = answers[currentKey] === option;
                  return (
                    <ShimmerButton
                      key={option}
                      onClick={() => handleSelect(currentKey, option)}
                      className={`rounded-full border px-7 py-3 text-sm transition-all duration-200 ${
                        isSelected
                          ? "bg-white text-blue-900 border-white"
                          : "bg-transparent text-white border-white/60 hover:bg-white hover:text-blue-900"
                      }`}
                      shimmerColor="rgba(255,255,255,0.3)"
                    >
                      {option}
                    </ShimmerButton>
                  );
                })}
              </div>

              {/* Back Arrow */}
              {step > 1 && (
                <button
                  onClick={goBack}
                  className="mt-10 text-white hover:opacity-60 transition-opacity"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
            </motion.div>
          )}

          {/* Step 5: Contact Form */}
          {step === 5 && (
            <motion.div
              key="step-5"
              {...motionProps}
              className="flex flex-col items-center text-center w-full max-w-lg"
            >
              <BlurText
                text="Tell us about your project"
                delay={50}
                animateBy="words"
                direction="top"
                className="font-sans text-3xl md:text-5xl font-bold text-white mb-10 leading-tight justify-center"
              />

              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <AnimatedInput
                  label="Your name"
                  name="name"
                  value={answers.name}
                  onChange={handleChange}
                  required
                  accentColor="#FFFFFF"
                />
                <AnimatedInput
                  label="Your email"
                  name="email"
                  type="email"
                  value={answers.email}
                  onChange={handleChange}
                  required
                  accentColor="#FFFFFF"
                />
                <AnimatedInput
                  label="Tell us more about your project..."
                  name="message"
                  value={answers.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  accentColor="#FFFFFF"
                />
                <ShimmerButton
                  type="submit"
                  className="w-full rounded-full bg-white text-blue-900 py-3 text-sm font-medium tracking-wide hover:bg-white/90 transition-colors"
                  shimmerColor="rgba(255,255,255,0.3)"
                >
                  Submit
                </ShimmerButton>
              </form>

              <button
                onClick={goBack}
                className="mt-8 text-white hover:opacity-60 transition-opacity"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {/* Step 6: Thank You */}
          {step === 6 && (
            <motion.div
              key="step-6"
              {...motionProps}
              className="flex flex-col items-center text-center"
            >
              <BlurText
                text="Thank you for submitting"
                delay={50}
                animateBy="words"
                direction="top"
                className="font-sans text-3xl md:text-5xl font-bold text-white mb-4 leading-tight justify-center"
              />
              <p className="font-sans text-sm text-white/70 mb-10">
                We&apos;ll get back to you shortly.
              </p>
              <Link
                href="/"
                className="rounded-full border border-white/60 px-8 py-3 text-sm text-white hover:bg-white hover:text-blue-900 transition-all duration-200"
              >
                Back to Home
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
