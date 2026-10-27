export const site = {
  name: 'Alex Moreau',
  first: 'Alex',
  city: 'Lyon',
  intro: "Je suis développeur. Le jour, je fais du backend dans une PME lyonnaise ; le soir, je fabrique des petits outils. Ici, je montre ce que je construis et comment je m'y prends — fausses pistes comprises.",
  headline: "Je fabrique des petits outils, et je note tout ce qui se passe en chemin."
};

export const projects = [
  { slug: 'recueil', n: '01', name: 'Recueil', pitch: "Une app pour garder les phrases qui comptent : citations, notes de lecture, bouts de conversation.", status: 'en cours', tech: ['SvelteKit', 'SQLite (wasm)', 'PWA'], updated: '24 oct. 2026', since: 'mars 2026', count: 12 },
  { slug: 'site', n: '02', name: 'Ce site', pitch: "Un portfolio-carnet en Markdown, publié par un tag git. Vous êtes dedans.", status: 'en cours', tech: ['Astro', 'GitHub Actions'], updated: '20 oct. 2026', since: 'oct. 2026', count: 4 },
  { slug: 'bocal', n: '03', name: 'Bocal', pitch: "Un lecteur RSS minuscule qui tourne sur un Raspberry Pi dans un placard.", status: 'en pause', tech: ['Go', 'htmx'], updated: '2 juin 2026', since: 'janv. 2026', count: 9 },
  { slug: 'tempo', n: '04', name: 'Tempo', pitch: "Un métronome pour le terminal, né d'un cours de guitare raté.", status: 'terminé', tech: ['Rust'], updated: '14 nov. 2025', since: 'sept. 2025', count: 6 }
];

export const project = {
  name: 'Recueil',
  pitch: "Une app pour garder les phrases qui comptent : citations, notes de lecture, bouts de conversation. Rapide à saisir, facile à retrouver.",
  why: "J'avais des citations éparpillées dans quatre apps de notes, trois carnets et une centaine de captures d'écran. Je voulais un seul endroit, qui marche hors ligne et que je contrôle de bout en bout.",
  status: 'en cours',
  since: 'mars 2026',
  tech: ['SvelteKit', 'TypeScript', 'SQLite (wa-sqlite)', 'PWA'],
  links: [{ label: 'Démo', url: 'recueil.alexmoreau.fr' }, { label: 'Code', url: 'github.com/alexmoreau/recueil' }]
};

export const entries = [
  { id: 'a3f9c1', date: '24 oct. 2026', short: '24.10', type: 'avancee', label: 'Avancée', title: 'La recherche plein texte fonctionne hors ligne', summary: "SQLite FTS5 compilé en WebAssembly : 3 000 citations indexées en moins d'une seconde, requêtes en 4 ms." },
  { id: '7be210', date: '17 oct. 2026', short: '17.10', type: 'abandon', label: 'Abandonnée', title: "La synchronisation en temps réel", summary: "Trop de complexité pour un usage solo. Une synchro manuelle, à la demande, suffit largement. Je garde les notes au cas où." },
  { id: 'c04d8e', date: '9 oct. 2026', short: '09.10', type: 'idee', label: 'Idée', title: "Saisir une citation en photographiant la page", summary: "OCR côté client avec Tesseract.js. À tester sur des pages de livre de poche mal éclairées." },
  { id: '19aa3f', date: '2 oct. 2026', short: '02.10', type: 'afaire', label: 'À faire', title: 'Avant la v0.3', summary: "Export Markdown, raccourcis clavier, surligner les termes trouvés, un écran vide moins triste." },
  { id: 'e6c702', date: '21 sept. 2026', short: '21.09', type: 'avancee', label: 'Avancée', title: 'Premier import depuis une liseuse', summary: "Le fichier d'export est un format… créatif. Parseur écrit, 14 cas limites recensés." }
];

