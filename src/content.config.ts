import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projets' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      resume: z.string(),
      statut: z.enum(['en-cours', 'en-pause', 'termine']),
      technos: z.array(z.string()),
      depuis: z.coerce.date(),
      ordre: z.number().default(100),
      liens: z
        .object({
          demo: z.url().optional(),
          code: z.url().optional(),
        })
        .optional(),
      image: image().optional(),
      draft: z.boolean().default(false),
    }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    titre: z.string(),
    date: z.coerce.date(),
    projet: reference('projets'),
    type: z.enum(['avancee', 'idee', 'abandon', 'afaire']),
    resume: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const revues = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/revues' }),
  schema: z.object({
    titre: z.string(),
    date: z.coerce.date(),
    numero: z.number().int().positive(),
    resume: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projets, journal, revues };
