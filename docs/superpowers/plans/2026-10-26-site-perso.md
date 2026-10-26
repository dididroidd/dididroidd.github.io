# Site perso Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un site statique Astro (portfolio + journal de bord par projet + revue tech) écrit en Markdown, déployé gratuitement sur GitHub Pages quand un tag est poussé.

**Architecture:** Trois collections de contenu Astro (`projets`, `journal`, `revues`) en Markdown dans `src/content/`, validées par des schémas zod. Les petites fonctions pures (filtrage des brouillons, tri, URL avec base, dates) vivent dans `src/lib/` et sont testées unitairement avec Vitest. Les pages sont vérifiées par des tests qui lisent le HTML produit dans `dist/` après `astro build`. Le thème reste minimal tant que la maquette 3a n'est pas dans `design/`.

**Tech Stack:** Node 24, Astro 5, TypeScript strict, Vitest, `@astrojs/rss`, GitHub Actions (`actions/deploy-pages`).

**Spec:** `docs/superpowers/specs/2026-10-26-site-perso-design.md`

## Global Constraints

- Tout le texte visible du site est en français (`<html lang="fr">`). La structure ne doit pas bloquer une future version anglaise, mais on ne construit pas d'i18n.
- Le dépôt est `dididroidd/ash_site`, donc le site est servi sur `https://dididroidd.github.io/ash_site/`. Dans `astro.config.mjs`, on met `site: "https://dididroidd.github.io"` et `base: "/ash_site"`. **Tous les liens internes passent par `url()`** (Task 2), jamais un `/` en dur.
- Le déploiement se fait **uniquement** quand un tag `v*` est poussé. Un push sur `main` ne publie rien.
- Un contenu avec `draft: true` n'apparaît nulle part dans `dist/` : ni page, ni lien, ni RSS.
- Pas de comptes, pas de commentaires, pas de newsletter, pas d'interface d'administration.
- Le contenu est rendu en Markdown avec la coloration du code (Shiki, thèmes clair et sombre). Le mode sombre suit `prefers-color-scheme`.
- L'accueil met les projets en avant. La revue tech y reste secondaire : elle vient après les projets et occupe moins de place.

## Review Focus

- **Liens sous `/ash_site/`** : n'importe quel lien interne écrit `/projets` au lieu de `/ash_site/projets` donne une 404 en production, alors que tout semble fonctionner en local. → test dans Task 3 : aucun `href` interne de `dist/` ne commence par `/` sans `/ash_site/`.
- **Brouillons qui fuient** : une entrée `draft: true` poussée sur `main` ne doit jamais sortir au prochain tag. → tests dans Task 2 (`isPublished`), Task 3 (pas de page) et Task 4 (absente du RSS).
- **Entrée de journal rattachée à un projet qui n'existe pas** (faute de frappe dans le slug) : le build doit échouer avec un message clair, pas produire une page orpheline. → `reference("projets")` dans le schéma, et test dans Task 1.
- **Projet sans aucune entrée de journal** (cas de départ fréquent) : la page projet s'affiche avec un message du type « Pas encore d'entrée », sans planter. → test dans Task 3.
- **Décalage de date** : une date `2026-10-26` affichée « 25 octobre » à cause du fuseau UTC. → test `formatDate` dans Task 2 (formatage en `timeZone: "UTC"`).

---

### Task 1: Squelette Astro et collections de contenu

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `vitest.config.ts`
- Create: `src/content.config.ts`
- Create: `src/content/projets/app-recueil.md`, `src/content/journal/2026-10-26-demarrage.md`, `src/content/revues/2026-s44.md`
- Create: `tests/content-schema.test.ts`

**Interfaces:**
- Produces: les collections `projets`, `journal`, `revues`, avec les schémas suivants (zod, via `astro:content`) :
  - `projets` : `{ titre: string, resume: string, statut: "en-cours" | "en-pause" | "termine", technos: string[], ordre: number (défaut 100), liens?: { demo?: url, code?: url }, image?: image(), draft: boolean (défaut false) }`
  - `journal` : `{ titre: string, date: z.coerce.date(), projet: reference("projets"), draft: boolean (défaut false) }`
  - `revues` : `{ titre: string, date: z.coerce.date(), resume?: string, draft: boolean (défaut false) }`
  - Les collections sont chargées avec `glob({ pattern: "**/*.md", base: "./src/content/<nom>" })`.
