import { createHash } from 'node:crypto';

/** Les quatre types d'entrée de journal, avec leur symbole façon git log et leur étiquette. */
export const TYPES_JOURNAL = {
  avancee: { symbole: '+', tag: 'avancée' },
  idee: { symbole: '?', tag: 'idée' },
  abandon: { symbole: '−', tag: 'abandonnée' },
  afaire: { symbole: '□', tag: 'à-faire' },
} as const;

export type TypeJournal = keyof typeof TYPES_JOURNAL;

/** Identifiant court façon commit, dérivé de l'id de l'entrée (stable d'un build à l'autre). */
export function idCourt(id: string): string {
  return createHash('sha1').update(id).digest('hex').slice(0, 6);
}

/** Temps de lecture en minutes (200 mots par minute, au moins 1). */
export function tempsLecture(texte: string): number {
  const mots = texte.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(mots / 200));
}
