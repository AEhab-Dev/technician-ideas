"use client";

import { useState, useEffect } from "react";
import { api, PublicService } from "@/lib/api";

interface PriceEstimatorProps {
  onSelectionChange?: (selectedIds: number[], total: number, serviceLabel: string, customNote: string) => void;
}

export default function PriceEstimator({ onSelectionChange }: PriceEstimatorProps) {
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [customNote, setCustomNote] = useState("");

  useEffect(() => {
    api.getServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = services
    .filter((s) => selected.has(s.id))
    .reduce((sum, s) => sum + s.starting_price, 0);

  const serviceLabel = services
    .filter((s) => selected.has(s.id))
    .map((s) => s.name)
    .join(", ");

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      const newLabel = services.filter((s) => next.has(s.id)).map((s) => s.name).join(", ");
      const newTotal = services.filter((s) => next.has(s.id)).reduce((sum, s) => sum + s.starting_price, 0);
      onSelectionChange?.(Array.from(next), newTotal, newLabel, customNote);
      return next;
    });
  };

  const handleNoteChange = (note: string) => {
    setCustomNote(note);
    onSelectionChange?.(Array.from(selected), total, serviceLabel, note);
  };

  return (
    <div className="card-dark p-6 md:p-8 flex flex-col gap-6" aria-label="Service selector">

      {/* Header */}
      <div>
        <p className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-1">
          Transparent Pricing
        </p>
        <h2 className="font-display font-bold text-brand-white text-xl">Select Your Services</h2>
        <p className="text-silver text-sm mt-1">
          Check all services you need. Prices shown are starting estimates — final quote confirmed at booking.
        </p>
      </div>

      {/* Services list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-background-elevated rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Select services</legend>
          {services.map((svc) => {
            const checked = selected.has(svc.id);
            return (
              <label
                key={svc.id}
                className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-150 group ${
                  checked
                    ? "border-gold bg-gold/5"
                    : "border-border bg-background-elevated hover:border-silver-dark"
                }`}
              >
                {/* Gold checkbox */}
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggle(svc.id)}
                    aria-label={svc.name}
                  />
                  <div
                    onClick={() => toggle(svc.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
                      checked
                        ? "bg-gold border-gold"
                        : "bg-transparent border-border group-hover:border-silver"
                    }`}
                  >
                    {checked && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => toggle(svc.id)}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-display font-semibold text-sm ${checked ? "text-gold" : "text-brand-white"}`}>
                      {svc.name}
                    </span>
                    <span className="text-gold text-xs font-sans font-semibold shrink-0">
                      from ${svc.starting_price}
                    </span>
                  </div>
                  {svc.description && (
                    <p className="text-silver-dark text-xs font-sans leading-relaxed mt-0.5">
                      {svc.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </fieldset>
      )}

      {/* Custom repair notes */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="custom_note" className="text-xs font-medium font-sans text-silver-light tracking-wide">
          General Inspection / Custom Repair Notes
          <span className="text-silver-dark ml-1">(optional)</span>
        </label>
        <textarea
          id="custom_note"
          rows={3}
          value={customNote}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Describe any specific issues, symptoms, or requests — warning lights, noises, leaks, etc."
          className="w-full bg-background-elevated border border-border rounded-lg px-4 py-3 text-sm text-brand-white placeholder-silver-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-200 font-sans resize-none"
        />
      </div>

      {/* Live total */}
      <div className={`rounded-lg border p-4 transition-all duration-200 ${selected.size > 0 ? "border-gold/30 bg-gold/5" : "border-border bg-background-elevated"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-silver-dark font-sans uppercase tracking-widest">
              {selected.size === 0 ? "No services selected" : `${selected.size} service${selected.size > 1 ? "s" : ""} selected`}
            </p>
            {selected.size > 0 && (
              <p className="text-silver text-xs font-sans mt-0.5 leading-relaxed max-w-xs truncate">
                {serviceLabel}
              </p>
            )}
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="text-xs text-silver-dark font-sans uppercase tracking-widest">Total (est.)</p>
            <p className={`font-display font-bold text-2xl ${selected.size > 0 ? "text-gold" : "text-silver-dark"}`}>
              ${total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
