// In production, NEXT_PUBLIC_API_URL is "/api" (Nginx proxies /api → FastAPI on port 8000).
// SSR (server-side) needs an absolute URL, so always use localhost:8000 on the server side.
const BASE_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
    : "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  tags?: string[];
  revalidate?: number;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, token, tags, revalidate } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail ?? `API error: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface PublicService {
  id: number;
  name: string;
  starting_price: number;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface PublicSettings {
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

// ─── Public API ───────────────────────────────────────────────────────────────

export const api = {
  getYoutubeVideoId: () =>
    apiFetch<{ youtube_video_id: string }>("/config/youtube", { revalidate: 300 }),

  getSiteSettings: () =>
    apiFetch<PublicSettings>("/settings", { revalidate: 60, tags: ["settings"] }),

  getServices: () =>
    apiFetch<PublicService[]>("/services", { revalidate: 60, tags: ["services"] }),

  getSlots: (month: string) =>
    apiFetch<
      Array<{
        id: string;
        slot_date: string;
        slot_time: string;
        is_available: boolean;
        reason_blocked?: string;
      }>
    >(`/slots?month=${month}`, { revalidate: 60, tags: ["slots"] }),

  createBooking: (data: import("@/types").BookingFormData) =>
    apiFetch<import("@/types").BookingResponse>("/bookings", {
      method: "POST",
      body: data,
    }),

  submitApplication: (data: import("@/types").JoinTeamFormData) =>
    apiFetch<{ id: string }>("/applications", { method: "POST", body: data }),
};