- Produces: les scripts npm `dev`, `build`, `preview`, `test` (`vitest run`), et `check` (`astro check`).

- [ ] **Step 1: Initialiser le projet** avec `npm create astro@latest . -- --template minimal --typescript strict --install --no-git`, puis `npm i -D vitest @astrojs/check typescript`. Ajouter `dist/` et `.astro/` à `.gitignore`, et `site`/`base` dans `astro.config.mjs` (voir Global Constraints).

- [ ] **Step 2: Écrire `src/content.config.ts`** avec les trois collections ci-dessus, et un contenu d'exemple : le projet `app-recueil` (statut `en-cours`), une entrée de journal rattachée à `app-recueil`, et une revue `2026-s44`.

- [ ] **Step 3: Écrire le test qui fait échouer le build sur une référence cassée**

`tests/content-schema.test.ts` :
```ts
import { execSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";
import { test, expect } from "vitest";

test("une entrée de journal vers un projet inconnu fait échouer le build", () => {
  const f = "src/content/journal/__test-orphelin.md";
  writeFileSync(f, "---\ntitre: x\ndate: 2026-10-26\nprojet: projet-inexistant\n---\nx\n");
  try {
    expect(() => execSync("npx astro build", { stdio: "pipe" })).toThrow(/projet-inexistant/);
  } finally {
    rmSync(f);
  }
}, 120_000);
```

- [ ] **Step 4: Lancer les vérifications**

Run: `npm run build && npm test`
Expected: le build passe sans erreur et le test passe. Si Astro ne valide pas la référence au build, ajouter le contrôle dans `getStaticPaths` de la page journal (Task 3) et déplacer ce test là-bas.

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "Squelette Astro et collections de contenu"
```

---

### Task 2: Fonctions utilitaires

**Files:**
- Create: `src/lib/contenu.ts`, `src/lib/url.ts`, `src/lib/date.ts`
- Test: `tests/lib.test.ts`

**Interfaces:**
- Produces:
  - `isPublished(entry: { data: { draft?: boolean } }): boolean` : renvoie `true` sauf si `draft === true`. Les brouillons restent masqués même avec `astro dev` (pas de cas particulier pour le dev).
  - `byDateDesc<T extends { data: { date: Date } }>(a: T, b: T): number` : fonction de comparaison pour `sort`.
  - `url(path: string): string` : préfixe avec `import.meta.env.BASE_URL` en évitant les doubles `/`. `url("/projets/")` donne `/ash_site/projets/` et `url("")` donne `/ash_site/`.
  - `formatDate(d: Date): string` : `Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })`.

- [ ] **Step 1: Écrire les tests qui échouent**
```ts
expect(isPublished({ data: {} })).toBe(true);
expect(isPublished({ data: { draft: true } })).toBe(false);
expect([d("2026-01-01"), d("2026-03-01")].sort(byDateDesc).map(x => x.data.date.toISOString().slice(0,10))).toEqual(["2026-03-01","2026-01-01"]);
expect(formatDate(new Date("2026-10-26"))).toBe("26 octobre 2026");
expect(url("/projets/")).toBe("/ash_site/projets/");
expect(url("projets/")).toBe("/ash_site/projets/");
expect(url("")).toBe("/ash_site/");
```
(Pour les tests de `url`, injecter `BASE_URL` avec `vi.stubEnv("BASE_URL", "/ash_site/")`, ou bien faire de `url` une fonction de `(path, base = import.meta.env.BASE_URL)`.)

- [ ] **Step 2: Lancer les tests** (`npm test`). Attendu : ÉCHEC, car les modules n'existent pas encore.
- [ ] **Step 3: Écrire les trois modules.**
- [ ] **Step 4: Relancer les tests** (`npm test`). Attendu : tout passe.
- [ ] **Step 5: Commit** : `git commit -m "Utilitaires contenu, URL et dates"`

---

### Task 3: Mise en page et pages (thème minimal)

**Files:**
- Create: `src/layouts/Base.astro` (head, en-tête avec navigation Projets / Revue tech / À propos, pied de page)
- Create: `src/layouts/Article.astro` (en-tête d'article avec un badge de type `Journal · <projet>` ou `Revue tech`, et la date)
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro`, `src/pages/projets/index.astro`, `src/pages/projets/[id].astro`, `src/pages/journal/[id].astro`, `src/pages/revues/index.astro`, `src/pages/revues/[id].astro`, `src/pages/a-propos.astro`, `src/pages/404.astro`
- Modify: `astro.config.mjs` (Shiki `themes: { light: "github-light", dark: "github-dark" }`)
- Test: `tests/pages.test.ts`

