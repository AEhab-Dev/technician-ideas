"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi, SlotRead } from "@/lib/adminApi";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") ?? "";
}

function monthLabel(year: number, month: number) {
  return new Date(year, month - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
}

function toMonthStr(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function AdminSlotsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [slots, setSlots] = useState<SlotRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add slot form
  const [showAdd, setShowAdd] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getSlots(toMonthStr(year, month), getToken());
      setSlots(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load slots");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAdding(true);
    try {
      await adminApi.createSlot(newDate, newTime + ":00", getToken());
      setShowAdd(false);
      setNewDate("");
      setNewTime("10:00");
      await loadSlots();
    } catch (e: unknown) {
      setAddError(e instanceof Error ? e.message : "Failed to add slot");
    } finally {
      setAdding(false);
    }
  };

  const handleBlock = async (slot: SlotRead) => {
    try {
      await adminApi.blockSlot(slot.id, "unavailable", getToken());
      await loadSlots();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to block slot");
    }
  };

  const handleUnblock = async (slot: SlotRead) => {
    try {
      await adminApi.unblockSlot(slot.id, getToken());
      await loadSlots();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to unblock slot");
    }
  };

  const handleDelete = async (slot: SlotRead) => {
    if (!confirm(`Delete slot ${slot.slot_date} ${formatTime(slot.slot_time)}?`)) return;
    try {
      await adminApi.deleteSlot(slot.id, getToken());
      await loadSlots();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete slot");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-brand-white text-2xl">Time Slots</h1>
          <p className="text-silver text-sm mt-1">Manage available booking slots</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="px-5 py-2.5 bg-gold-gradient text-background font-display font-semibold text-sm rounded-md hover:shadow-gold-glow-strong transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          + Add Slot
        </button>
      </div>

      {/* Add Slot Form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-background-secondary border border-border rounded-xl p-6 mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver uppercase tracking-widest font-display">Date</label>
            <input
              type="date"
              required
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="bg-background-elevated border border-border rounded-md px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver uppercase tracking-widest font-display">Time</label>
            <input
              type="time"
              required
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="bg-background-elevated border border-border rounded-md px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
          <div className="flex gap-3 items-end">
            <button
              type="submit"
              disabled={adding}
              className="px-5 py-2.5 bg-gold-gradient text-background font-display font-semibold text-sm rounded-md hover:shadow-gold-glow-strong transition-all duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {adding ? "Adding…" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-5 py-2.5 border border-border text-silver text-sm rounded-md hover:text-brand-white hover:border-silver transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Cancel
            </button>
          </div>
          {addError && <p className="w-full text-red-400 text-sm">{addError}</p>}
        </form>
      )}

      {/* Month navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={prevMonth} className="p-2 rounded-md border border-border text-silver hover:text-gold hover:border-gold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Previous month"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span className="font-display font-semibold text-brand-white text-lg min-w-[180px] text-center">
          {monthLabel(year, month)}
        </span>
        <button onClick={nextMonth} className="p-2 rounded-md border border-border text-silver hover:text-gold hover:border-gold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Next month"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Slots list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-400 text-sm">{error}</div>
      ) : slots.length === 0 ? (
        <div className="bg-background-secondary border border-border rounded-xl p-12 text-center">
          <p className="text-silver">No slots for {monthLabel(year, month)}.</p>
          <p className="text-silver-dark text-sm mt-1">Click "Add Slot" to create one.</p>
        </div>
      ) : (
        <div className="bg-background-secondary border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-silver-dark font-display text-xs uppercase tracking-widest">Date</th>
                <th className="text-left px-5 py-3 text-silver-dark font-display text-xs uppercase tracking-widest">Time</th>
                <th className="text-left px-5 py-3 text-silver-dark font-display text-xs uppercase tracking-widest">Status</th>
                <th className="text-right px-5 py-3 text-silver-dark font-display text-xs uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, i) => (
                <tr key={slot.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-background/30"}`}>
                  <td className="px-5 py-3 text-brand-white font-sans">{slot.slot_date}</td>
                  <td className="px-5 py-3 text-brand-white font-sans">{formatTime(slot.slot_time)}</td>
                  <td className="px-5 py-3">
                    {slot.is_available ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Available
                      </span>
                    ) : slot.reason_blocked === "booked" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        Booked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        Blocked
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {slot.is_available ? (
                        <button onClick={() => handleBlock(slot)} className="px-3 py-1.5 text-xs border border-border text-silver rounded-md hover:border-red-400 hover:text-red-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                          Block
                        </button>
                      ) : slot.reason_blocked !== "booked" ? (
                        <button onClick={() => handleUnblock(slot)} className="px-3 py-1.5 text-xs border border-border text-silver rounded-md hover:border-green-400 hover:text-green-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                          Unblock
                        </button>
                      ) : null}
                      {slot.reason_blocked !== "booked" && (
                        <button onClick={() => handleDelete(slot)} className="px-3 py-1.5 text-xs border border-border text-silver rounded-md hover:border-red-400 hover:text-red-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
