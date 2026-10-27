export const STATUTS = {
  'en-cours': { label: 'en cours', symbole: '●' },
  'en-pause': { label: 'en pause', symbole: '◐' },
  termine: { label: 'terminé', symbole: '○' },
} as const;

export type Statut = keyof typeof STATUTS;
