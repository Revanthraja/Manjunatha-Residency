// Formatting helpers — Indian rupee grouping and human dates, matching the
// "₹1,64,900" / "3 Oct 2026" style used throughout the mockups.

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹1,64,900 (no paise — the app deals in whole rupees). */
export function formatRupees(amount: number | null | undefined): string {
  const n = Math.round(amount ?? 0);
  return n < 0 ? `−₹${inr.format(-n)}` : `₹${inr.format(n)}`;
}

/** 1,64,900 — grouped digits without the currency symbol. */
export function formatNumber(n: number | null | undefined): string {
  return inr.format(Math.round(n ?? 0));
}

/** "3 Oct 2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "3 Oct" — for compact rows. */
export function formatDayMonth(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** "October 2026" from a bills.month date (always the 1st of the month). */
export function formatMonth(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

/** YYYY-MM-01 for "this month", used when creating bills / filtering expenses. */
export function firstOfMonth(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
}

/** 0 → "Ground floor", 1 → "1st floor", 2 → "2nd floor", … */
export function formatFloor(floor: number): string {
  if (floor === 0) return 'Ground floor';
  const suffix = floor % 10 === 1 && floor !== 11 ? 'st' : floor % 10 === 2 && floor !== 12 ? 'nd' : floor % 10 === 3 && floor !== 13 ? 'rd' : 'th';
  return `${floor}${suffix} floor`;
}

export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
