import { execSync } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { test, expect } from 'vitest';

test('une entrée de journal vers un projet inconnu fait échouer le build', () => {
  const f = 'src/content/journal/__test-orphelin.md';
  writeFileSync(f, '---\ntitre: x\ndate: 2026-10-26\nprojet: projet-inexistant\n---\nx\n');
  try {
    expect(() => execSync('npx astro build', { stdio: 'pipe' })).toThrow(/projet-inexistant/);
  } finally {
    rmSync(f);
  }
}, 120_000);
