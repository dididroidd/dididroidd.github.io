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
ordre: 1                # position sur l'accueil (plus petit = plus haut)
liens:                  # facultatif
  demo: https://…
  code: https://github.com/…
---

Présentation du projet.
```

### Une entrée de journal

Copier `src/content/journal/2026-10-26-demarrage.md`, la renommer (`AAAA-MM-JJ-sujet.md`), et changer l'en-tête :

```md
---
titre: Ce que j'ai fait aujourd'hui
date: 2026-10-27
projet: app-recueil     # nom du fichier du projet, sans .md
---
```

Si `projet` ne correspond à aucun projet, le build échoue avec un message qui le dit.

### Une revue tech

Créer `src/content/revues/AAAA-sNN.md` (année et numéro de semaine) :

```md
---
titre: Revue tech — semaine 44
date: 2026-10-26
resume: Une phrase de résumé (facultatif).
---
```

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

Sur GitHub : *Settings → Pages → Build and deployment → Source : **GitHub Actions***.

## Vérifier

```sh
npm test         # tests (construisent le site)
npm run check    # vérification des types
```
