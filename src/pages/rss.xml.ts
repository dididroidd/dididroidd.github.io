import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { byDateDesc, isPublished } from '../lib/contenu';
import { url } from '../lib/url';
import { DESCRIPTION_SITE, NOM_SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const revues = await getCollection('revues', isPublished);
  const journal = await getCollection('journal', isPublished);

  const items = [
    ...revues.map((r) => ({
      data: r.data,
      titre: `[Revue] ${r.data.titre}`,
      link: url(`/revues/${r.id}/`),
      description: r.data.resume,
    })),
    ...(await Promise.all(
      journal.map(async (e) => {
        const projet = await getEntry(e.data.projet);
        return {
          data: e.data,
          titre: `[Journal · ${projet?.data.titre ?? e.data.projet.id}] ${e.data.titre}`,
          link: url(`/journal/${e.id}/`),
          description: undefined,
        };
      }),
    )),
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
