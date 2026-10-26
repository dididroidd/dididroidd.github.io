# Site perso : portfolio et blog (design)

Date : 2026-10-26

## Intention

Un site personnel qui montre aux autres ce que je sais faire, à travers les projets sur lesquels je travaille. Je ne cherche pas d'emploi (j'ai déjà un poste) : c'est une vitrine détendue, qui dit « voilà ce que je fabrique et comment je m'y prends ».

Le site contient deux types de contenu :

1. **Les projets**, au cœur du site. Chaque projet a une page de présentation et un **journal de bord** : mes avancées, les idées que j'ai eues (y compris celles que j'ai abandonnées, et pourquoi) et ce qu'il me reste à faire. Au départ, le journal servait surtout à garder une trace pour moi. Il est maintenant public et montre ma façon de réfléchir et d'avancer. Premier projet : l'app de recueil.
2. **La revue tech** : un récap de l'actualité tech de la semaine, avec mon avis. Elle s'adresse à des amis et à d'autres devs, et passe au second plan par rapport aux projets.

## Public

- Des gens (devs, recruteurs, curieux) qui veulent voir ce que je sais faire : c'est la cible principale.
- Des amis et d'autres devs, pour la revue tech.
- Moi : le journal de bord me sert aussi de mémoire.

## Objectifs

- En quelques secondes, l'accueil dit qui je suis et montre mes projets.
- Publier un article (une entrée de journal ou une revue) doit demander très peu d'effort. Sinon, je n'écrirai pas.
- Les projets et la revue tech se distinguent au premier coup d'œil, tout en restant un seul site cohérent.
- La lecture est confortable, y compris pour du code et sur mobile.

## Non-objectifs (pour l'instant)

- Pas de comptes utilisateurs, pas de commentaires, pas de newsletter.
- Pas d'interface d'administration : j'écris dans des fichiers.
- Pas de version anglaise tout de suite (voir Contraintes).

## Anti-objectifs (ce qui serait un échec même si ça marche)

- Un site qui ressemble à un CV ou à une page « embauchez-moi ».
- Un design chargé, ou générique façon « template corporate ».
- Une publication si lourde que j'arrête d'écrire.
- Une revue tech qui prend le dessus sur les projets à l'accueil.

## Contraintes et choix décidés

- **Hébergement gratuit : GitHub Pages.** Le dépôt et le site sont donc publics, et tout ce qui est écrit est lisible par tout le monde. *(C'est moi qui l'ai décidé.)*
- **Contenu en Markdown**, versionné dans le dépôt git. *(Décidé par moi.)*
- **Mise en ligne déclenchée par un tag git**, et non à chaque push. Je peux pousser des brouillons sur `main` sans qu'ils soient publiés. Le déploiement (GitHub Actions) se lance quand un tag est poussé. *(Décidé par moi.)*
- **Langue : français.** Une version anglaise viendra peut-être plus tard. La structure ne doit pas l'empêcher, mais on ne la construit pas maintenant. *(Décidé par moi.)*
- **Générateur : Astro.** *(Choix de Claude, accepté sans objection mais pas discuté en détail.)*
- **Tout le contenu vit dans le dépôt du site**, y compris les entrées de journal. Les dépôts des projets ne sont pas mis à contribution. *(Décidé par moi.)*
- **Le journal part de zéro** : il n'y a pas de notes à importer. Une entrée d'exemple pour l'app de recueil suffit. *(Décidé par moi.)*

## Pages

- **Accueil** : une courte présentation (qui je suis, ce que je fais), puis les projets mis en avant, et un accès secondaire aux dernières revues tech.
- **Liste des projets.**
- **Page projet** : ce que c'est, pourquoi je l'ai fait, les technos, des captures, des liens (démo, code), le statut (en cours, en pause, terminé), puis les entrées du journal de bord, de la plus récente à la plus ancienne.
- **Entrée de journal** : un article rattaché à un projet.
- **Liste des revues tech**, par semaine.
- **Revue tech** : un article.
- **À propos.**

## Style visuel

Sobre, centré sur la lecture, avec un mode sombre et adapté au mobile. Le rendu Markdown doit être soigné : titres, listes, citations, liens, images, blocs de code avec coloration, tableaux. La direction visuelle retenue est la **direction 3a** du fichier Claude Design `Site perso - Directions.dc.html`. *(Décidé par moi.)* Elle servira de référence une fois le fichier ajouté au dépôt (dans `design/`).

**Ordre de construction** *(choix de Claude)* : d'abord la structure (modèle de contenu, pages, rendu Markdown, déploiement au tag) avec un thème minimal, puis la maquette 3a dans une étape à part. Si la maquette est déjà disponible au démarrage, on l'applique directement.

## Laissé au constructeur

- Le nom de domaine : `<utilisateur>.github.io` ou un dépôt de projet, au choix.
- Le schéma exact du frontmatter Markdown (titre, date, projet, tags, brouillon…).
- Le format des tags de déploiement.
- Les détails d'implémentation d'Astro (collections de contenu, thème de coloration du code, etc.).
- Un flux RSS : bienvenu s'il est simple.
