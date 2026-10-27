import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, test } from 'vitest';
import { build, buildWith, exists, htmlFiles, read, allText } from './helpers';

describe('pages', () => {
  beforeAll(() => build(), 120_000);

  test('toutes les routes existent', () => {
    for (const p of [
      'index.html',
      'projets/index.html',
      'projets/app-recueil/index.html',
      'journal/2026-10-26-demarrage/index.html',
      'revues/index.html',
      'revues/2026-s44/index.html',
      'a-propos/index.html',
      '404.html',
    ]) {
      expect(exists(p), p).toBe(true);
    }
  });

  test('aucun lien interne cassé', () => {
    for (const f of htmlFiles()) {
      const html = readFileSync(f, 'utf8');
      for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
        if (href.startsWith('//') || href.startsWith('/_astro/')) continue;
        const cible = href.replace(/^\//, '');
        const ok = cible === '' || cible.endsWith('/') ? exists(cible + 'index.html') : exists(cible);
        expect(ok, `${f} → ${href}`).toBe(true);
      }
    }
  });

  test('html en français', () => {
    expect(read('index.html')).toContain('<html lang="fr"');
  });

  test('accueil : projets avant revues', () => {
    const html = read('index.html');
    const projets = html.indexOf('Projets');
    const revues = html.indexOf('Dernières revues tech');
    expect(projets).toBeGreaterThan(-1);
    expect(revues).toBeGreaterThan(projets);
    expect(html).toContain('App de recueil');
  });

  test('page projet : journal listé, et lien retour depuis l\'entrée', () => {
    expect(read('projets/app-recueil/index.html')).toContain('Démarrage du journal');
    expect(read('journal/2026-10-26-demarrage/index.html')).toContain('href="/projets/app-recueil/"');
  });

  test('un brouillon ne génère aucune page', () => {
    buildWith(
      {
        'src/content/journal/__test-brouillon.md':
          '---\ntitre: Brouillon secret\ndate: 2026-10-27\nprojet: app-recueil\ndraft: true\n---\nx\n',
        'src/content/revues/__test-brouillon.md': '---\ntitre: Revue secrète\ndate: 2026-10-27\ndraft: true\n---\nx\n',
      },
      () => {
        expect(exists('journal/__test-brouillon/index.html')).toBe(false);
        expect(exists('revues/__test-brouillon/index.html')).toBe(false);
        const tout = allText();
        expect(tout).not.toContain('Brouillon secret');
        expect(tout).not.toContain('Revue secrète');
      },
    );
  }, 120_000);

  test('un projet en brouillon ne génère aucune page', () => {
    buildWith(
      {
        'src/content/projets/__test-projet-brouillon.md':
          '---\ntitre: Projet caché\nresume: x\nstatut: en-cours\ntechnos: []\ndraft: true\n---\nx\n',
      },
      () => {
        expect(exists('projets/__test-projet-brouillon/index.html')).toBe(false);
        expect(allText()).not.toContain('Projet caché');
      },
    );
  }, 120_000);

  test('projet sans journal', () => {
    buildWith(
      {
        'src/content/projets/__test-vide.md':
          '---\ntitre: Projet vide\nresume: x\nstatut: en-pause\ntechnos: []\n---\nx\n',
      },
      () => {
        expect(read('projets/__test-vide/index.html').replaceAll('&#39;', "'")).toContain("Pas encore d'entrée.");
      },
    );
  }, 120_000);
});
