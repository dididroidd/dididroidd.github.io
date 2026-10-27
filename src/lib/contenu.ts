export function isPublished(entry: { data: { draft?: boolean } }): boolean {
  return entry.data.draft !== true;
}

export function byDateDesc<T extends { data: { date: Date } }>(a: T, b: T): number {
  return b.data.date.getTime() - a.data.date.getTime();
}
