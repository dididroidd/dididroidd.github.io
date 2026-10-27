import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const DIST = 'dist';

export function build(): void {
  execSync('npx astro build', { stdio: 'pipe' });
}

/** Construit le site avec des fichiers de contenu temporaires, puis les supprime. */
export function buildWith(files: Record<string, string>, check: () => void): void {
  for (const [f, c] of Object.entries(files)) writeFileSync(f, c);
  try {
    build();
    check();
  } finally {
    for (const f of Object.keys(files)) rmSync(f, { force: true });
  }
}

export function read(path: string): string {
  return readFileSync(join(DIST, path), 'utf8');
}

export function exists(path: string): boolean {
  return existsSync(join(DIST, path));
}

export function htmlFiles(dir = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && e.name.endsWith('.html'))
    .map((e) => join(e.parentPath, e.name));
}

export function allText(): string {
  return readdirSync(DIST, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && /\.(html|xml)$/.test(e.name))
    .map((e) => readFileSync(join(e.parentPath, e.name), 'utf8'))
    .join('\n');
}
