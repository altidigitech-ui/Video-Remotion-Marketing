# CLAUDE.md — packages/core

> Composants Remotion primitifs réutilisables pour toutes les compositions vidéo.

---

## Ce package

Primitives visuelles partagées entre tous les projets SaaS du repo.
Tout composant ici doit être **100% générique** — pas de référence à Leak Detector ou autre SaaS.

---

## Composants disponibles

Import : `import { ... } from '@altidigitech/core'`

### `LDBackground`
Fond cyberpunk animé : grille amber, orbs radiales, particules flottantes, lumière orbitale.
```typescript
<LDBackground brand={brand} />
// Toujours PREMIER enfant d'une AbsoluteFill racine
// Aucune prop autre que brand
```

### `GlowText`
Texte avec gradient blanc→amber et drop-shadow glow.
```typescript
<GlowText
  brand={brand}
  size={96}       // fontSize en px, défaut: 96
  glow={true}     // drop-shadow amber, défaut: true
>
  Mon texte ici
</GlowText>
// textAlign: center, fontWeight: 800, letterSpacing: -0.03em
```

### `GlowButton`
Bouton CTA avec gradient amber et box-shadow.
```typescript
<GlowButton
  text="→ Scan your page free"
  brand={brand}
  scale={1}    // scale CSS, défaut: 1
/>
// fontSize: 30, padding: 22px 56px, borderRadius: 12
// couleur texte: #0A0F1E (dark sur fond amber)
```

### `GlassCard`
Carte glass morphism dark avec bordure subtile.
```typescript
<GlassCard
  brand={brand}
  glow={false}   // active un border amber glow, défaut: false
>
  {children}
</GlassCard>
// background: rgba(255,255,255,0.04), borderRadius: 16, padding: 24px 32px
```

### `AIBadge`
Badge "AI-Powered CRO Analysis" avec dot vert pulsé.
```typescript
<AIBadge frame={frame} />
// Reçoit frame pour l'animation de pulse du dot
// Texte fixe: "AI-Powered CRO Analysis"
// Style: pill amber, uppercase, fontSize: 20
```

### `LogoOverlay`
Logo positionné bottom-right, fade in sur les 25 premières frames.
```typescript
<LogoOverlay brand={brand} frame={frame} />
// Toujours DERNIER enfant d'une AbsoluteFill racine
// Position: bottom: 40, right: 52
// height: 52px, drop-shadow ambré
// Lit brand.assets.logoPng pour le chemin de l'image
```

---

## Règles

- Tous les composants acceptent `brand: BrandConfig` en prop
- **Jamais** de couleurs, fonts ou tailles hardcodées
- Named exports uniquement — pas d'`export default`
- Chaque nouveau composant dans son propre dossier avec `index.ts` re-export
- Toujours `extrapolateLeft: 'clamp', extrapolateRight: 'clamp'` sur `interpolate()`
- Toujours passer `fps` depuis `useVideoConfig()` à `spring()`

---

## Structure fichiers

```
packages/core/src/
├── components/
│   └── LDBackground/
│       └── LDBackground.tsx   ← LDBackground, GlowText, GlowButton, GlassCard, AIBadge, LogoOverlay
├── hooks/
└── index.ts                   ← re-export de tout
```

---

## Ajouter un composant

1. Créer `src/components/[NomComposant]/[NomComposant].tsx`
2. Exporter depuis `src/components/[NomComposant]/index.ts`
3. Ajouter le re-export dans `src/index.ts`
4. Documenter la signature dans ce fichier

---

## Packages Remotion avancés disponibles

Ces packages sont installés dans le monorepo et disponibles dans tous les packages/projects.
Lire `.claude/remotion-advanced-packages.md` pour la référence complète.

| Package | Utilisation principale |
|---|---|
| `@remotion/transitions` | `<TransitionSeries>` avec `wipe`, `clockWipe`, `iris`, `fade`, `slide` |
| `@remotion/noise` | `noise2D/3D/4D` — mouvements organiques, backgrounds flottants |
| `@remotion/shapes` | `<Pie>`, `<Star>`, `<Polygon>` — score loaders, clipPath transitions |
| `@remotion/paths` | `evolvePath`, `interpolatePath` — paths animés, morphing |
| `@remotion/sfx` | `ding()`, `beep()` — sons sur score reveal et transitions |
| `@remotion/motion-blur` | `<CameraMotionBlur>` — entrées de cartes cinématiques |
| `@remotion/media-utils` | `useAudioData`, `visualizeAudio` — barres audio réactives |
