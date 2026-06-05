import { fa } from "../i18n/fa";

const asObject = (value) => (value && typeof value === "object" ? value : {});
const asArray = (value) => (Array.isArray(value) ? value : []);
const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null);
const asBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    return ["1", "true", "yes"].includes(value.trim().toLowerCase());
  }
  return false;
};

const normalizeLabel = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.label || value.title || value.name || value.value || value.key || fallback;
};

export function normalizeHouseSummary(input = {}) {
  const house = asObject(input);
  const mainImage = asObject(house.main_image || house.mainImage);
  const images = asArray(house.images || house.medias || house.media);
  const firstImage = asObject(images[0]);

  return {
    id: house.id,
    uuid: String(firstDefined(house.uuid, house.code, house.id, "")),
    name: normalizeLabel(firstDefined(house.name, house.title), fa.common.fields.unknown),
    title: normalizeLabel(firstDefined(house.title, house.name), fa.common.fields.unknown),
    city: normalizeLabel(firstDefined(house.city, house.city_name, house.location?.city)),
    province: normalizeLabel(firstDefined(house.province, house.province_name, house.location?.province)),
    price: Number(firstDefined(house.price, house.price_per_night, house.base_price, 0)) || 0,
    image: firstDefined(
      house.image,
      house.cover,
      house.thumbnail,
      mainImage.image,
      mainImage.url,
      firstImage.image,
      firstImage.url,
      "",
    ),
    main_image: house.main_image || house.mainImage || firstImage || null,
    status: normalizeLabel(house.status, house.status || ""),
    structure: normalizeLabel(firstDefined(house.structure, house.type, house.house_type)),
    is_favorite: asBoolean(firstDefined(house.is_favorite, house.isFavorite, house.favorite, false)),
  };
}

export function normalizeReservation(input = {}) {
  const reservation = asObject(input);

  return {
    id: reservation.id,
    uuid: String(firstDefined(reservation.uuid, reservation.code, reservation.id, "")),
    house: reservation.house ? normalizeHouseSummary(reservation.house) : null,
    status: normalizeLabel(reservation.status, ""),
    payment_status: normalizeLabel(firstDefined(reservation.payment_status, reservation.payment?.status), ""),
    date_from: firstDefined(reservation.date_from, reservation.from_date, reservation.check_in, ""),
    date_to: firstDefined(reservation.date_to, reservation.to_date, reservation.check_out, ""),
    total_price: Number(firstDefined(reservation.total_price, reservation.amount, reservation.price, 0)) || 0,
    raw: reservation,
  };
}

export function normalizeTicket(input = {}) {
  const ticket = asObject(input);
  const department = asObject(ticket.department);

  return {
    id: firstDefined(ticket.id, ticket.uuid, ""),
    uuid: ticket.uuid,
    subject: normalizeLabel(firstDefined(ticket.subject, ticket.title), fa.common.fields.unknown),
    status: normalizeLabel(ticket.status, ""),
    priority: normalizeLabel(ticket.priority, ""),
    department: normalizeLabel(firstDefined(department.title, department.name, ticket.department), ""),
    messages_count: Number(firstDefined(ticket.messages_count, ticket.message_count, ticket.messages?.length, 0)) || 0,
    created_at: firstDefined(ticket.created_at, ticket.created, ticket.date, ""),
    raw: ticket,
  };
}

export function normalizeChatMessage(input = {}) {
  const message = asObject(input);
  const sender = asObject(message.sender || message.user);

  return {
    id: firstDefined(message.id, message.uuid, ""),
    uuid: message.uuid,
    body: firstDefined(message.body, message.message, message.text, ""),
    sender: {
      id: sender.id,
      name: normalizeLabel(firstDefined(sender.name, sender.full_name, message.sender_name), fa.common.fields.unknown),
      type: normalizeLabel(firstDefined(sender.type, sender.role, message.sender_type), ""),
    },
    created_at: firstDefined(message.created_at, message.created, message.date, ""),
    attachments: asArray(message.attachments || message.files).map((attachment) => {
      const item = asObject(attachment);
      return {
        id: firstDefined(item.id, item.uuid, ""),
        url: firstDefined(item.url, item.file, item.src, ""),
        type: normalizeLabel(firstDefined(item.type, item.kind), "file"),
        name: normalizeLabel(firstDefined(item.name, item.filename), fa.common.fields.file),
      };
    }),
    raw: message,
  };
}

export function normalizeWalletTransaction(input = {}) {
  const tx = asObject(input);

  return {
    id: firstDefined(tx.id, tx.uuid, ""),
    amount: Number(firstDefined(tx.amount, tx.price, tx.value, 0)) || 0,
    label: normalizeLabel(firstDefined(tx.label, tx.title, tx.type), fa.common.fields.unknown),
    description: firstDefined(tx.description, tx.detail, ""),
    reference_type: firstDefined(tx.reference_type, tx.ref_type, ""),
    reference_uuid: firstDefined(tx.reference_uuid, tx.ref_uuid, ""),
    created_at: firstDefined(tx.created_at, tx.created, tx.date, ""),
    raw: tx,
  };
}

export function normalizeCalendarMonth(input = {}) {
  const month = asObject(input);

  return {
    year: Number(firstDefined(month.year, month.jalali_year, 0)) || 0,
    month: Number(firstDefined(month.month, month.jalali_month, 0)) || 0,
    title: normalizeLabel(firstDefined(month.title, month.name), ""),
    days: asArray(month.days).map((day) => {
      const item = asObject(day);
      return {
        date: firstDefined(item.date, item.day, item.value, ""),
        day: Number(firstDefined(item.day_number, item.number, item.day, 0)) || 0,
        price: Number(firstDefined(item.price, item.amount, 0)) || 0,
        status: normalizeLabel(item.status, ""),
        is_locked: asBoolean(firstDefined(item.is_locked, item.locked, item.disabled, false)),
        is_reserved: asBoolean(firstDefined(item.is_reserved, item.reserved, false)),
        raw: item,
      };
    }),
    raw: month,
  };
}
