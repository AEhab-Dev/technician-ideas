
  import type { Metadata } from "next";
  import BookingClient from "./BookingClient";

  export const metadata: Metadata = {
    title: "Book a Session",
    description:
      "Book a photography session with Technician Ideas. View available slots, estimate your price, and reserve your appointment — no payment required online.",
  };

  export default function BookingPage() {
    return (
      <div className="min-h-screen bg-background pt-20 md:pt-24">
        <div className="section-padding">
          <div className="content-width">

            {/* Page header */}
            <div className="mb-10md:mb-14">
              <p className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-3">
                Schedule a Session
              </p>
              <h1 className="font-display font-bold text-brand-white mb-4">
                Book an{" "}
                <span className="text-gold-gradient">Appointment</span>
              </h1>
              <div className="divider-gold w-24 mb-6" aria-hidden="true" />
              <p className="text-silver max-w-xl text-base leading-relaxed">
                Use the estimator to understand your costs, pick a date and time
                that works for you, and lock in your slot. No payment collected
                online — we confirm everything directly.
              </p>
            </div>

            <BookingClient />
          </div>
        </div>
      </div>
    );
  }
