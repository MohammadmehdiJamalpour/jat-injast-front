export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  errors?: unknown;
};

export type ApiListMeta = {
  count?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
};

export type ApiId = number | string;

export type LabelValue = {
  key?: string;
  value?: string;
  label?: string;
  title?: string;
  name?: string;
};

export type MediaAsset = {
  id?: ApiId;
  uuid?: string;
  image?: string;
  url?: string;
  media?: string;
  alt?: string;
  is_main?: boolean;
};

export type HouseVote = {
  total_vote: number;
  count: number;
};

export type HouseSummary = {
  id?: ApiId;
  uuid: string;
  name: string;
  title?: string;
  city?: string;
  province?: string;
  price?: number;
  image?: string;
  main_image?: MediaAsset;
  status?: string | LabelValue;
  structure?: string | LabelValue;
  vote?: HouseVote | number | null;
  is_favorite?: boolean;
};

export type Destination = {
  id?: ApiId;
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
  id?: ApiId;
  uuid: string;
  house?: HouseSummary;
  status?: string | LabelValue;
  payment_status?: string | LabelValue;
  date_from?: string;
  date_to?: string;
  total_price?: number;
  payment?: Payment;
  invoice?: { total?: number };
};

export type PaymentMethod = "sandbox_card" | "sandbox_wallet";
export type PaymentScenario = "success" | "failed" | "pending" | string;

export type Payment = {
  uuid: string;
  amount: number;
  reservation_uuid?: string;
  method: PaymentMethod | string;
  method_label?: string;
  status: "created" | "success" | "failed" | "pending" | "refunded" | string;
  failure_reason?: string;
  tracking_code?: string;
  paid_at?: string | null;
};

export type WalletBank = {
  id?: ApiId;
  name?: string;
  title?: string;
  code?: string;
};

export type WalletCard = {
  id?: ApiId;
  uuid?: string;
  bank?: WalletBank | string;
  card_number?: string;
  iban?: string;
  is_default?: boolean;
};

export type WalletWithdraw = {
  id?: ApiId;
  uuid?: string;
  amount?: number;
  status?: string | LabelValue;
  card?: WalletCard;
  created_at?: string;
};

export type WalletTransaction = {
  id?: ApiId;
  amount?: number;
  price?: number;
  label?: string;
  description?: string;
  reference_type?: string;
  reference_uuid?: string;
  created_at?: string;
};

export type WalletChargePayload = {
  amount: number;
  gateway?: string;
};

export type WalletCardPayload = Record<string, unknown>;
export type WalletWithdrawPayload = Record<string, unknown>;

export type TicketDepartment = {
  id?: ApiId;
  title?: string;
  name?: string;
  label?: string;
};

export type Ticket = {
  id: ApiId;
  uuid?: string;
  subject: string;
  status?: string;
  status_detail?: LabelValue;
  priority?: string | LabelValue;
  department?: string | TicketDepartment;
  department_detail?: TicketDepartment;
  messages_count?: number;
  messages?: ChatMessage[];
  can_replay?: boolean;
  created_at?: string;
};

export type ChatAttachment = {
  id?: ApiId;
  url?: string;
  file?: string;
  type?: "image" | "video" | "voice" | "file" | string;
  name?: string;
};

export type ChatMessage = {
  id?: ApiId;
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

export type CalendarOperationResponse = CalendarMonth | CalendarMonth[] | CalendarDay[] | Record<string, unknown>;

export type HouseRoomPayload = Record<string, unknown>;
export type HouseRoom = {
  id?: ApiId;
  uuid?: string;
  name?: string;
  title?: string;
  capacity?: number;
  price?: number;
};

export type HouseDocumentPayload = {
  document_type: string;
  document: string | Blob;
};

export type ReservationPayload = {
  house_uuid?: string;
  check_in: string | Date | null;
  check_out: string | Date | null;
  num_guests?: number;
  room_uuid?: string;
};

export type ReservationPreInvoice = {
  total?: number;
  total_price?: number;
  nights?: number;
  items?: unknown[];
};

export type AdminResource = Record<string, unknown>;

export type DateLike =
  | string
  | Date
  | {
      year?: number;
      month?: number;
      day?: number;
      gregorianDate?: Date | string;
    };

export type HouseSearchFilters = {
  dateRange?: { from?: DateLike | null; to?: DateLike | null };
  people?: number;
  price?: [number, number] | number[];
  bedsRooms?: {
    bedrooms?: number;
    beds?: number;
    rooms?: number;
    bathrooms?: number;
  };
  propertyViews?: string[];
  structureType?: string[];
  region?: string[];
  ownershipType?: string[];
  amenities?: string[];
  rules?: string[];
  propertyType?: string[];
  city_id?: ApiId;
  cityId?: ApiId;
  province_id?: ApiId;
  provinceId?: ApiId;
  zone_id?: ApiId;
  zoneId?: ApiId;
  city?: string;
  province?: string;
  place?: string;
};

export type HouseSearchOptions = {
  sort?: string;
  page?: number;
  perPage?: number;
  signal?: AbortSignal;
};

export type HouseSearchPayload = Record<string, unknown>;

export type HouseSearchApiItem = Omit<HouseSummary, "price"> & {
  galleries?: MediaAsset[];
  vote?: HouseVote | number | null;
  price?: number | { initial?: number; final?: number };
  is_special?: boolean;
  address?: {
    address?: string;
    city?: {
      name?: string;
      latitude?: number | string;
      longitude?: number | string;
      province?: { name?: string };
    };
    geography?: {
      latitude?: number | string;
      longitude?: number | string;
    };
  };
};

export type HouseSearchResult = {
  items?: HouseSearchApiItem[];
  meta?: Record<string, unknown>;
  links?: Record<string, unknown>;
};
