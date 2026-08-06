"use client";

import { useState, useEffect } from "react";
import { adminApi, SiteSettingsRead } from "@/lib/adminApi";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") ?? "";
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-sans shadow-lg flex items-center gap-2 animate-fade-in ${
      type === "success"
        ? "bg-green-500/20 border border-green-500/40 text-green-400"
        : "bg-red-500/20 border border-red-500/40 text-red-400"
    }`}>
      {type === "success" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      )}
      {message}
    </div>
  );
}

const inputBase = "w-full bg-background-elevated border border-border rounded-md px-4 py-2.5 text-sm text-brand-white placeholder:text-silver-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors";
const textareaBase = `${inputBase} resize-none`;

export default function AdminContentPage() {
  const [form, setForm] = useState<Partial<SiteSettingsRead>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    adminApi.getSettings(getToken())
      .then(setForm)
      .catch(() => showToast("Failed to load content", "error"))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(form, getToken());
      showToast("Content saved successfully.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-white text-2xl">Content</h1>
        <p className="text-silver text-sm mt-1">Edit the text and media shown on the public site</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* Hero section */}
        <section className="bg-background-secondary border border-border rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-brand-white text-base border-b border-border pb-3">
            Hero Section
          </h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Hero Title</label>
            <input
              name="hero_title"
              type="text"
              value={form.hero_title ?? ""}
              onChange={handleChange}
              placeholder="Expert Auto Repair"
              className={inputBase}
            />
            <p className="text-xs text-silver-dark">The large headline shown on the homepage.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Hero Subtitle</label>
            <input
              name="hero_subtitle"
              type="text"
              value={form.hero_subtitle ?? ""}
              onChange={handleChange}
              placeholder="Mobile service and drop-off available. We come to you."
              className={inputBase}
            />
            <p className="text-xs text-silver-dark">The smaller tagline below the title.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Background Media URL</label>
            <input
              name="hero_media_url"
              type="url"
              value={form.hero_media_url ?? ""}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=... or https://example.com/image.jpg"
              className={inputBase}
            />
            <p className="text-xs text-silver-dark">Paste a YouTube, Vimeo, or direct image URL to change the hero background.</p>
          </div>
        </section>

        {/* About section */}
        <section className="bg-background-secondary border border-border rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-brand-white text-base border-b border-border pb-3">
            About Us
          </h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver-dark uppercase tracking-widest font-display">About Text</label>
            <textarea
              name="about_text"
              rows={5}
              value={form.about_text ?? ""}
              onChange={handleChange}
              placeholder="Tell customers about your business, experience, and what makes you different…"
              className={textareaBase}
            />
          </div>
        </section>

        {/* Footer */}
        <section className="bg-background-secondary border border-border rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-brand-white text-base border-b border-border pb-3">
            Footer
          </h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Footer Bio Text</label>
            <textarea
              name="footer_bio"
              rows={3}
              value={form.footer_bio ?? ""}
              onChange={handleChange}
              placeholder="Professional auto repair and mechanic services. Reliable mobile service and drop-off service available."
              className={textareaBase}
            />
            <p className="text-xs text-silver-dark">Short description shown at the bottom of every page.</p>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="self-start px-8 py-3 bg-gold-gradient text-background font-display font-semibold text-sm rounded-md hover:shadow-gold-glow-strong transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {saving ? "Saving…" : "Save Content"}
        </button>
      </form>
    </div>
  );
}
