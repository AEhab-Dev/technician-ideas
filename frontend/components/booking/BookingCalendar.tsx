
  "use client";

  import { useState, useEffect, useCallback } from "react";
  import { TimeSlot } from "@/types";
  import { api } from "@/lib/api";
  import { CalendarSkeleton } from "@/components/ui/SkeletonLoader";
  import Tooltip from "@/components/ui/Tooltip";

  interface BookingCalendarProps {
    onSelectSlot: (slot: TimeSlot | null) => void;
    selectedSlotId?: string;
  }

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  function toMonthKey(year: number, month: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}`;
  }

  function formatTime(timeStr: string): string {
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
  }

  export default function BookingCalendar({
    onSelectSlot,
    selectedSlotId,
  }: BookingCalendarProps) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [error, setError] = useState("");

    const monthKey = toMonthKey(viewYear, viewMonth);

    const fetchSlots = useCallback(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.getSlots(monthKey);
        setSlots(data);
      } catch {
        setError("Could not load availability. Please try again.");
      } finally {
        setLoading(false);
      }
    }, [monthKey]);

    useEffect(() => { fetchSlots(); }, [fetchSlots]);

    // Reset selected date when month changes
    useEffect(() => {
      setSelectedDate(null);
      onSelectSlot(null);
    }, [viewMonth, viewYear, onSelectSlot]);

    const prevMonth = () => {
      if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
      else setViewMonth((m) => m - 1);
    };

    const nextMonth = () => {
      if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
      else setViewMonth((m) => m + 1);
    };

    const isPastMonth =
      viewYear < today.getFullYear() ||
      (viewYear === today.getFullYear() && viewMonth < today.getMonth());

    // Build calendar grid
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Group slots by date string
    const slotsByDate = slots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
      const d = slot.slot_date;
      if (!acc[d]) acc[d] = [];
      acc[d].push(slot);
      return acc;
    }, {});

    const isToday = (day: number) => {
      return (
        day === today.getDate() &&
        viewMonth === today.getMonth() &&
        viewYear === today.getFullYear()
      );
    };

    const isPastDay = (day: number) => {
      const d = new Date(viewYear, viewMonth, day);
      d.setHours(0, 0, 0, 0);
      const t = new Date();
      t.setHours(0, 0, 0, 0);
      return d < t;
    };

    const getDateKey = (day: number) =>
      `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const slotsForSelected = selectedDate ? slotsByDate[selectedDate] ?? [] : [];
    const availableForSelected = slotsForSelected.filter((s) => s.is_available);

    if (loading) return <CalendarSkeleton />;

    return (
      <div className="card-dark p-6 flex flex-col gap-6" aria-label="Booking calendar">

        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-brand-white text-lg">
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              disabled={isPastMonth}
              className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-silver hover:text-gold hover:border-gold disabled:opacity-30
  disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"aria-label="Previous month"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-silver hover:text-gold hover:border-gold transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Next month"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1" role="row">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium font-sans text-silver-dark py-1"
              role="columnheader"
              aria-label={d}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          className="grid grid-cols-7 gap-1"
          role="grid"
          aria-label={`${MONTHS[viewMonth]} ${viewYear}`}
        >
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} role="gridcell" aria-hidden="true" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = getDateKey(day);
            const past = isPastDay(day);
            const daySlots = slotsByDate[dateKey] ?? [];
            const hasAvailable = daySlots.some((s) => s.is_available);
            const hasBlocked = daySlots.some((s) => !s.is_available);
            const isSelected = selectedDate === dateKey;
            const todayFlag = isToday(day);

            let tooltipText = "";
            if (past) tooltipText = "Past date";
            else if (hasBlocked && !hasAvailable) tooltipText = "Fully booked";
            else if (hasAvailable) tooltipText = `${daySlots.filter(s => s.is_available).length} slot(s) available`;
            else tooltipText = "No slots";

            const cellBase =
              "relative aspect-square rounded-md flex items-center justify-center text-sm font-sans font-medium transition-all duration-200 focus-visible:outline-nonefocus-visible:ring-2 focus-visible:ring-gold";

            const cellStyle = past
              ? `${cellBase} text-silver-dark/40 cursor-not-allowed line-through`
              : hasAvailable
              ? isSelected
                ? `${cellBase} bg-gold text-background cursor-pointer shadow-gold-glow`
                : `${cellBase} text-brand-white hover:bg-background-elevated hover:text-gold cursor-pointer border border-gold/30 hover:border-gold`
              : `${cellBase} text-silver-dark/50 cursor-not-allowed`;

            return (
              <Tooltip key={dateKey} content={tooltipText} position="top">
                <button
                  role="gridcell"
                  aria-label={`${MONTHS[viewMonth]} ${day}, ${viewYear}${hasAvailable ? ` — ${daySlots.filter(s => s.is_available).length} available` : " — unavailable"}`}
                  aria-pressed={isSelected}
                  aria-disabled={past || (!hasAvailable)}
                  disabled={past || (!hasAvailable)}
                  onClick={() => {
                    if (past || !hasAvailable) return;
                    setSelectedDate(dateKey);
                    onSelectSlot(null); // reset slot when date changes
                  }}
                  className={cellStyle}
                >
                  {day}
                  {todayFlag && !isSelected && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                  )}{hasAvailable && !isSelected && (
                    <span
                      className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-gold/70"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-sans text-silver-dark flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold/70" aria-hidden="true" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-silver-dark/40" aria-hidden="true" />
            Unavailable
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
            Today
          </span>
        </div>

        {/* Time slot picker */}
        {selectedDate && (
          <div className="animate-fade-in border-t border-border pt-5">
            <p className="text-sm font-medium font-sans text-silver-light mb-3">
              Available times for{" "}
              <span className="text-gold">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long", month: "long", day: "numeric",
                })}
              </span>
            </p>

            {availableForSelected.length === 0 ? (
              <p className="text-silver-dark text-sm font-sans">
                No available slots for this date.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableForSelected.map((slot) => {
                  const isSlotSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => onSelectSlot(isSlotSelected ? null : slot)}
                      className={`px-3 py-2.5 rounded-lg border text-sm font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-gold ${
                        isSlotSelected
                          ? "bg-gold text-background border-gold shadow-gold-glow"
                          : "bg-background-elevated text-silver border-border hover:border-gold hover:text-gold"
                      }`}
                      aria-pressed={isSlotSelected}
                      aria-label={`Select time slot: ${formatTime(slot.slot_time)}`}
                    >
                      {formatTime(slot.slot_time)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }