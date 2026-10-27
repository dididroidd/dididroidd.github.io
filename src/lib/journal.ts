import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { isPublished } from './contenu';

/**
 * Les entrées de journal publiées, avec leur projet. Une entrée dont le projet est en
 * brouillon est écartée ; une entrée dont le projet n'existe pas fait échouer le build.
 */
export async function journalPublie(): Promise<
  { entree: CollectionEntry<'journal'>; projet: CollectionEntry<'projets'> }[]
> {
  const entrees = await getCollection('journal', isPublished);
  const avecProjet = await Promise.all(
    entrees.map(async (entree) => {
      const projet = await getEntry(entree.data.projet);
      if (!projet) {
        throw new Error(
          `L'entrée de journal "${entree.id}" pointe vers le projet "${entree.data.projet.id}", qui n'existe pas dans src/content/projets/.`,
        );
      }
      return { entree, projet };
    }),
  );
  return avecProjet.filter(({ projet }) => isPublished(projet));
}
