# Context -- Altidigitech Video Templates

## Qui sommes-nous

**Altistonegroup** est une holding qui chapeaute plusieurs filiales specialisees.
**Altidigitech** est la filiale digitale, focalisee sur la creation et l'exploitation
d'un portfolio de produits SaaS.

L'equipe est composee de 2 co-fondateurs. L'approche est AI-first :
**Claude Code** est le developpeur principal du repo. Les fondateurs definissent
la strategie, le branding et le contenu ; Claude Code implemente, teste et livre.

---

## Objectif du repo

Ce repo est la **librairie centrale de templates video programmatiques** pour
l'ensemble du portfolio SaaS Altidigitech. Il ne concerne pas un SaaS specifique
mais fournit une base commune reutilisable par tous les produits.

Chaque SaaS dispose de son propre BrandKit (couleurs, fonts, assets) et de ses
propres compositions video, mais tous partagent les memes templates, composants
et utilitaires.

---

## Stack technique

| Technologie | Role |
|-------------|------|
| Remotion v4 | Framework de rendu video programmatique (chaque frame = composant React) |
| React 18 | Bibliotheque UI pour les composants |
| TypeScript 5 | Typage strict, pas de `any`, pas de `@ts-ignore` |
| Bun | Package manager et runtime (jamais npm ou yarn) |
| Turborepo | Orchestration du monorepo (build, lint, typecheck en parallele) |
| Zod | Validation des schemas de props pour les templates |
| FFmpeg | Assemblage des frames en video (gere par Remotion) |

---

## Architecture

Le repo suit une architecture monorepo avec separation claire :

- `packages/` -- Code partage entre tous les SaaS (utils, brand, core, templates)
- `projects/` -- Implementations specifiques par SaaS (compositions, assets, configs)
- `scripts/` -- Automatisation (scaffold, rendu, deploy)

Le flux de donnees est lineaire :

```
BrandConfig --> Template --> Composition --> Render
```

Un **BrandConfig** contient toutes les valeurs de design d'un SaaS (couleurs,
fonts, espacement, animations, assets). Un **Template** est un composant React
generique qui accepte un BrandConfig. Une **Composition** assemble un template
avec un BrandConfig specifique et des props finales. Le **Render** produit
la video finale (MP4, WebM, GIF).

---

## Principes de design

1. **Reutilisabilite maximale** -- Un template fonctionne avec n'importe quel SaaS
2. **Qualite cinematique** -- Animations spring, motion blur, easing professionnels
3. **Automation over manual** -- Scripts de scaffold, rendu batch, pipeline CI/CD
4. **TypeScript strict** -- Pas de `any`, pas de valeurs hardcodees, tout type
5. **BrandConfig everywhere** -- Aucune couleur, font ou espacement en dur
6. **Determinisme** -- Meme frame = meme resultat, pas de `Math.random()` ou `Date.now()`

---

## Formats video standards

| ID | Dimensions | FPS | Usage |
|----|-----------|-----|-------|
| widescreen | 1920x1080 | 60 | YouTube, demos, presentations |
| square | 1080x1080 | 30 | Instagram feed, LinkedIn |
| vertical | 1080x1920 | 30 | TikTok, Reels, Shorts |
| ultrawide | 2560x1080 | 60 | Bannieres web, hero sections |
| thumbnail | 1280x720 | 30 | Miniatures YouTube |

Chaque template doit supporter au minimum `widescreen` et `vertical`.

---

## Workflow Claude Code

1. Lire CLAUDE.md et les fichiers references
2. Comprendre le contexte (quel SaaS, quel template, quel objectif)
3. Implementer en respectant les conventions (TypeScript strict, BrandConfig, named exports)
4. Tester dans le studio Remotion (`bun dev`)
5. Verifier (`bun typecheck`, `bun lint`)
6. Rendre si necessaire (`bun render`)

---

## Conventions de code

- **Composants React** : PascalCase, named exports, props typees et exportees
- **Fichiers composants** : PascalCase.tsx dans un dossier du meme nom
- **Templates** : suffixe "Template" (ex: `ProductDemoTemplate`)
- **Compositions** : ID kebab-case prefixe par le SaaS (ex: `golddesk-product-demo`)
- **Constantes** : UPPER_SNAKE_CASE
- **Fonctions/variables** : camelCase
- **Dossiers** : kebab-case

---

## Glossaire

| Terme | Definition |
|-------|-----------|
| BrandKit / BrandConfig | Objet TypeScript contenant toutes les valeurs de design d'un SaaS |
| Template | Composant React generique parametre par un BrandConfig |
| Composition | Assemblage final d'un template avec un brand et des props specifiques |
| Sequence | Composant Remotion qui controle quand un enfant est visible dans la timeline |
| Frame | Unite de temps dans Remotion (1 frame = 1 screenshot React) |
| FPS | Frames par seconde (60 pour widescreen, 30 pour social) |
| Spring | Fonction d'animation physique (ressort) de Remotion |
| Interpolate | Fonction de mapping lineaire (ou avec easing) de Remotion |
