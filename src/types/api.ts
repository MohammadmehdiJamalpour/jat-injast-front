export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
  errors?: unknown;
};

export type MediaAsset = {
  id?: number | string;
  uuid?: string;
  image?: string;
  url?: string;
  alt?: string;
  is_main?: boolean;
};

export type HouseSummary = {
  id?: number | string;
  uuid: string;
  name: string;
  title?: string;
  city?: string;
  province?: string;
  price?: number;
  image?: string;
  main_image?: MediaAsset;
  status?: string | { key?: string; value?: string; label?: string; title?: string };
  structure?: string | { key?: string; value?: string; label?: string; title?: string };
  is_favorite?: boolean;
};

export type Destination = {
  id?: number | string;
  slug: string;
  label: string;
  city?: string;
  province?: string;
  lat?: number;
  lng?: number;
  image?: string;
};

export type HouseDetail = HouseSummary & {
  description?: string;
  images?: MediaAsset[];
  facilities?: unknown[];
  rooms?: unknown[];
  location?: {
    lat?: number;
    lng?: number;
    latitude?: number;
    longitude?: number;
  };
};

export type Reservation = {
  id?: number | string;
  uuid: string;
  house?: HouseSummary;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  total_price?: number;
};

export type Payment = {
  uuid: string;
  amount: number;
  method: "demo_card" | "demo_wallet" | string;
  status: "created" | "success" | "failed" | "pending" | "refunded" | string;
  tracking_code?: string;
  paid_at?: string | null;
};

export type WalletTransaction = {
  id?: number | string;
  amount?: number;
  price?: number;
  label?: string;
  description?: string;
  reference_type?: string;
  reference_uuid?: string;
  created_at?: string;
};

export type Ticket = {
  id: number | string;
  uuid?: string;
  subject: string;
  status?: string;
  priority?: string;
  department?: string | { id?: number | string; title?: string; name?: string };
  messages_count?: number;
  created_at?: string;
};

export type ChatAttachment = {
  id?: number | string;
  url?: string;
  file?: string;
  type?: "image" | "video" | "voice" | "file" | string;
  name?: string;
};

export type ChatMessage = {
  id?: number | string;
  uuid?: string;
  body?: string;
  message?: string;
  text?: string;
  sender?: string | { id?: number | string; name?: string; type?: string };
  created_at?: string;
  attachments?: ChatAttachment[];
};

export type CalendarDay = {
  date: string;
  day?: number;
  price?: number;
  status?: string;
  is_locked?: boolean;
  is_reserved?: boolean;
};

export type CalendarMonth = {
  year: number;
  month: number;
  title?: string;
  days: CalendarDay[];
};
