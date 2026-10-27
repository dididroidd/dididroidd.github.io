import { test, expect } from 'vitest';
import { isPublished, byDateDesc } from '../src/lib/contenu';
import { url } from '../src/lib/url';
import { formatDate } from '../src/lib/date';

const d = (s: string) => ({ data: { date: new Date(s) } });

test('isPublished', () => {
  expect(isPublished({ data: {} })).toBe(true);
  expect(isPublished({ data: { draft: false } })).toBe(true);
  expect(isPublished({ data: { draft: true } })).toBe(false);
});

test('byDateDesc', () => {
  const tri = [d('2026-01-01'), d('2026-03-01')].sort(byDateDesc);
  expect(tri.map((x) => x.data.date.toISOString().slice(0, 10))).toEqual(['2026-03-01', '2026-01-01']);
});

test('formatDate ne décale pas le jour', () => {
  expect(formatDate(new Date('2026-10-26'))).toBe('26 octobre 2026');
});

test('url', () => {
  expect(url('/projets/', '/')).toBe('/projets/');
  expect(url('', '/')).toBe('/');
  expect(url('/projets/', '/blog/')).toBe('/blog/projets/');
  expect(url('projets/', '/blog')).toBe('/blog/projets/');
});

import { idCourt, tempsLecture } from '../src/lib/journal-format';
import { formatDateCourte, formatDateLongue, formatMois } from '../src/lib/date';

test('idCourt : 6 caractères hexadécimaux, stable, différent selon l\'entrée', () => {
  const a = idCourt('2026-10-26-demarrage');
  expect(a).toMatch(/^[0-9a-f]{6}$/);
  expect(idCourt('2026-10-26-demarrage')).toBe(a);
  expect(idCourt('2026-10-27-autre')).not.toBe(a);
});

test('tempsLecture : au moins 1 min, ~200 mots par minute', () => {
  expect(tempsLecture('')).toBe(1);
  expect(tempsLecture('mot '.repeat(450))).toBe(3);
});

test('formats de date', () => {
  const d = new Date('2026-10-26');
  expect(formatDateCourte(d)).toBe('26 oct. 2026');
  expect(formatDateLongue(d)).toBe('lundi 26 octobre 2026');
  expect(formatMois(d)).toBe('octobre 2026');
});

test('byDateDesc départage les dates égales par id décroissant', () => {
  const e = (id: string) => ({ id, data: { date: new Date('2026-10-28') } });
  expect([e('2026-10-28-a'), e('2026-10-28-b')].sort(byDateDesc).map((x) => x.id)).toEqual([
    '2026-10-28-b',
    '2026-10-28-a',
  ]);
});
