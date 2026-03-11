import React from 'react'
import { Composition } from 'remotion'
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk'
import {
  StatsShowcaseTemplate,
  HowItWorksTemplate,
  SocialShortTemplate,
  FeatureHighlightTemplate,
} from '@altidigitech/templates'
import type {
  StatsShowcaseProps,
  HowItWorksProps,
  SocialShortProps,
  FeatureHighlightProps,
} from '@altidigitech/templates'
import { leakDetectorBrand } from '@altidigitech/brand'
import type { BrandConfig } from '@altidigitech/brand'
import { LeakDetectorScene } from './components/LeakDetectorScene'
import { LDProductDemo } from './compositions/LDProductDemo'
import { LDLaunchAnnouncement } from './compositions/LDLaunchAnnouncement'
import { LDLogoReveal } from './compositions/LDLogoReveal'
import { LDScreenDashboard } from './compositions/LDScreenDashboard'
import { LDScreenHeroVertical } from './compositions/LDScreenHeroVertical'
import { LDScreenSquare } from './compositions/LDScreenSquare'

// Load Space Grotesk for display text
const { fontFamily } = loadFont()

// Brand with loaded font override
const ldBrand: BrandConfig = {
  ...leakDetectorBrand,
  typography: {
    ...leakDetectorBrand.typography,
    fontDisplay: fontFamily,
  },
}

// ── Wrapped generic templates ─────────────────────────────────────────────────
// Templates now include LDBackground + LogoOverlay internally.
// Wrappers simply pass the brand through.

const LDStatsShowcase: React.FC<StatsShowcaseProps> = (props) => (
  <LeakDetectorScene brand={ldBrand}>
    <StatsShowcaseTemplate {...props} brand={{
      ...ldBrand,
      colors: { ...ldBrand.colors, background: 'transparent' },
    }} />
  </LeakDetectorScene>
)

const LDHowItWorks: React.FC<HowItWorksProps> = (props) => (
  <LeakDetectorScene brand={ldBrand}>
    <HowItWorksTemplate {...props} brand={{
      ...ldBrand,
      colors: { ...ldBrand.colors, background: 'transparent' },
    }} />
  </LeakDetectorScene>
)

const LDSocialShort: React.FC<SocialShortProps> = (props) => (
  <SocialShortTemplate {...props} brand={ldBrand} />
)

const LDFeatureHighlight: React.FC<FeatureHighlightProps> = (props) => (
  <FeatureHighlightTemplate {...props} brand={ldBrand} />
)


// ── Timing helpers ────────────────────────────────────────────────────────────

const FPS_60 = 60
const FPS_30 = 30
const sec = (s: number, fps: number) => Math.round(s * fps)
const sec60 = (s: number) => sec(s, FPS_60)
const sec30 = (s: number) => sec(s, FPS_30)

