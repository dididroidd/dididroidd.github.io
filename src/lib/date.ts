// Toutes les dates sont formatées en UTC : une date « 2026-10-26 » du frontmatter reste le 26.
const fr = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'UTC' });

const format = fr({ day: 'numeric', month: 'long', year: 'numeric' });
const courte = fr({ day: 'numeric', month: 'short', year: 'numeric' });
const longue = fr({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const mois = fr({ month: 'long', year: 'numeric' });

export function formatDate(d: Date): string {
  return format.format(d);
}

export function formatDateCourte(d: Date): string {
  return courte.format(d);
}

export function formatDateLongue(d: Date): string {
  return longue.format(d);
}

export function formatMois(d: Date): string {
  return mois.format(d);
}
