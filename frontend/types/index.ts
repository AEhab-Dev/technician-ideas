// ─── Photographer ─────────────────────────────────────────────────────────────
export interface Photographer {
  id: string;
  name: string;
  imageUrl: string;
  socialUrl: string;
  altText: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  coverImage?: string;
  readingTime: number;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  coverImage?: string;
  readingTime: number;
}

// ─── Services ─────────────────────────────────────────────────────────────────
export interface ServiceItem {
  id: number;
  name: string;
  starting_price: number;
  description: string;
  is_active: boolean;
  sort_order: number;
}

// ─── Booking ──────────────────────────────────────────────────────────────────
export interface TimeSlot {
  id: string;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
  reason_blocked?: string;
}

export interface BookingFormData {
  slot_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  service_type: string;            // comma-joined display string
  selected_service_ids: number[];  // array of service IDs
  notes?: string;
  estimated_price: number;
}

export interface BookingResponse {
  id: string;
  slot_id: string;
  created_at: string;
}

// ─── Site settings ────────────────────────────────────────────────────────────
export interface SiteSettings {
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

// ─── Application ──────────────────────────────────────────────────────────────
export interface JoinTeamFormData {
  full_name: string;
  email: string;
  role_interest: string;
  portfolio_url?: string;
  message: string;
}

export interface JoinTeamResponse {
  id: string;
  created_at: string;
}
