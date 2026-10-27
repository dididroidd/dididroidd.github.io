import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, test } from 'vitest';
import { idCourt } from '../src/lib/journal-format';
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
    const projets = html.indexOf('Ce que je fabrique');
    const revues = html.indexOf('La revue tech, le dimanche');
    expect(projets).toBeGreaterThan(-1);
    expect(revues).toBeGreaterThan(projets);
    expect(html).toContain('App de recueil');
  });

  test('page projet : journal listé, et lien retour depuis l\'entrée', () => {
    expect(read('projets/app-recueil/index.html')).toContain('Démarrage du journal');
    expect(read('journal/2026-10-26-demarrage/index.html')).toContain('href="/projets/app-recueil/"');
  });

  test('en-tête : nom, ville, photo, bascule de thème, GitHub, polices', () => {
    const html = read('index.html');
    expect(html).toContain('Didi');
    expect(html).toContain('Valence');
    expect(html).toMatch(/<img[^>]+class="avatar"/);
    expect(html).toContain('data-bascule-theme');
    expect(html).toContain('href="https://github.com/dididroidd"');
    expect(html).toContain('fonts.googleapis.com');
  });

  test('journal : identifiant court, type et résumé', () => {
    const id = idCourt('2026-10-26-demarrage');
    for (const page of ['index.html', 'projets/app-recueil/index.html', 'journal/2026-10-26-demarrage/index.html']) {
      const html = read(page);
      expect(html, page).toContain(id);
      expect(html, page).toContain('#avancée');
    }
    expect(read('projets/app-recueil/index.html')).toContain('octobre 2026');
  });

  test('projets classés par statut', () => {
    expect(read('projets/index.html')).toContain('en cours');
  });

  test('revue : numéro, en-tête de lettre, nombre de sujets', () => {
    const revue = read('revues/2026-s44/index.html');
    expect(revue).toContain('N°1');
    expect(revue).toContain(`Lettre hebdomadaire de Didi`);
    expect(revue).toContain('Valence, lundi 26 octobre 2026');
    expect(revue).toContain('2 sujets');
    const liste = read('revues/index.html');
    expect(liste).toContain('N°1');
    expect(liste).toContain('2 sujets');
  });

  test('entrée de journal : lien vers l\'entrée précédente', () => {
    buildWith(
      {
        'src/content/journal/__test-suite.md':
          '---\ntitre: Entrée suivante\ndate: 2026-10-28\nprojet: app-recueil\ntype: abandon\n---\nx\n',
      },
      () => {
        const html = read('journal/__test-suite/index.html');
        expect(html).toContain(idCourt('2026-10-26-demarrage'));
        expect(html).toContain('href="/journal/2026-10-26-demarrage/"');
        expect(html).toContain('#abandonnée');
      },
    );
  }, 120_000);

  test('un brouillon ne génère aucune page', () => {
    buildWith(
      {
        'src/content/journal/__test-brouillon.md':
          '---\ntitre: Brouillon secret\ndate: 2026-10-27\nprojet: app-recueil\ntype: idee\ndraft: true\n---\nx\n',
        'src/content/revues/__test-brouillon.md': '---\ntitre: Revue secrète\ndate: 2026-10-27\nnumero: 99\ndraft: true\n---\nx\n',
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
          '---\ntitre: Projet caché\nresume: x\nstatut: en-cours\ntechnos: []\ndepuis: 2026-01-01\ndraft: true\n---\nx\n',
      },
      () => {
        expect(exists('projets/__test-projet-brouillon/index.html')).toBe(false);
        expect(allText()).not.toContain('Projet caché');
      },
    );
  }, 120_000);

  test("le journal d'un projet en brouillon ne fuit pas", () => {
    buildWith(
      {
        'src/content/projets/__test-cache.md':
          '---\ntitre: Projet caché\nresume: x\nstatut: en-cours\ntechnos: []\ndepuis: 2026-01-01\ndraft: true\n---\nx\n',
        'src/content/journal/__test-pub.md':
          '---\ntitre: Entrée publiée\ndate: 2026-10-27\nprojet: __test-cache\ntype: avancee\n---\nx\n',
      },
      () => {
        expect(exists('journal/__test-pub/index.html')).toBe(false);
        const tout = allText();
        expect(tout).not.toContain('Projet caché');
        expect(tout).not.toContain('Entrée publiée');
        expect(tout).not.toContain('/projets/__test-cache/');
      },
    );
  }, 120_000);

  test('projet sans journal', () => {
    buildWith(
      {
        'src/content/projets/__test-vide.md':
          '---\ntitre: Projet vide\nresume: x\nstatut: en-pause\ntechnos: []\ndepuis: 2026-01-01\n---\nx\n',
      },
      () => {
        expect(read('projets/__test-vide/index.html').replaceAll('&#39;', "'")).toContain("Pas encore d'entrée.");
      },
    );
  }, 120_000);
});
