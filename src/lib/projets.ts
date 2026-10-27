import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './contenu';

/** Les projets publiés, dans l'ordre d'affichage (champ `ordre`). */
export async function projetsPublies(): Promise<CollectionEntry<'projets'>[]> {
  return (await getCollection('projets', isPublished)).sort((a, b) => a.data.ordre - b.data.ordre);
}
