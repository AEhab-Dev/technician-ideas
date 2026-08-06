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
      type === "success" ? "bg-green-500/20 border border-green-500/40 text-green-400" : "bg-red-500/20 border border-red-500/40 text-red-400"
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

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Partial<SiteSettingsRead>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    adminApi.getSettings(getToken())
      .then(setForm)
      .catch(() => showToast("Failed to load settings", "error"))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(form, getToken());
      showToast("Settings saved successfully.", "success");
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
        <h1 className="font-display font-bold text-brand-white text-2xl">Settings</h1>
        <p className="text-silver text-sm mt-1">Business contact info and social media links</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* Contact */}
        <section className="bg-background-secondary border border-border rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-brand-white text-base border-b border-border pb-3">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Phone Number</label>
              <input name="phone" type="tel" value={form.phone ?? ""} onChange={handleChange} placeholder="(916) 530-7539" className={inputBase} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Contact Email</label>
              <input name="email" type="email" value={form.email ?? ""} onChange={handleChange} placeholder="Cammy@moonideas.com" className={inputBase} />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="bg-background-secondary border border-border rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-brand-white text-base border-b border-border pb-3">
            Social Media URLs
          </h2>
          {[
            { name: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/moonideas" },
            { name: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/moonideas" },
            { name: "youtube_url", label: "YouTube Channel URL", placeholder: "https://youtube.com/@moonideas" },
          ].map(f => (
            <div key={f.name} className="flex flex-col gap-1.5">
              <label className="text-xs text-silver-dark uppercase tracking-widest font-display">{f.label}</label>
              <input name={f.name} type="url" value={(form as Record<string, string>)[f.name] ?? ""} onChange={handleChange} placeholder={f.placeholder} className={inputBase} />
            </div>
          ))}
        </section>

        {/* YouTube video ID (legacy homepage embed) */}
        <section className="bg-background-secondary border border-border rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-brand-white text-base border-b border-border pb-3">
            Homepage YouTube Video
          </h2>
          <p className="text-silver text-sm">Paste just the video ID — e.g. <code className="text-gold bg-background-elevated px-1.5 py-0.5 rounded text-xs">dQw4w9WgXcQ</code></p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Video ID</label>
            <input name="youtube_video_id" type="text" value={form.youtube_video_id ?? ""} onChange={handleChange} placeholder="dQw4w9WgXcQ" className={inputBase} />
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="self-start px-8 py-3 bg-gold-gradient text-background font-display font-semibold text-sm rounded-md hover:shadow-gold-glow-strong transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
