# .claude/new-template.md
# Skill : Créer un Nouveau Template Vidéo

> **Quand lire ce fichier** : À chaque fois que tu dois créer un nouveau
> template vidéo, une nouvelle composition, ou scaffolder un nouveau projet SaaS.
> Prérequis : avoir lu `remotion-basics.md`, `remotion-animations.md` et `brand-system.md`.

---

## 1. DEUX CHOSES DISTINCTES À NE PAS CONFONDRE

```
TEMPLATE   = Composant React réutilisable paramétrable
             → packages/templates/src/[nom]/
             → Accepte un BrandConfig + des props
             → Peut être utilisé par N SaaS différents

COMPOSITION = Assemblage final d'un ou plusieurs templates
             → projects/[saas]/src/compositions/
             → Utilise un BrandConfig spécifique
             → Produit une vidéo finale exportable
```

---

## 2. CATALOGUE DES TEMPLATES DISPONIBLES

Avant de créer un nouveau template, vérifier si l'un de ceux-ci couvre le besoin :

| Template ID | Description | Formats |
|-------------|-------------|---------|
| `product-demo` | Démo produit avec features animées | 16:9, 9:16 |
| `feature-highlight` | Mise en avant d'une feature unique | 16:9, 1:1 |
| `launch-announcement` | Annonce de lancement de produit | 16:9, 9:16 |
| `social-short` | Contenu court pour réseaux sociaux | 9:16, 1:1 |
| `logo-reveal` | Animation de logo avec tagline | 16:9 |
| `stats-showcase` | Chiffres et métriques animés | 16:9, 1:1 |
| `testimonial` | Citation client / témoignage | 16:9, 1:1, 9:16 |
| `how-it-works` | Explication en 3 étapes | 16:9 |
| `pricing-reveal` | Présentation des plans tarifaires | 16:9 |
| `team-intro` | Présentation de l'équipe | 16:9 |

> Si le template existe → aller directement à la **Section 6** (créer une composition).
> Si le template n'existe pas → suivre la **Section 3** (créer un nouveau template).

---

## 3. CRÉER UN NOUVEAU TEMPLATE — ÉTAPE PAR ÉTAPE

### Étape 1 — Définir le template
Avant d'écrire du code, répondre à ces questions :

```
Nom du template     : ex. "pricing-reveal"
Durée typique       : ex. "8 secondes (480 frames à 60fps)"
Formats supportés   : ex. "16:9 et 1:1"
Props nécessaires   : ex. plans[], accentColor, ctaText
Sections/scènes     : ex. "Intro (0-60) → Plans (60-360) → CTA (360-480)"
Animations clés     : ex. "Stagger des plans, compteur de prix, CTA bounce"
Assets requis       : ex. "Logo, background optionnel"
```

### Étape 2 — Créer la structure de fichiers

```bash
packages/templates/src/[nom-du-template]/
├── [NomDuTemplate].tsx        ← Composant principal
├── [NomDuTemplate].test.tsx   ← Tests unitaires
├── components/                ← Sous-composants internes (si besoin)
│   ├── [SubComponent].tsx
│   └── index.ts
└── index.ts                   ← Re-export
```

### Étape 3 — Définir les props avec Zod

```typescript
// packages/templates/src/pricing-reveal/PricingReveal.tsx
import { z } from 'zod'

// Schema Zod pour validation + type inference
export const pricingRevealSchema = z.object({
  // Brand (toujours en premier)
  brand: z.custom<BrandConfig>(),

  // Contenu
  headline: z.string().default('Simple, transparent pricing'),
  subline: z.string().optional(),
  plans: z.array(z.object({
    name: z.string(),
    price: z.string(),
    period: z.string().default('/month'),
    features: z.array(z.string()),
    highlighted: z.boolean().default(false),
  })).min(1).max(4),
  ctaText: z.string().default('Get started'),

  // Timing (en frames)
  introDuration: z.number().default(60),
  planStaggerDelay: z.number().default(20),
  outroDuration: z.number().default(60),
})

export type PricingRevealProps = z.infer<typeof pricingRevealSchema>
```

### Étape 4 — Implémenter le template

