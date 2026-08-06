"use client";

import { useState, useEffect } from "react";
import { adminApi, BookingRead } from "@/lib/adminApi";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") ?? "";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.getBookings(getToken())
      .then(setBookings)
      .catch(e => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-white text-2xl">Bookings</h1>
        <p className="text-silver text-sm mt-1">All client booking requests</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-400 text-sm">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="bg-background-secondary border border-border rounded-xl p-12 text-center">
          <p className="text-silver">No bookings yet.</p>
        </div>
      ) : (
        <div className="bg-background-secondary border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Client", "Email", "Phone", "Service", "Price", "Booked On"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-silver-dark font-display text-xs uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-background/30"}`}>
                  <td className="px-5 py-3 text-brand-white font-sans font-medium">{b.client_name}</td>
                  <td className="px-5 py-3 text-silver font-sans">
                    <a href={`mailto:${b.client_email}`} className="hover:text-gold transition-colors">{b.client_email}</a>
                  </td>
                  <td className="px-5 py-3 text-silver font-sans">{b.client_phone ?? "—"}</td>
                  <td className="px-5 py-3 text-silver font-sans">{b.service_type}</td>
                  <td className="px-5 py-3 text-gold font-sans font-semibold">${b.estimated_price}</td>
                  <td className="px-5 py-3 text-silver-dark font-sans">{formatDate(b.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
