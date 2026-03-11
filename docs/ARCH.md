# Architecture -- Altidigitech Video Templates

## Vue d'ensemble du monorepo

```
altidigitech-video-templates/
|
|-- packages/                  Code partage (generique, pas de SaaS specifique)
|   |-- utils/                 Constantes, fonctions utilitaires
|   |-- brand/                 Types BrandConfig, brand de base, templates SaaS
|   |-- core/                  Composants Remotion primitifs reutilisables
|   |-- templates/             Templates video prets a l'emploi
|   +-- compositions/          Reserve pour assemblages partages (futur)
|
|-- projects/                  Implementations par SaaS
|   |-- _template/             Modele a copier pour chaque nouveau SaaS
|   +-- [saas-name]/           Projet specifique a un SaaS
|
|-- scripts/                   Automatisation (scaffold, rendu, deploy)
|-- docs/                      Documentation
|-- public/                    Assets globaux (fonts, images Altidigitech)
+-- renders/                   Output video (gitignored)
```

---

## Description des packages

### packages/utils

Utilitaires sans dependance externe (sauf les types de base).

- `src/formats.ts` -- Constantes VIDEO_FORMATS (widescreen, square, vertical, ultrawide, thumbnail)
- `src/timing.ts` -- Fonctions de conversion temps/frames (`sec()`, `frames()`, `secondsToFrames()`)
- `src/math.ts` -- Fonctions mathematiques (`clamp()`, `lerp()`, `mapRange()`, `easeInOut()`)
- `src/index.ts` -- Barrel export

### packages/brand

Systeme de design tokens. Chaque SaaS a son propre dossier qui etend le brand de base.

- `src/types.ts` -- Types TypeScript (BrandColors, BrandTypography, BrandSpacing, BrandMotion, BrandAssets, BrandConfig)
- `src/base/` -- Valeurs par defaut Altidigitech (indigo #6366F1, Inter, echelle 8px)
- `src/_template/` -- Template a copier pour un nouveau SaaS (tous les champs TODO)
- `src/[saas-name]/` -- Override par SaaS (couleurs, fonts, assets specifiques)
- `src/index.ts` -- Barrel export

### packages/core

Composants Remotion reutilisables. Tous acceptent `brand: BrandConfig` en prop.

- `src/components/BrandLogo/` -- Affichage du logo avec animation optionnelle
- `src/components/BrandHeadline/` -- Titre avec style brand (taille, couleur, gradient)
- `src/components/BrandBackground/` -- Fond (solid, gradient, radial)
- `src/components/AnimatedText/` -- Texte avec animation (fadeIn, slideUp, scaleIn)
- `src/components/StaggerList/` -- Liste d'elements qui apparaissent en stagger
- `src/components/AnimatedCounter/` -- Compteur anime (0 -> N)
- `src/components/Typewriter/` -- Effet machine a ecrire
- `src/hooks/useAnimationSequence.ts` -- Hook pour gerer des sequences d'animations
- `src/index.ts` -- Barrel export

### packages/templates

Templates video generiques. Chaque template a un schema Zod et accepte un BrandConfig.

- `src/product-demo/` -- Demo produit avec features animees
- `src/feature-highlight/` -- Mise en avant d'une feature unique
- `src/launch-announcement/` -- Annonce de lancement
- `src/social-short/` -- Contenu court pour reseaux sociaux (9:16, 1:1)
- `src/logo-reveal/` -- Animation de logo + tagline (~3s)
- `src/stats-showcase/` -- Metriques animees avec compteurs
- `src/how-it-works/` -- Explication en N etapes
- `src/index.ts` -- Barrel export

---

## Flux de donnees

```
BrandConfig (packages/brand)
     |
     v
Template (packages/templates)
     |  utilise des composants de packages/core
     |  utilise des utilitaires de packages/utils
     v
Composition (projects/[saas]/src/root.tsx)
     |  combine Template + BrandConfig + props finales
     v
Render (scripts/ ou CLI Remotion)
     |  Chromium headless -> frames -> FFmpeg -> video
     v
Output (renders/[saas]/*.mp4)
```

---

## Graphe de dependances

```
packages/utils         (aucune dependance interne)
     ^
     |
packages/brand         (depend de utils pour les types de format)
     ^
     |
packages/core          (depend de brand pour BrandConfig, de utils)
     ^
     |
packages/templates     (depend de core pour les composants, de brand pour les types)
     ^
     |
projects/[saas]        (depend de templates, brand, core)
```

---

## Conventions de nommage

| Element | Convention | Exemple |
|---------|-----------|---------|
| Composant React | PascalCase | `BrandHeadline` |
| Fichier composant | PascalCase.tsx | `BrandHeadline.tsx` |
| Dossier composant | PascalCase | `BrandHeadline/` |
| Template | PascalCase + "Template" | `ProductDemoTemplate` |
| Dossier template | kebab-case | `product-demo/` |
| ID de composition | kebab-case | `golddesk-product-demo` |
| Type / Interface | PascalCase | `BrandConfig`, `ProductDemoProps` |
| Variable / fonction | camelCase | `useAnimationSequence` |
| Constante | UPPER_SNAKE_CASE | `DEFAULT_FPS` |
| Package | @altidigitech/[nom] | `@altidigitech/core` |

---

## Ajouter un nouveau SaaS -- pas a pas

1. **Scaffolder le projet**
   ```bash
   bun new:saas [nom-du-saas]
   ```
   Cree automatiquement `projects/[nom]/` et `packages/brand/src/[nom]/`.

2. **Remplir le BrandConfig**
   Editer `packages/brand/src/[nom]/config.ts` : couleurs, fonts, tagline, assets.

3. **Ajouter les assets**
   Placer logo.svg, logo.png, screenshots dans `projects/[nom]/public/`.

4. **Creer les compositions**
   Editer `projects/[nom]/src/root.tsx` pour assembler les templates avec le brand.

5. **Exporter le brand**
   Ajouter l'export dans `packages/brand/src/index.ts`.

6. **Tester**
   ```bash
   bun dev  # Ouvrir le studio Remotion
   ```

7. **Rendre**
   ```bash
   bun render [nom-du-saas]-product-demo
   ```