**Interfaces:**
- Consumes: les collections de Task 1, et `isPublished`, `byDateDesc`, `url`, `formatDate` de Task 2.
- Produces: les routes `/`, `/projets/`, `/projets/<id>/`, `/journal/<id>/`, `/revues/`, `/revues/<id>/`, `/a-propos/`, et des variables CSS dans `:root` (`--fond`, `--texte`, `--accent`, `--accent-journal`, `--accent-revue`, `--mesure` : largeur de colonne de lecture d'environ 68ch), que Task 6 remplacera.

Contenu des pages :
- **Accueil** : une courte présentation (texte provisoire à remplacer par l'auteur), puis la section « Projets » avec tous les projets publiés triés par `ordre`, puis une section plus petite « Dernières revues tech » avec les 3 plus récentes.
- **Page projet** : résumé, statut, technos, liens, image éventuelle, corps du Markdown, puis « Journal de bord » : les entrées publiées de ce projet, de la plus récente à la plus ancienne. S'il n'y en a aucune, afficher « Pas encore d'entrée. »
- **Entrée de journal** : un lien de retour vers son projet.
- **CSS** : le mode sombre passe par `prefers-color-scheme`. Les blocs `pre` défilent horizontalement (`overflow-x: auto`) sans élargir la page. Les images ont `max-width: 100%`.

- [ ] **Step 1: Écrire les tests sur le `dist/` construit**

`tests/pages.test.ts` : lancer `astro build` une fois dans `beforeAll`, puis :
```ts
test("toutes les routes existent", ...) // dist/index.html, projets/index.html, projets/app-recueil/index.html, journal/2026-10-26-demarrage/index.html, revues/index.html, revues/2026-s44/index.html, a-propos/index.html, 404.html
test("aucun lien interne hors base", ...) // dans chaque .html : aucun href="/..." qui ne commence pas par "/ash_site/"
test("un brouillon ne génère aucune page", ...) // créer un fichier journal temporaire avec draft: true, rebuild, vérifier que sa route et son titre sont absents de tout dist/, puis supprimer le fichier
test("projet sans journal", ...) // créer un projet temporaire sans entrée, rebuild, vérifier que sa page contient "Pas encore d'entrée."
test("accueil : projets avant revues", ...) // dans index.html, l'index de "Projets" est inférieur à celui de "Dernières revues tech"
test("html en français", ...) // index.html contient <html lang="fr"
```
Les fichiers temporaires sont supprimés dans un `finally`. Les tests de ce fichier s'exécutent en séquence.

- [ ] **Step 2: Lancer les tests** (`npm test`). Attendu : ÉCHEC, car les pages n'existent pas encore.
- [ ] **Step 3: Écrire les layouts, les pages et le CSS.**
- [ ] **Step 4: Relancer les tests** (`npm test && npm run check`). Attendu : tout passe, et `astro check` ne signale aucune erreur.
- [ ] **Step 5: Vérification visuelle.** Lancer `npm run preview`, puis ouvrir `/ash_site/` en largeur 375px et en mode sombre. Attendu : pas de défilement horizontal de la page, et le code reste lisible dans les deux thèmes.
- [ ] **Step 6: Commit** : `git commit -m "Pages et thème minimal"`

---

### Task 4: Flux RSS

**Files:**
- Create: `src/pages/rss.xml.ts`
- Modify: `src/layouts/Base.astro` (`<link rel="alternate" type="application/rss+xml">`)
- Test: `tests/rss.test.ts`

**Interfaces:**
- Consumes: `isPublished`, `byDateDesc`, `url`.
- Produces: `/rss.xml`, un flux unique qui mélange revues et entrées de journal publiées, trié par date décroissante. Le titre de chaque item est préfixé par `[Revue]` ou `[Journal · <titre du projet>]`.

- [ ] **Step 1: Écrire le test qui échoue.** Après le build, `dist/rss.xml` existe, contient `https://dididroidd.github.io/ash_site/revues/2026-s44/`, et ne contient pas le titre d'un brouillon temporaire (même technique que dans Task 3).
- [ ] **Step 2: Lancer le test** (`npm test`). Attendu : ÉCHEC.
- [ ] **Step 3: Implémenter le flux avec `@astrojs/rss`** (`npm i @astrojs/rss`).
- [ ] **Step 4: Relancer le test** (`npm test`). Attendu : tout passe.
- [ ] **Step 5: Commit** : `git commit -m "Flux RSS"`

---

### Task 5: Déploiement au tag et mode d'emploi

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- Produces: un workflow déclenché par `on: push: tags: ["v*"]` (et `workflow_dispatch`). Il fait `actions/checkout`, `actions/setup-node` (Node 24, cache npm), `npm ci`, `npm test`, `npm run build`, `actions/upload-pages-artifact` (`path: dist`), puis `actions/deploy-pages`. Permissions : `pages: write` et `id-token: write`. Le groupe `concurrency` s'appelle `pages`.

- [ ] **Step 1: Écrire le workflow.** Aucun déclencheur sur `push: branches`.
- [ ] **Step 2: Vérifier les déclencheurs.** Lancer `grep -n "branches" .github/workflows/deploy.yml`. Attendu : aucun résultat.
- [ ] **Step 3: Écrire le README en français.** Il explique : écrire une entrée de journal (copier un fichier d'exemple, changer `projet`), écrire une revue, garder un brouillon (`draft: true`), prévisualiser (`npm run dev`), et publier (`git tag v2026.10.26 && git push origin v2026.10.26`, avec le format de tag `vAAAA.MM.JJ`, suivi de `.2` s'il y a plusieurs publications le même jour). Il rappelle aussi la configuration unique à faire : *Settings → Pages → Source : GitHub Actions*.
- [ ] **Step 4: Commit** : `git commit -m "Déploiement GitHub Pages au tag et README"`
- [ ] **Step 5: Premier déploiement, à faire avec l'auteur.** Ne pas pousser de tag sans son accord. Il doit d'abord activer Pages (Source : GitHub Actions), puis pousser `main` et le tag. Attendu : le workflow est vert et `https://dididroidd.github.io/ash_site/` s'affiche.

---

### Task 6: Appliquer la maquette 3a

**Préalable :** `design/Site perso - Directions.dc.html` (et `support.js`) sont présents dans le dépôt. S'ils n'y sont pas, cette tâche attend : demander les fichiers à l'auteur, ne pas inventer la direction.

**Files:**
- Modify: `src/styles/global.css`, `src/layouts/Base.astro`, `src/layouts/Article.astro`, les pages au besoin
- Possibly create: `src/components/*.astro` (carte de projet, badge de type) si la maquette en montre

**Interfaces:**
- Consumes: toutes les routes et variables CSS de Task 3. On ne change ni les routes ni les schémas de contenu.

- [ ] **Step 1: Extraire de la direction 3a** les couleurs (claires et sombres), la typographie (polices Google Fonts au besoin), les espacements, la mise en page de l'accueil, la carte de projet, et la façon dont journal et revue se distinguent. Reporter tout ça dans les variables `:root` et dans les composants.
- [ ] **Step 2: Relancer les tests** (`npm test && npm run check`). Attendu : tout passe. Les tests de Task 3 gardent la structure intacte.
- [ ] **Step 3: Vérification visuelle.** Avec `npm run preview`, comparer côte à côte la maquette 3a et l'accueil, une page projet et une revue, en clair et en sombre, en largeur 375px et en bureau.
- [ ] **Step 4: Commit** : `git commit -m "Applique la direction visuelle 3a"`
