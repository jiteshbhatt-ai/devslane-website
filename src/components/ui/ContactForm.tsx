"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { ShimmerButton } from "@/components/bits/ShimmerButton";
import { AnimatedInput } from "@/components/bits/AnimatedInput";

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
          <div className="absolute inset-0 bg-sky-100/95 backdrop-blur-sm" />

          {/* Sky-blue glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 55%, rgba(135, 206, 235, 0.3) 0%, rgba(100, 180, 220, 0.1) 40%, transparent 70%)",
            }}
          />
          {/* Horizon light line */}
          <div
            className="absolute left-0 right-0 top-[55%] h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, rgba(135, 206, 235, 0.4) 30%, rgba(135, 206, 235, 0.6) 50%, rgba(135, 206, 235, 0.4) 70%, transparent 95%)",
              boxShadow: "0 0 40px 10px rgba(135, 206, 235, 0.15)",
            }}
          />

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
              <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] text-slate-800 mb-3">
                Start Your Project
              </h2>
              <p className="font-sans text-sm text-slate-600 tracking-[0.15em] uppercase">
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
                    className="w-full bg-white/70 border border-slate-200 rounded-xl px-5 py-3.5 text-sm text-slate-400 font-sans tracking-wide outline-none focus:border-devslane-glow/60 focus:bg-white/90 transition-all duration-300 appearance-none cursor-pointer"
                    style={{
                      color: formData.service ? "#1e293b" : undefined,
                    }}
                  >
                    <option value="" className="bg-white">
                      Select Service
                    </option>
                    <option value="web" className="bg-white text-slate-800">
                      Web Development
                    </option>
                    <option value="ai" className="bg-white text-slate-800">
                      AI Solutions
                    </option>
                    <option value="saas" className="bg-white text-slate-800">
                      SaaS Products
                    </option>
                    <option value="automation" className="bg-white text-slate-800">
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
