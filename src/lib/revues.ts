import { render, type CollectionEntry } from 'astro:content';

/** Nombre de sujets d'une revue : ses titres de niveau 2, sauf « En bref ». */
export async function nombreSujets(revue: CollectionEntry<'revues'>): Promise<number> {
  const { headings } = await render(revue);
  return headings.filter((h) => h.depth === 2 && h.slug !== 'en-bref').length;
}

export function libelleSujets(n: number): string {
  return `${n} ${n > 1 ? 'sujets' : 'sujet'}`;
}
