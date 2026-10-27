import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { byDateDesc, isPublished } from '../lib/contenu';
import { journalPublie } from '../lib/journal';
import { url } from '../lib/url';
import { DESCRIPTION_SITE, NOM_SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const revues = await getCollection('revues', isPublished);
  const journal = await journalPublie();

  const items = [
    ...revues.map((r) => ({
      data: r.data,
      titre: `[Revue] ${r.data.titre}`,
      link: url(`/revues/${r.id}/`),
      description: r.data.resume,
    })),
    ...journal.map(({ entree, projet }) => ({
      data: entree.data,
      titre: `[Journal · ${projet.data.titre}] ${entree.data.titre}`,
      link: url(`/journal/${entree.id}/`),
      description: undefined,
    })),
  ].sort(byDateDesc);

  return rss({
    title: NOM_SITE,
    description: DESCRIPTION_SITE,
    site: context.site!,
    customData: '<language>fr</language>',
    items: items.map((i) => ({
      title: i.titre,
      link: i.link,
      pubDate: i.data.date,
      description: i.description,
    })),
  });
}