// ── Root ──────────────────────────────────────────────────────────────────────

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ===== WIDESCREEN 1920x1080 @ 60fps ===== */}

      <Composition
        id="leak-detector-logo-reveal"
        component={LDLogoReveal}
        durationInFrames={sec(3, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: ldBrand,
          showTagline: true,
        }}
      />

      <Composition
        id="leak-detector-product-demo"
        component={LDProductDemo}
        durationInFrames={sec(10, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: ldBrand,
          headline: 'Your landing page leaks conversions',
          subline: 'Leak Detector scans your pages and finds the CRO issues killing your growth.',
          features: [
            'Audit 8 CRO categories instantly',
            'Get a score out of 100',
            'Actionable fix suggestions',
            'Social proof analysis',
            'CTA effectiveness scoring',
            'Mobile responsiveness check',
          ],
          ctaText: 'Scan your page free',
        }}
      />

      <Composition
        id="leak-detector-launch"
        component={LDLaunchAnnouncement}
        durationInFrames={sec(15, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: ldBrand,
          headline: 'Leak Detector is live',
          subline: 'The CRO audit tool that finds what your landing page is missing.',
          launchDate: 'Available now — Free audit',
          features: ['8 CRO categories', 'Score /100', 'Actionable fixes', 'Social proof audit'],
          ctaText: 'Try it free',
        }}
      />

      <Composition
        id="leak-detector-stats"
        component={LDStatsShowcase}
        durationInFrames={sec(8, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: ldBrand,
          headline: 'What we found scanning 1,000+ pages',
          stats: [
            { value: 73, label: 'Average CRO score', prefix: '', suffix: '/100' },
            { value: 58, label: 'Pages missing social proof', prefix: '', suffix: '%' },
            { value: 42, label: 'Have weak CTAs', prefix: '', suffix: '%' },
            { value: 3.2, label: 'Avg issues per page', prefix: '', suffix: '' },
          ],
        }}
      />

      <Composition
        id="leak-detector-how-it-works"
        component={LDHowItWorks}
        durationInFrames={sec(12, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: ldBrand,
          headline: 'How Leak Detector works',
          steps: [
            {
              title: 'Paste your URL',
              description: 'Enter any landing page URL to start a free CRO audit.',
            },
            {
              title: 'AI scans 8 categories',
              description:
                'Our engine analyzes social proof, CTAs, copy clarity, urgency, trust signals, layout, mobile UX, and page speed.',
            },
            {
              title: 'Get your score & fixes',
              description:
                'Receive a score out of 100 with prioritized, actionable recommendations.',
            },
          ],
          ctaText: 'Start your free audit',
        }}
      />

      <Composition
        id="leak-detector-feature-cro"
        component={LDFeatureHighlight}
        durationInFrames={sec(10, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: ldBrand,
          featureTitle: '8 CRO categories analyzed',
          featureDescription:
            'Leak Detector covers every angle of your landing page conversion funnel.',
          bulletPoints: [
            'Social proof presence & quality',
            'CTA clarity & placement',
            'Copy persuasiveness',
            'Urgency & scarcity signals',
            'Trust indicators',
            'Visual hierarchy & layout',
          ],
          ctaText: 'Run your free audit',
        }}
      />

      {/* ===== VERTICAL 1080x1920 @ 30fps ===== */}

      <Composition
        id="leak-detector-social-vertical"
        component={LDSocialShort}
        durationInFrames={sec(15, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          brand: ldBrand,
          hookText: '58% of landing pages have zero social proof',
          bodyText: 'Leak Detector scans your page and tells you exactly what to fix.',
          ctaText: 'Free audit — link in bio',
        }}
      />

      <Composition
        id="leak-detector-social-stats-vertical"
        component={LDStatsShowcase}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          brand: ldBrand,
          headline: 'Is your landing page leaking?',
          stats: [
            { value: 73, label: 'Average score', prefix: '', suffix: '/100' },
            { value: 58, label: 'No social proof', prefix: '', suffix: '%' },
            { value: 42, label: 'Weak CTAs', prefix: '', suffix: '%' },
          ],
        }}
      />

      {/* ===== SQUARE 1080x1080 @ 30fps ===== */}

      <Composition
        id="leak-detector-social-square"
        component={LDSocialShort}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1080}
        defaultProps={{
          brand: ldBrand,
          hookText: 'Your landing page is losing customers',
          bodyText: 'Find the CRO leaks in 30 seconds with Leak Detector.',
          ctaText: 'Scan free now',
        }}
      />

      <Composition
        id="leak-detector-stats-square"
        component={LDStatsShowcase}
        durationInFrames={sec(8, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1080}
        defaultProps={{
          brand: ldBrand,
          headline: 'CRO audit results',
          stats: [
            { value: 73, label: 'Average CRO score', prefix: '', suffix: '/100' },
            { value: 58, label: 'Missing social proof', prefix: '', suffix: '%' },
          ],
        }}
      />

      {/* ===== SCREEN COMPOSITIONS (recreated UI) ===== */}

      <Composition
        id="leak-detector-screen-dashboard"
        component={LDScreenDashboard}
        durationInFrames={sec60(10)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: ldBrand,
        }}
      />

      <Composition
        id="leak-detector-screen-hero-vertical"
        component={LDScreenHeroVertical}
        durationInFrames={sec(8, FPS_60)}
        fps={FPS_60}
        width={1080}
        height={1920}
        defaultProps={{
          brand: ldBrand,
        }}
      />

      <Composition
        id="leak-detector-screen-square"
        component={LDScreenSquare}
        durationInFrames={sec(6, FPS_60)}
        fps={FPS_60}
        width={1080}
        height={1080}
        defaultProps={{
          brand: ldBrand,
        }}
      />
    </>
  )
}
