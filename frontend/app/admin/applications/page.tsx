"use client";

import { useState, useEffect } from "react";
import { adminApi, ApplicationRead } from "@/lib/adminApi";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") ?? "";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<ApplicationRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getApplications(getToken())
      .then(setApps)
      .catch(e => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-white text-2xl">Applications</h1>
        <p className="text-silver text-sm mt-1">Join the Team submissions</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-400 text-sm">{error}</div>
      ) : apps.length === 0 ? (
        <div className="bg-background-secondary border border-border rounded-xl p-12 text-center">
          <p className="text-silver">No applications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {apps.map((app) => (
            <div key={app.id} className="bg-background-secondary border border-border rounded-xl overflow-hidden">
              {/* Row */}
              <button
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-background-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
              >
                <div className="flex items-center gap-6 text-left">
                  <div>
                    <p className="text-brand-white font-sans font-medium">{app.full_name}</p>
                    <p className="text-silver-dark text-xs mt-0.5">{app.email}</p>
                  </div>
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-sans">
                    {app.role_interest}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="text-silver-dark text-xs font-sans">{formatDate(app.created_at)}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-silver transition-transform duration-200 ${expanded === app.id ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {/* Expanded detail */}
              {expanded === app.id && (
                <div className="px-6 pb-5 border-t border-border pt-4 flex flex-col gap-3">
                  {app.portfolio_url && (
                    <div>
                      <p className="text-xs text-silver-dark uppercase tracking-widest font-display mb-1">Portfolio</p>
                      <a
                        href={app.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold text-sm hover:underline"
                      >
                        {app.portfolio_url}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-silver-dark uppercase tracking-widest font-display mb-1">Message</p>
                    <p className="text-silver text-sm leading-relaxed">{app.message}</p>
                  </div>
                  <div className="flex gap-3 mt-1">
                    <a
                      href={`mailto:${app.email}`}
                      className="px-4 py-2 text-xs font-display font-semibold bg-gold-gradient text-background rounded-md hover:shadow-gold-glow-strong transition-all"
                    >
                      Reply by Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