export const article = [
  { t: 'p', text: "Jusqu'ici, la recherche dans Recueil était un simple filtre sur les titres. Ça suffisait avec cinquante citations ; avec trois mille, c'était inutilisable." },
  { t: 'h2', text: "Ce que j'ai essayé" },
  { t: 'ul', items: ["Un index maison en JavaScript : rapide à écrire, lent à interroger.", "MiniSearch : agréable, mais tout l'index vit en mémoire.", "SQLite FTS5 via wa-sqlite : retenu."] },
  { t: 'h2', text: 'Le code' },
  { t: 'p', text: "La table virtuelle tient en quelques lignes. L'option remove_diacritics est la plus importante : sans elle, chercher « ete » ne trouve pas « été »." },
  { t: 'code', file: 'schema.sql', lang: 'sql', lines: [
    [['com', '-- Index plein texte, insensible aux accents']],
    [['kw', 'CREATE VIRTUAL TABLE'], ['p', ' citations_fts '], ['kw', 'USING'], ['fn', ' fts5'], ['p', '(']],
    [['p', '  texte, auteur, source,']],
    [['p', '  content '], ['kw', '='], ['str', " 'citations'"], ['p', ',']],
    [['p', '  tokenize '], ['kw', '='], ['str', " 'unicode61 remove_diacritics 2'"]],
    [['p', ');']],
    [['p', ' ']],
    [['kw', 'SELECT'], ['p', ' rowid, '], ['fn', 'snippet'], ['p', '(citations_fts, '], ['num', '0'], ['p', ', '], ['str', "'<mark>'"], ['p', ', '], ['str', "'</mark>'"], ['p', ', '], ['str', "'…'"], ['p', ', '], ['num', '12'], ['p', ')']],
    [['kw', 'FROM'], ['p', ' citations_fts '], ['kw', 'WHERE'], ['p', ' citations_fts '], ['kw', 'MATCH'], ['p', ' ?;']]
  ] },
  { t: 'quote', text: "Make it work, make it right, make it fast.", cite: 'Kent Beck' },
  { t: 'p', text: "J'en suis à « make it work ». Pour le reste, quelques mesures sur mon téléphone :" },
  { t: 'table', head: ['Approche', 'Indexation', 'Requête'], rows: [['Index maison', '1,8 s', '120 ms'], ['MiniSearch', '0,9 s', '15 ms'], ['FTS5 (wasm)', '0,6 s', '4 ms']] },
  { t: 'img', label: "capture — résultats de recherche avec extraits surlignés" },
  { t: 'p', text: "Prochaine étape : surligner les termes trouvés dans la vue liste. C'est dans l'entrée « À faire » du 2 octobre." }
];

export const revues = [
  { n: '43', week: 'Semaine 43', dates: '19 – 25 oct. 2026', title: "Les navigateurs s'entendent enfin sur quelque chose", count: 3 },
  { n: '42', week: 'Semaine 42', dates: '12 – 18 oct. 2026', title: "Un éditeur de code de plus, et pourquoi je ne change pas", count: 4 },
  { n: '41', week: 'Semaine 41', dates: '5 – 11 oct. 2026', title: "Le retour des sites statiques (encore)", count: 3 },
  { n: '40', week: 'Semaine 40', dates: '28 sept. – 4 oct. 2026', title: "Rust dans le noyau, deux ans après", count: 5 }
];

export const revue = {
  n: '43', week: 'Semaine 43', dates: '19 – 25 oct. 2026', date: 'dimanche 26 octobre 2026',
  title: "Les navigateurs s'entendent enfin sur quelque chose",
  hello: 'Salut à tous,',
  intro: "Semaine calme côté annonces, agitée côté discussions. Trois sujets qui m'ont fait réagir, et mon avis — sans prétention.",
  items: [
    { n: '01', title: 'Les transitions de vue arrivent partout', source: 'blog d\u2019un navigateur', resume: "Le dernier grand navigateur qui manquait à l'appel livre les transitions entre pages, sans JavaScript.", avis: "Enfin. J'ai déjà retiré 200 lignes d'animation de ce site. Le progrès, parfois, c'est supprimer." },
    { n: '02', title: 'Un gestionnaire de paquets JS de plus', source: 'Hacker News', resume: "Plus rapide, plus sûr, compatible avec tout. Comme les trois précédents.", avis: "Je ne compte plus. Je reste sur ce que j'ai tant que ça ne me fait pas défaut." },
    { n: '03', title: 'Des modèles de langage dans le téléphone', source: 'conférence mobile', resume: "Les démos tournent hors ligne, en local, sur un appareil de milieu de gamme.", avis: "Impressionnant sur scène. J'attends de voir l'état de la batterie après une heure d'usage." }
  ],
  bref: ["Nouvelle version mineure de SQLite : rien de cassé, comme d'habitude.", "Un bon article sur les migrations de base sans interruption de service.", "Nouvelle version majeure d'Astro : je mets ce site à jour la semaine prochaine."],
  sign: 'Bonne semaine, Alex'
};

export const about = {
  paras: [
    "Je m'appelle Alex, je suis développeur backend depuis une dizaine d'années, à Lyon. J'ai un poste qui me plaît ; ce site n'est pas un CV.",
    "J'aime les outils petits, rapides et qui durent. Je fabrique surtout pour moi, parfois pour des amis, et je raconte le chemin dans les journaux de bord — y compris les idées que j'abandonne.",
    "Le dimanche, j'écris une revue de la semaine tech pour quelques amis. Elle est ici aussi."
  ],
  tools: ['Neovim, un vieux ThinkPad, beaucoup de café', 'Go, Rust et TypeScript selon l\u2019humeur', 'Ce site : Astro, Markdown, GitHub Pages'],
  contact: [{ label: 'Courriel', value: 'bonjour@alexmoreau.fr' }, { label: 'GitHub', value: 'github.com/alexmoreau' }, { label: 'RSS', value: '/rss.xml' }]
};
