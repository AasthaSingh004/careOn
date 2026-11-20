/**
 * Date and time formatting utilities with explicit Asia/Kolkata (IST) timezone.
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Safely parses input into a valid Date object or returns null.
 * Handles ISO strings with/without timezone offsets and invalid values gracefully.
 */
export function parseDate(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'string') {
    const s = value.trim();
    if (!s) return null;
    // If it is an ISO string missing timezone offset, treat as UTC
    if (s.includes('T') && !s.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(s)) {
      const dt = new Date(`${s}Z`);
      if (!isNaN(dt.getTime())) return dt;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Format timestamp as IST time (e.g., "05:30 pm" or "05:30 PM").
 * Options can override default hour/minute formatting.
 */
export function formatISTTime(value, options = {}) {
  const d = parseDate(value);
  if (!d) return '';
  return d.toLocaleTimeString('en-IN', {
    timeZone: IST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

/**
 * Format timestamp as IST date-time (e.g., "10 May 2026, 05:30 pm").
 * Options can override default date/time formatting.
 */
export function formatISTDateTime(value, options = {}) {
  const d = parseDate(value);
  if (!d) return '';
  return d.toLocaleString('en-IN', {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

/**
 * Format timestamp as IST date-only (e.g., "10 May 2026").
 * Options can override default date formatting.
 */
export function formatISTDate(value, options = {}) {
  const d = parseDate(value);
  if (!d) return '';
  return d.toLocaleDateString('en-IN', {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}