```typescript
// packages/templates/src/pricing-reveal/PricingReveal.tsx (suite)
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { BrandBackground, BrandHeadline, BrandLogo } from '@altidigitech/core'

export const PricingRevealTemplate: React.FC<PricingRevealProps> = ({
  brand,
  headline,
  subline,
  plans,
  ctaText,
  introDuration = 60,
  planStaggerDelay = 20,
  outroDuration = 60,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // ── Calculs de timing ──────────────────────────────────────────────────────
  const introEnd = introDuration
  const plansStart = introEnd
  const plansEnd = plansStart + plans.length * planStaggerDelay + 120
  const outroStart = durationInFrames - outroDuration

  // ── Animations globales ────────────────────────────────────────────────────
  const headlineOpacity = interpolate(
    frame,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const headlineY = spring({
    frame,
    fps,
    from: 40,
    to: 0,
    config: brand.motion.springSmooth,
  })

  return (
    <AbsoluteFill>
      {/* Background */}
      <BrandBackground brand={brand} variant="gradient" />

      {/* Header — Logo */}
      <Sequence from={0} durationInFrames={durationInFrames} name="Logo">
        <AbsoluteFill style={{
          padding: brand.spacing.paddingScreen,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
          <BrandLogo brand={brand} size={80} delay={0} />
        </AbsoluteFill>
      </Sequence>

      {/* Headline */}
      <Sequence from={0} durationInFrames={outroStart} name="Headline">
        <AbsoluteFill style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: brand.spacing.sm,
        }}>
          <div style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}>
            <BrandHeadline
              brand={brand}
              text={headline}
              size="size4xl"
              gradient
            />
          </div>
          {subline && (
            <div style={{
              opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' }),
              color: brand.colors.textSecondary,
              fontFamily: brand.typography.fontBody,
              fontSize: brand.typography.sizeLg,
            }}>
              {subline}
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Plans */}
      <Sequence from={plansStart} name="Plans">
        <AbsoluteFill style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: brand.spacing.lg,
          padding: brand.spacing.paddingScreen,
          paddingTop: 200, // Laisser place au headline
        }}>
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              brand={brand}
              delay={i * planStaggerDelay}
            />
          ))}
        </AbsoluteFill>
      </Sequence>

      {/* CTA */}
      <Sequence from={plansEnd} durationInFrames={outroStart - plansEnd} name="CTA">
        <CTAButton brand={brand} text={ctaText} />
      </Sequence>
    </AbsoluteFill>
  )
}

// ── Sous-composants internes ──────────────────────────────────────────────────

type PlanCardProps = {
  plan: PricingRevealProps['plans'][0]
  brand: BrandConfig
  delay: number
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, brand, delay }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame: frame - delay,
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const opacity = interpolate(
    frame,
    [delay, delay + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      backgroundColor: plan.highlighted ? brand.colors.accent : brand.colors.surface,
      borderRadius: brand.spacing.borderRadiusLg,
      padding: brand.spacing.lg,
      minWidth: 280,
      border: plan.highlighted
        ? 'none'
        : `1px solid ${brand.colors.border}`,
    }}>
      <div style={{
        color: plan.highlighted ? brand.colors.white : brand.colors.textSecondary,
        fontFamily: brand.typography.fontBody,
        fontSize: brand.typography.sizeMd,
        marginBottom: brand.spacing.sm,
      }}>
        {plan.name}
      </div>
      <div style={{
        color: plan.highlighted ? brand.colors.white : brand.colors.textPrimary,
        fontFamily: brand.typography.fontDisplay,
        fontSize: brand.typography.size3xl,
        fontWeight: brand.typography.weightBold,
      }}>
        {plan.price}
        <span style={{ fontSize: brand.typography.sizeSm, fontWeight: brand.typography.weightRegular }}>
          {plan.period}
        </span>
      </div>
    </div>
  )
}

const CTAButton: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: brand.motion.springBouncy,
  })

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        transform: `scale(${scale})`,
        backgroundColor: brand.colors.accent,
        color: brand.colors.white,
        fontFamily: brand.typography.fontDisplay,
        fontSize: brand.typography.sizeLg,
        fontWeight: brand.typography.weightBold,
        padding: `${brand.spacing.md}px ${brand.spacing.xl}px`,
        borderRadius: brand.spacing.borderRadius,
      }}>
        {text}
      </div>
    </AbsoluteFill>
  )
}
```

### Étape 5 — Exporter le template

```typescript
// packages/templates/src/pricing-reveal/index.ts
export { PricingRevealTemplate } from './PricingReveal'
export { pricingRevealSchema } from './PricingReveal'
export type { PricingRevealProps } from './PricingReveal'

// packages/templates/src/index.ts — ajouter la ligne
export * from './pricing-reveal'
```

---

## 4. CRÉER UNE COMPOSITION POUR UN SAAS

Une composition = un template + un BrandConfig spécifique + les props finales.

