"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { ShimmerButton } from "@/components/bits/ShimmerButton";
import { AnimatedInput } from "@/components/bits/AnimatedInput";
import BlurText from "@/components/ui/BlurText";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactForm = ({ isOpen, onClose }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Submit logic here
      onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all duration-300"
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* Content */}
          <div className="relative z-10 w-full max-w-2xl px-6 md:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-10"
            >
              <BlurText
                text="Start Your Project"
                delay={50}
                animateBy="words"
                direction="top"
                className="font-serif text-3xl md:text-5xl tracking-[0.1em] text-white/90 mb-3 justify-center"
              />
              <p className="font-sans text-sm text-white/60 tracking-[0.15em] uppercase">
                Tell us about your vision
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name + Email row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatedInput label="Your Name" name="name" value={formData.name} onChange={handleChange} required />
                <AnimatedInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              {/* Company + Service row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatedInput label="Company (optional)" name="company" value={formData.company} onChange={handleChange} />
                <div>
                </div>
                <div>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-5 py-3.5 text-sm text-white/70 font-sans tracking-wide outline-none focus:border-devslane-glow/60 focus:bg-black/60 transition-all duration-300 appearance-none cursor-pointer"
                    style={{
                      color: formData.service ? "#ffffff" : undefined,
                    }}
                  >
                    <option value="" className="bg-slate-900 text-white/70">
                      Select Service
                    </option>
                    <option value="web" className="bg-slate-900 text-white">
                      Web Development
                    </option>
                    <option value="ai" className="bg-slate-900 text-white">
                      AI Solutions
                    </option>
                    <option value="saas" className="bg-slate-900 text-white">
                      SaaS Products
                    </option>
                    <option value="automation" className="bg-slate-900 text-white">
                      Automation
                    </option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <AnimatedInput label="Tell us about your project..." name="message" value={formData.message} onChange={handleChange} required multiline rows={4} />

              {/* Submit */}
              <div className="pt-2">
                <ShimmerButton
                  type="submit"
                  className="group w-full bg-gradient-to-r from-devslane-purple to-neon-purple rounded-xl px-8 py-4 font-sans text-sm tracking-[0.2em] uppercase text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                >
                  <span className="flex items-center justify-center gap-3">
                    Send Message
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </ShimmerButton>
              </div>
            </motion.form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
