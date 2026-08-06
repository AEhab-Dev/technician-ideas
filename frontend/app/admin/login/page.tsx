"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await login(email, password);
      localStorage.setItem("admin_token", token);
      router.replace("/admin/slots");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-display font-bold text-gold tracking-widest text-lg uppercase">
            TI Admin
          </span>
          <p className="text-silver text-sm mt-2">Sign in to manage your site</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-background-secondary border border-border rounded-xl p-8 flex flex-col gap-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-silver font-sans">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background-elevated border border-border rounded-md px-4 py-2.5 text-sm text-brand-white placeholder:text-silver-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              placeholder="admin@technicianideas.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-silver font-sans">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background-elevated border border-border rounded-md px-4 py-2.5 text-sm text-brand-white placeholder:text-silver-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 px-6 py-3 bg-gold-gradient text-background font-display font-semibold text-sm rounded-md hover:shadow-gold-glow-strong transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