```typescript
// projects/[saas-name]/src/compositions/PricingComposition.tsx
import { Composition } from 'remotion'
import { PricingRevealTemplate, pricingRevealSchema } from '@altidigitech/templates'
import { mySaasBrand } from '@altidigitech/brand/[saas-name]'

export const PricingComposition: React.FC = () => (
  <Composition
    id="[saas-name]-pricing"              // kebab-case : [saas-name]-[template]
    component={PricingRevealTemplate}
    schema={pricingRevealSchema}
    durationInFrames={480}               // 8s à 60fps
    fps={60}
    width={1920}
    height={1080}
    defaultProps={{
      brand: mySaasBrand,
      headline: 'Simple, transparent pricing',
      plans: [
        {
          name: 'Starter',
          price: '$0',
          features: ['Feature A', 'Feature B'],
          highlighted: false,
        },
        {
          name: 'Pro',
          price: '$29',
          features: ['Everything in Starter', 'Feature C', 'Feature D'],
          highlighted: true,
        },
      ],
      ctaText: 'Start for free',
    }}
  />
)
```

---

## 5. STRUCTURE COMPLÈTE D'UN PROJET SAAS

```
projects/[saas-name]/
├── CLAUDE.md                           ← Contexte spécifique au SaaS
├── remotion.config.ts                  ← Config de rendu
├── package.json                        ← Scripts de ce projet
│
├── public/
│   ├── logo.svg                        ← ⚠️ REQUIS — Logo SVG
│   ├── logo.png                        ← ⚠️ REQUIS — Logo PNG (1024×1024 min)
│   ├── logo-white.svg                  ← Optionnel — Version blanche
│   ├── logo-dark.svg                   ← Optionnel — Version sombre
│   ├── favicon.png                     ← Optionnel — Icône carrée
│   ├── screenshots/                    ← Screenshots de l'interface
│   │   ├── dashboard.png
│   │   ├── feature-1.png
│   │   └── feature-2.png
│   ├── sounds/
│   │   ├── background.mp3             ← Musique de fond
│   │   └── whoosh.mp3                 ← Son de transition
│   └── images/                        ← Autres images
│
└── src/
    ├── index.ts                        ← Entry point Remotion
    ├── root.tsx                        ← RemotionRoot avec toutes les Compositions
    └── compositions/
        ├── ProductDemoComposition.tsx
        ├── LaunchComposition.tsx
        ├── SocialShortComposition.tsx
        └── index.ts
```

### `root.tsx` — Pattern obligatoire

```typescript
// projects/[saas-name]/src/root.tsx
import { Composition } from 'remotion'
import {
  ProductDemoTemplate,
  LaunchAnnouncementTemplate,
  SocialShortTemplate,
  LogoRevealTemplate,
} from '@altidigitech/templates'
import { mySaasBrand } from '@altidigitech/brand/[saas-name]'

// Constantes de durée pour ce SaaS
const FPS = 60
const sec = (s: number) => Math.round(s * FPS)

export const RemotionRoot: React.FC = () => (
  <>
    {/* ── 16:9 Widescreen ─────────────────────────────────────── */}

    <Composition
      id="[saas-name]-product-demo"
      component={ProductDemoTemplate}
      durationInFrames={sec(10)}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        brand: mySaasBrand,
        headline: 'TODO: Headline du SaaS',
        subline: 'TODO: Sous-titre',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        ctaText: 'Get started',
      }}
    />

    <Composition
      id="[saas-name]-launch"
      component={LaunchAnnouncementTemplate}
      durationInFrames={sec(15)}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        brand: mySaasBrand,
        headline: 'TODO: Announcing [SaaS Name]',
        launchDate: 'TODO: Launch date',
        ctaText: 'Join the waitlist',
      }}
    />

    {/* ── 9:16 Vertical (Reels / TikTok / Shorts) ─────────────── */}

    <Composition
      id="[saas-name]-social-vertical"
      component={SocialShortTemplate}
      durationInFrames={sec(15)}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        brand: mySaasBrand,
        headline: 'TODO: Hook accrocheur',
        ctaText: 'Link in bio',
      }}
    />

    {/* ── 1:1 Square (Instagram / LinkedIn) ───────────────────── */}

    <Composition
      id="[saas-name]-social-square"
      component={SocialShortTemplate}
      durationInFrames={sec(10)}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{
        brand: mySaasBrand,
        headline: 'TODO: Headline courte',
        ctaText: 'Learn more',
      }}
    />

    {/* ── Logo Reveal (universel) ──────────────────────────────── */}

    <Composition
      id="[saas-name]-logo-reveal"
      component={LogoRevealTemplate}
      durationInFrames={sec(3)}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        brand: mySaasBrand,
      }}
    />
  </>
)
```

---

## 6. `CLAUDE.md` LOCAL D'UN PROJET SAAS

