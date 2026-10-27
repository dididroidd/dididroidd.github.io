export function isPublished(entry: { data: { draft?: boolean } }): boolean {
  return entry.data.draft !== true;
}

/** Du plus récent au plus ancien ; à date égale, par id décroissant (les fichiers commencent par la date). */
export function byDateDesc<T extends { id?: string; data: { date: Date } }>(a: T, b: T): number {
  return b.data.date.getTime() - a.data.date.getTime() || (b.id ?? '').localeCompare(a.id ?? '');
}
