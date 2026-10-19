// In production, NEXT_PUBLIC_API_URL is "/api" (Nginx proxies /api → FastAPI on port 8000).
// In development, fall back to the direct localhost backend.
// Server-side Next.js rendering always needs an absolute URL, so we keep the
// internal localhost address as the SSR fallback regardless of the env value.
const BASE_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
    : "http://localhost:8000";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SlotRead {
  id: string;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
  reason_blocked?: string;
}

export interface BookingRead {
  id: string;
  slot_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  service_type: string;
  notes?: string;
  estimated_price: string;
  created_at: string;
}

export interface ApplicationRead {
  id: string;
  full_name: string;
  email: string;
  role_interest: string;
  portfolio_url?: string;
  message: string;
  created_at: string;
}

export interface ServiceRead {
  id: number;
  name: string;
  starting_price: number;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface SiteSettingsRead {
  phone: string;
  email: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  footer_bio: string;
  hero_title: string;
  hero_subtitle: string;
  hero_media_url: string;
  about_text: string;
  youtube_video_id: string;
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

async function adminFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; token: string }
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.token}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail ?? `API error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<string> {
  const body = new URLSearchParams({ username: email, password });
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "ngrok-skip-browser-warning": "true",
    },
    body: body.toString(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Invalid credentials" }));
    throw new Error(err.detail ?? "Login failed");
  }
  const data = await res.json();
  return data.access_token as string;
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export const adminApi = {
  // Slots
  getSlots: (month: string, token: string) =>
    adminFetch<SlotRead[]>(`/slots?month=${month}`, { token }),
  createSlot: (slot_date: string, slot_time: string, token: string) =>
    adminFetch<SlotRead>("/slots", { method: "POST", body: { slot_date, slot_time }, token }),
  blockSlot: (id: string, reason: string, token: string) =>
    adminFetch<SlotRead>(`/slots/${id}/block`, { method: "PATCH", body: { reason_blocked: reason }, token }),
  unblockSlot: (id: string, token: string) =>
    adminFetch<SlotRead>(`/slots/${id}/unblock`, { method: "PATCH", token }),
  deleteSlot: (id: string, token: string) =>
    adminFetch<void>(`/slots/${id}`, { method: "DELETE", token }),

  // Bookings
  getBookings: (token: string) =>
    adminFetch<BookingRead[]>("/bookings", { token }),

  // Applications
  getApplications: (token: string) =>
    adminFetch<ApplicationRead[]>("/applications", { token }),

  // Services
  getAllServices: (token: string) =>
    adminFetch<ServiceRead[]>("/services/all", { token }),
  createService: (data: Omit<ServiceRead, "id">, token: string) =>
    adminFetch<ServiceRead>("/services", { method: "POST", body: data, token }),
  updateService: (id: number, data: Partial<ServiceRead>, token: string) =>
    adminFetch<ServiceRead>(`/services/${id}`, { method: "PATCH", body: data, token }),
  deleteService: (id: number, token: string) =>
    adminFetch<void>(`/services/${id}`, { method: "DELETE", token }),

  // Site settings
  getSettings: (token: string) =>
    adminFetch<SiteSettingsRead>("/settings", { token }),
  updateSettings: (data: Partial<SiteSettingsRead>, token: string) =>
    adminFetch<SiteSettingsRead>("/settings", { method: "PATCH", body: data, token }),

  // Legacy YouTube
  updateYoutubeId: (youtube_video_id: string, token: string) =>
    adminFetch<{ youtube_video_id: string }>("/config/youtube", {
      method: "PATCH",
      body: { youtube_video_id },
      token,
    }),
};
