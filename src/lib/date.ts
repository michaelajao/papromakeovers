/**
 * Format a Date as `YYYY-MM-DD` using the browser/server's LOCAL timezone.
 * Replaces `.toISOString().slice(0, 10)` which silently shifts dates when the
 * local offset differs from UTC (e.g. an admin in BST at 23:30 seeing April 30
 * getting stored as May 1).
 */
export function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Format a Date as `YYYY-MM` in local time. */
export function toLocalMonthString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
