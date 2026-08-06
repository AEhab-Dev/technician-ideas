"use client";
import { useState } from "react";
import { TimeSlot, BookingFormData } from "@/types";
import { api } from "@/lib/api";

interface TimeSlotPickerProps {
  slot: TimeSlot;
  estimatedPrice: number;
  serviceType: string;
  selectedServiceIds: number[];
  customNote: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const initialForm = {
  client_name: "",
  client_email: "",
  client_phone: "",
  notes: "",
};

type Status = "idle" | "submitting" | "error";

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDate(d: string): string {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

export default function TimeSlotPicker({
  slot,
  estimatedPrice,
  serviceType,
  selectedServiceIds,
  customNote,
  onSuccess,
  onCancel,
}: TimeSlotPickerProps) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const inputBase =
    "w-full bg-background-elevated border border-border rounded-lg px-4 py-3 text-sm text-brand-white placeholder-silver-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-200 font-sans";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    // Combine custom note with any other notes
    const combinedNotes = [
      customNote ? `Custom/General: ${customNote}` : "",
      form.notes,
    ].filter(Boolean).join("\n\n");

    const payload: BookingFormData = {
      slot_id: slot.id,
      client_name: form.client_name,
      client_email: form.client_email,
      client_phone: form.client_phone || undefined,
      service_type: serviceType || "General Inspection",
      selected_service_ids: selectedServiceIds,
      notes: combinedNotes || undefined,
      estimated_price: estimatedPrice,
    };

    try {
      await api.createBooking(payload);
      onSuccess();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto card-dark p-6 md:p-8 flex flex-col gap-6">

      {/* Slot summary */}
      <div className="bg-background-elevated border border-gold/20 rounded-lg p-4 flex flex-col gap-2">
        <p className="font-display text-xs font-semibold tracking-widest uppercase text-gold">
          Your Appointment
        </p>
        <p className="text-brand-white font-sans font-medium">{formatDate(slot.slot_date)}</p>
        <p className="text-silver text-sm font-sans">{formatTime(slot.slot_time)}</p>
        {serviceType && (
          <p className="text-silver-dark text-xs font-sans mt-1 leading-relaxed">{serviceType}</p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
          <span className="text-xs text-silver-dark font-sans uppercase tracking-widest">Estimated Total</span>
          <span className="text-gold font-display font-bold text-lg">
            {estimatedPrice > 0 ? `$${estimatedPrice}` : "TBD"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="font-display font-semibold text-brand-white text-base">Your Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="client_name" className="text-xs text-silver-light font-sans tracking-wide">
              Full Name<span className="text-gold">*</span>
            </label>
            <input
              id="client_name" name="client_name" type="text" required
              autoComplete="name" placeholder="John Smith"
              value={form.client_name} onChange={handleChange}
              className={inputBase}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="client_email" className="text-xs text-silver-light font-sans tracking-wide">
              Email<span className="text-gold">*</span>
            </label>
            <input
              id="client_email" name="client_email" type="email" required
              autoComplete="email" placeholder="john@example.com"
              value={form.client_email} onChange={handleChange}
              className={inputBase}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="client_phone" className="text-xs text-silver-light font-sans tracking-wide">
            Phone <span className="text-silver-dark">(optional)</span>
          </label>
          <input
            id="client_phone" name="client_phone" type="tel"
            autoComplete="tel" placeholder="(916) 555-0100"
            value={form.client_phone} onChange={handleChange}
            className={inputBase}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-xs text-silver-light font-sans tracking-wide">
            Additional Notes <span className="text-silver-dark">(optional)</span>
          </label>
          <textarea
            id="notes" name="notes" rows={3}
            placeholder="Anything else we should know before the appointment?"
            value={form.notes} onChange={handleChange}
            className={`${inputBase} resize-none`}
          />
        </div>

        {status === "error" && (
          <p className="text-red-400 text-sm" role="alert">{errorMsg}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex-1 py-3 bg-gold-gradient text-background font-display font-semibold text-sm rounded-md hover:shadow-gold-glow-strong transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {status === "submitting" ? "Confirming…" : "Confirm Booking"}
          </button>
          <button
            type="button" onClick={onCancel}
            className="px-5 py-3 border border-border text-silver text-sm rounded-md hover:text-brand-white hover:border-silver transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
