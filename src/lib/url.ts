/** Préfixe un chemin interne avec la base du site (`base` dans astro.config.mjs). */
export function url(path: string, base: string = import.meta.env.BASE_URL): string {
  const b = base.endsWith('/') ? base : base + '/';
  return b + path.replace(/^\/+/, '');
}
