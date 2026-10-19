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
  service_type: string;
  selected_service_ids: number[];
  notes?: string;
  estimated_price: number;
}

export interface BookingResponse {
  id: string;
  slot_id?: string;
  status?: string;
  [key: string]: unknown;
}

export interface JoinTeamFormData {
  full_name: string;
  email: string;
  role_interest: string;
  portfolio_url: string;
  message: string;
}

export interface Photographer {
  id: number | string;
  name: string;
  imageUrl: string;
  altText: string;
  socialUrl: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readingTime: number;
  coverImage?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}