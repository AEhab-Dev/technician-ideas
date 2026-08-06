"use client";

import { useState, useCallback } from "react";
import BookingCalendar from "@/components/booking/BookingCalendar";
import PriceEstimator from "@/components/booking/PriceEstimator";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { TimeSlot } from "@/types";

export default function BookingClient() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [serviceType, setServiceType] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [customNote, setCustomNote] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);

  const handleSelectionChange = useCallback(
    (ids: number[], total: number, label: string, note: string) => {
      setSelectedServiceIds(ids);
      setEstimatedPrice(total);
      setServiceType(label);
      setCustomNote(note);
    },
    []
  );

  const handleSelectSlot = useCallback((slot: TimeSlot | null) => {
    setSelectedSlot(slot);
  }, []);

  const handleSuccess = useCallback(() => {
    setBookingComplete(true);
    setSelectedSlot(null);
  }, []);

  const handleReset = useCallback(() => {
    setBookingComplete(false);
    setSelectedSlot(null);
    setEstimatedPrice(0);
    setServiceType("");
    setSelectedServiceIds([]);
    setCustomNote("");
  }, []);

  if (bookingComplete) {
    return (
      <div className="max-w-lg mx-auto text-center card-dark p-10 flex flex-col items-center gap-5 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-background-elevated border border-gold flex items-center justify-center shadow-gold-glow-strong">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-brand-white text-2xl">You&apos;re Booked!</h2>
        <p className="text-silver text-sm leading-relaxed max-w-sm">
          Your appointment has been submitted. We&apos;ll confirm your booking and reach out shortly.
        </p>
        <button
          onClick={handleReset}
          className="mt-2 px-6 py-2.5 text-sm font-semibold font-display rounded-md border border-gold text-gold hover:bg-gold hover:text-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Book Another Service
        </button>
      </div>
    );
  }

  if (selectedSlot) {
    return (
      <TimeSlotPicker
        slot={selectedSlot}
        estimatedPrice={estimatedPrice}
        serviceType={serviceType}
        selectedServiceIds={selectedServiceIds}
        customNote={customNote}
        onSuccess={handleSuccess}
        onCancel={() => setSelectedSlot(null)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left — service selector */}
      <PriceEstimator onSelectionChange={handleSelectionChange} />

      {/* Right — calendar */}
      <div className="flex flex-col gap-4">
        <BookingCalendar
          onSelectSlot={handleSelectSlot}
          selectedSlotId={selectedSlot ? (selectedSlot as TimeSlot).id : undefined}
        />
        {selectedServiceIds.length === 0 && (
          <p className="text-silver-dark text-xs text-center font-sans">
            Select at least one service on the left before picking a time slot.
          </p>
        )}
      </div>
    </div>
  );
}