Chaque projet SaaS a son propre `CLAUDE.md` avec son contexte.

```markdown
# CLAUDE.md — projects/[saas-name]

## Ce SaaS
- **Nom** : [Nom du SaaS]
- **Tagline** : [Tagline]
- **Description** : [Description courte]
- **Secteur** : [Finance / Tech / Créatif / Santé / etc.]
- **Cible** : [B2B / B2C / Développeurs / etc.]

## Brand
- **Couleur principale** : [ex: #F59E0B]
- **Style** : [ex: Premium, sombre, professionnel]
- **Tone of voice** : [ex: Confiant, expert, accessible]

## Assets disponibles
- [ ] logo.svg
- [ ] logo.png
- [ ] logo-white.svg
- [ ] screenshots/dashboard.png
- [ ] sounds/background.mp3

## Compositions à créer
- [ ] [saas-name]-product-demo (16:9, 10s)
- [ ] [saas-name]-launch (16:9, 15s)
- [ ] [saas-name]-social-vertical (9:16, 15s)
- [ ] [saas-name]-social-square (1:1, 10s)
- [ ] [saas-name]-logo-reveal (16:9, 3s)

## Notes spécifiques
<!-- Claude Code : lire cette section avant de créer les compositions -->
- [Ajouter toute instruction spécifique à ce SaaS]
- [Particularités visuelles ou de brand]
- [Restrictions ou éléments obligatoires]
```

---

## 7. CHECKLIST CRÉATION TEMPLATE

### Nouveau template (`packages/templates/`)
- [ ] Schema Zod défini avec toutes les props typées
- [ ] Props `brand: BrandConfig` toujours en premier
- [ ] Durées de sections calculées depuis les props (pas hardcodées)
- [ ] Chaque section dans une `<Sequence>` nommée
- [ ] Sous-composants extraits si > 50 lignes
- [ ] Tous les composants exportés depuis `index.ts`
- [ ] Export ajouté dans `packages/templates/src/index.ts`
- [ ] Testé avec au moins 2 BrandKits différents

### Nouvelle composition (`projects/[saas]/`)
- [ ] ID de composition au format `[saas-name]-[template-name]`
- [ ] `durationInFrames` calculé via `sec()` (lisible en secondes)
- [ ] `defaultProps` remplis avec des vraies valeurs (pas de "Lorem ipsum")
- [ ] Composition ajoutée dans `root.tsx`
- [ ] Assets référencés existent dans `public/` (ou TODO commenté)
- [ ] `CLAUDE.md` local du projet mis à jour
- [ ] Testé dans le studio Remotion (`bun dev:[saas-name]`)

### Nouveau projet SaaS (`projects/[saas-name]/`)
- [ ] Dossier créé depuis `_template` via `bun new:saas [nom]`
- [ ] `BrandConfig` rempli dans `packages/brand/src/[saas-name]/config.ts`
- [ ] Exports ajoutés dans `packages/brand/src/index.ts`
- [ ] Scripts ajoutés dans `package.json` racine
- [ ] `CLAUDE.md` local rempli avec le contexte du SaaS
- [ ] Au moins le `logo-reveal` créé comme première composition

---

## 8. ERREURS COURANTES À ÉVITER

```typescript
// ❌ Props hardcodées dans la composition
defaultProps={{
  brand: mySaasBrand,
  accentColor: '#6366F1',     // Hardcodé — doit venir du brand
  fontSize: 64,               // Hardcodé — doit venir de brand.typography
}}

// ✅ Tout depuis le BrandConfig
defaultProps={{
  brand: mySaasBrand,
  // Les couleurs et tailles sont dans mySaasBrand
}}

// ❌ Durées hardcodées en frames sans contexte
durationInFrames={480}  // Qu'est-ce que 480 ? Illisible.

// ✅ Toujours via sec() ou une constante nommée
const TOTAL_DURATION = sec(8)  // 8 secondes — lisible
durationInFrames={TOTAL_DURATION}

// ❌ ID de composition sans préfixe SaaS
id="product-demo"           // Collision possible entre SaaS

// ✅ Toujours préfixé par le saas-name
id="[saas-name]-product-demo"

// ❌ Template qui importe un brand spécifique
import { mySaasBrand } from '@altidigitech/brand/my-saas'  // Couplage !

// ✅ Template générique — le brand est toujours passé en prop
const MyTemplate: React.FC<{ brand: BrandConfig }> = ({ brand }) => {}
```

---

*Skill : new-template.md — Altidigitech Video Templates*
*Tu as maintenant tous les skills nécessaires pour travailler sur ce repo.*
*En cas de doute → relire `CLAUDE.md` racine.*
