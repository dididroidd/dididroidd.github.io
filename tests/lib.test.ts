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
