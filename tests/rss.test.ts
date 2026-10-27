import { describe, expect, test } from 'vitest';
import { buildWith, exists, read } from './helpers';

describe('rss', () => {
  test('le flux liste revues et journal, sans les brouillons', () => {
    buildWith(
      {
        'src/content/revues/__test-brouillon.md': '---\ntitre: Revue secrète\ndate: 2026-10-27\nnumero: 99\ndraft: true\n---\nx\n',
      },
      () => {
        expect(exists('rss.xml')).toBe(true);
        const xml = read('rss.xml');
        expect(xml).toContain('https://dididroidd.github.io/revues/2026-s44/');
        expect(xml).toContain('https://dididroidd.github.io/journal/2026-10-26-demarrage/');
        expect(xml).toContain('[Journal · App de recueil]');
        expect(xml).toContain('[Revue]');
        expect(xml).not.toContain('Revue secrète');
      },
    );
  }, 120_000);

  test('les pages annoncent le flux', () => {
    expect(read('index.html')).toContain('type="application/rss+xml"');
  });
});
