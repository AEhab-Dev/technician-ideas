"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { JoinTeamFormData } from "@/types";

const roles = [
  "Mobile Mechanic",
  "Auto Technician",
  "Brake & Suspension Specialist",
  "Electrical / Diagnostics Technician",
  "Oil & Fluid Service Tech",
  "Service Advisor",
  "Other",
];

const initialForm: JoinTeamFormData = {
  full_name: "",
  email: "",
  role_interest: "",
  portfolio_url: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function JoinTeamForm() {
  const [form, setForm] = useState<JoinTeamFormData>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      await api.submitApplication(form);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  const inputBase =
    "w-full bg-background-elevated border border-border rounded-lg px-4 py-3 text-sm text-brand-white placeholder-silver-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-200 font-sans";

  if (status === "success") {
    return (
      <section className="section-padding bg-background" aria-labelledby="join-heading">
        <div className="content-width max-w-xl mx-auto text-center">
          <div className="card-dark p-10 flex flex-col items-center gap-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-background-elevated border border-gold flex items-center justify-center shadow-gold-glow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-brand-white text-2xl">
              Application Received
            </h2>
            <p className="text-silver text-sm leading-relaxed">
              Thank you for your interest in joining the team. We review every application
              personally and will be in touch shortly.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-2 px-6 py-2.5 text-sm font-semibold font-display rounded-md border border-gold text-gold hover:bg-gold hover:text-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Submit Another
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background" aria-labelledby="join-heading">
      <div className="content-width max-w-2xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-10">
          <p className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-3">
            Join the Team
          </p>
          <h2
            id="join-heading"
            className="font-display font-bold text-brand-white mb-4"
          >
            Work With{" "}
            <span className="text-gold-gradient">Moon Ideas</span>
          </h2>
          <div className="divider-gold w-24 mx-auto mb-6" aria-hidden="true" />
          <p className="text-silver max-w-lg mx-auto text-base leading-relaxed">
            We are always looking for skilled mechanics and technicians to grow with.
            Tell us about your experience.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="card-dark p-6 md:p-8 flex flex-col gap-5"
          noValidate
          aria-label="Join the team application form"
        >
          {/* Name + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="full_name" className="text-xs font-medium font-sans text-silver-light tracking-wide">
                Full Name<span className="text-gold" aria-hidden="true">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                placeholder="John Smith"
                value={form.full_name}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium font-sans text-silver-light tracking-wide">
                Email Address<span className="text-gold" aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="role_interest" className="text-xs font-medium font-sans text-silver-light tracking-wide">
              Role / Specialty<span className="text-gold" aria-hidden="true">*</span>
            </label>
            <select
              id="role_interest"
              name="role_interest"
              required
              value={form.role_interest}
              onChange={handleChange}
              className={inputBase}
            >
              <option value="" disabled>Select your specialty…</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Resume / Certification URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="portfolio_url" className="text-xs font-medium font-sans text-silver-light tracking-wide">
              Resume / Certification URL{" "}
              <span className="text-silver-dark">(optional)</span>
            </label>
            <input
              id="portfolio_url"
              name="portfolio_url"
              type="url"
              autoComplete="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={form.portfolio_url}
              onChange={handleChange}
              className={inputBase}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-xs font-medium font-sans text-silver-light tracking-wide">
              About You<span className="text-gold" aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell us about your mechanical experience and what you bring to the team."
              value={form.message}
              onChange={handleChange}
              className={`${inputBase} resize-none`}
            />
          </div>

          {/* Error */}
          {status === "error" && (
            <p className="text-red-400 text-sm" role="alert">{errorMsg}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="self-start px-8 py-3 font-display font-semibold text-sm rounded-md bg-gold-gradient text-background hover:shadow-gold-glow-strong transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {status === "submitting" ? "Submitting…" : "Apply Now"}
          </button>
        </form>
      </div>
    </section>
  );
}
