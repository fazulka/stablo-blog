/**
 * Slovak-locale formatting helpers — used across cards, pages, and emails.
 */

const dateFormatter = new Intl.DateTimeFormat("sk-SK", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

const dateShortFormatter = new Intl.DateTimeFormat("sk-SK", {
  day: "numeric",
  month: "short"
});

const timeFormatter = new Intl.DateTimeFormat("sk-SK", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

const weekdayFormatter = new Intl.DateTimeFormat("sk-SK", {
  weekday: "long"
});

const priceFormatter = new Intl.NumberFormat("sk-SK", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export function formatSessionDate(value) {
  if (!value) return "";
  const date = new Date(value);
  const weekday = weekdayFormatter.format(date);
  const day = dateShortFormatter.format(date);
  const time = timeFormatter.format(date);
  return `${weekday} ${day} · ${time}`;
}

export function formatLongDate(value) {
  if (!value) return "";
  return dateFormatter.format(new Date(value));
}

export function formatTimeRange(start, end) {
  if (!start) return "";
  const s = timeFormatter.format(new Date(start));
  if (!end) return s;
  return `${s} – ${timeFormatter.format(new Date(end))}`;
}

export function formatPrice(value) {
  if (value == null) return "";
  return priceFormatter.format(value);
}
