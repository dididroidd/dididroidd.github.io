# Site perso

Mon portfolio : mes projets avec leur journal de bord, et une revue tech hebdomadaire.
Fait avec [Astro](https://docs.astro.build), publié sur https://dididroidd.github.io.

## Écrire

Tout le contenu est en Markdown dans `src/content/`.

### Un projet

Créer `src/content/projets/<nom-du-projet>.md` (le nom du fichier devient l'adresse : `/projets/<nom-du-projet>/`) :

```md
---
titre: App de recueil
resume: Une phrase qui dit ce que c'est.
statut: en-cours        # en-cours | en-pause | termine
technos: [TypeScript, SQLite]
depuis: 2026-03-01      # début du projet (affiché « depuis mars 2026 »)
ordre: 1                # position sur l'accueil (plus petit = plus haut)
liens:                  # facultatif
  demo: https://…
  code: https://github.com/…
---

## Pourquoi

Présentation du projet.
```

Une image de capture est possible avec `image: ./capture.png` (fichier à côté du `.md`).
Sur la page « Projets », les projets sont classés par statut.

### Une entrée de journal

Copier `src/content/journal/2026-10-26-demarrage.md`, la renommer (`AAAA-MM-JJ-sujet.md`), et changer l'en-tête :

```md
---
titre: Ce que j'ai fait aujourd'hui
date: 2026-10-27
projet: app-recueil     # nom du fichier du projet, sans .md
type: avancee           # avancee (+) | idee (?) | abandon (−) | afaire (□)
resume: Une ou deux phrases, affichées dans le fil du journal.
tags: [sqlite, wasm]    # facultatif
---
```

L'identifiant façon commit (`a3f9c1`) est calculé à partir du nom du fichier : ne pas renommer
un fichier déjà publié si on veut garder le même identifiant.

Si `projet` ne correspond à aucun projet, le build échoue avec un message qui le dit.

### Une revue tech

Créer `src/content/revues/AAAA-sNN.md` (année et numéro de semaine) :

```md
---
titre: Revue tech — semaine 44
date: 2026-10-26
numero: 1               # N° de la revue
resume: Une phrase de résumé (facultatif).
---

Salut à tous,

Une phrase d'introduction.

## Titre du premier sujet

*Source : Hacker News*

Ce qui s'est passé.

> **Mon avis :** ce que j'en pense.

## En bref

- Une petite nouvelle.

*Bonne semaine, Didi*
```

La mise en page de lettre repose sur ces conventions :
- chaque `## Titre` est un sujet, numéroté automatiquement (01, 02…) et compté dans l'en-tête ;
- une ligne seule en italique juste sous le titre devient la source (`*Source : …*`) ;
- une citation `> **Mon avis :** …` devient l'encadré « Mon avis » ;
- `## En bref` n'est pas compté comme un sujet ;
- le dernier paragraphe, s'il est tout en italique, devient la signature.

## Infos du site

Nom, ville, lien GitHub, accroche et intro de l'accueil : `src/lib/site.ts`.
Photo : `src/assets/avatar.png`. Maquette de référence : `design/` (direction 3a, « Fil v2 »).

### Brouillons

Ajouter `draft: true` dans l'en-tête : le contenu n'apparaît nulle part (ni page, ni lien, ni RSS),
même s'il est poussé sur GitHub. Le retirer quand c'est prêt.

## Prévisualiser

```sh
npm install      # la première fois
npm run dev      # http://localhost:4321
```

## Publier

Pousser sur `main` ne publie rien. Le site est mis en ligne quand on pousse un tag `v…` :

```sh
git push
git tag v2026.10.27
git push origin v2026.10.27
```

Format des tags : `vAAAA.MM.JJ`, avec `.2`, `.3`… s'il y a plusieurs publications le même jour
(`v2026.10.27.2`). Le déploiement prend une à deux minutes (onglet *Actions* sur GitHub).

### Configuration unique

Sur GitHub :

1. *Settings → Pages → Build and deployment → Source : **GitHub Actions***.
2. *Settings → Environments → github-pages → Deployment branches and tags* : ajouter une règle
   de **tag** `v*`. Sans elle, GitHub n'autorise que la branche `main` et refuse le déploiement
   lancé par un tag (« Tag … is not allowed to deploy to github-pages »).

## Vérifier

```sh
npm test         # tests (construisent le site)
npm run check    # vérification des types
```
