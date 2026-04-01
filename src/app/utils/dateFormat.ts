// utils/dateFormat.ts
export const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}

export const LOCALE = 'es-AR'

export function formatDate(date: Date | string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleString(LOCALE, DATE_FORMAT)
}