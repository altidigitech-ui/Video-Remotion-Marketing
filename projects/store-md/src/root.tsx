import React from 'react'
import { Composition } from 'remotion'
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit'
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans'
import {
  LogoRevealTemplate,
  LaunchAnnouncementTemplate,
  StatsShowcaseTemplate,
  HowItWorksTemplate,
  FeatureHighlightTemplate,
  SocialShortTemplate,
} from '@altidigitech/templates'
import type {
  LogoRevealProps,
  LaunchAnnouncementProps,
  StatsShowcaseProps,
  HowItWorksProps,
  FeatureHighlightProps,
  SocialShortProps,
} from '@altidigitech/templates'
import { storeMdBrand } from '@altidigitech/brand'
import type { BrandConfig } from '@altidigitech/brand'
import { StoreMDScene } from './components/StoreMDScene'
import { SMDProductDemo } from './compositions/SMDProductDemo'
import { SMDScanProgress } from './compositions/SMDScanProgress'
import { SMDHealthDashboard } from './compositions/SMDHealthDashboard'

// ── Font loading ──────────────────────────────────────────────────────────────
// loadFont() registers the @font-face CSS so `font-family: 'Outfit'` and
// `'Plus Jakarta Sans'` resolve throughout all compositions. We also splice
// the returned family strings back into the brand so templates that read
// `brand.typography.fontDisplay` get the loaded version.

const { fontFamily: outfitFamily } = loadOutfit()
const { fontFamily: jakartaFamily } = loadJakarta()

const smdBrand: BrandConfig = {
  ...storeMdBrand,
  typography: {
    ...storeMdBrand.typography,
    fontDisplay: outfitFamily,
    fontBody: jakartaFamily,
  },
}

// ── Wrapped generic templates ─────────────────────────────────────────────────
// Templates without their own LogoOverlay (StatsShowcase, HowItWorks) get wrapped
// in StoreMDScene. Templates that already include LogoOverlay internally are
// used directly — mirrors the leak-detector pattern.

const SMDStatsShowcase: React.FC<StatsShowcaseProps> = (props) => (
  <StoreMDScene brand={smdBrand}>
    <StatsShowcaseTemplate
      {...props}
      brand={{
        ...smdBrand,
        colors: { ...smdBrand.colors, background: 'transparent' },
      }}
    />
  </StoreMDScene>
)

const SMDHowItWorks: React.FC<HowItWorksProps> = (props) => (
  <StoreMDScene brand={smdBrand}>
    <HowItWorksTemplate
      {...props}
      brand={{
        ...smdBrand,
        colors: { ...smdBrand.colors, background: 'transparent' },
      }}
    />
  </StoreMDScene>
)

const SMDLogoReveal: React.FC<LogoRevealProps> = (props) => (
  <LogoRevealTemplate {...props} brand={smdBrand} />
)

const SMDLaunchAnnouncement: React.FC<LaunchAnnouncementProps> = (props) => (
  <LaunchAnnouncementTemplate {...props} brand={smdBrand} />
)

const SMDFeatureHighlight: React.FC<FeatureHighlightProps> = (props) => (
  <FeatureHighlightTemplate {...props} brand={smdBrand} />
)

const SMDSocialShort: React.FC<SocialShortProps> = (props) => (
  <SocialShortTemplate {...props} brand={smdBrand} />
)

// ── Timing helpers ────────────────────────────────────────────────────────────

const FPS_60 = 60
const FPS_30 = 30
const sec = (s: number, fps: number) => Math.round(s * fps)

// ── Root ──────────────────────────────────────────────────────────────────────

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ═════════ WIDESCREEN 1920x1080 @ 60fps ═════════ */}

      <Composition
        id="store-md-product-demo"
        component={SMDProductDemo}
        durationInFrames={sec(15, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      <Composition
        id="store-md-health-dashboard"
        component={SMDHealthDashboard}
        durationInFrames={sec(12, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      <Composition
        id="store-md-logo-reveal"
        component={SMDLogoReveal}
        durationInFrames={sec(3, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: smdBrand,
          showTagline: true,
        }}
      />

      <Composition
        id="store-md-launch"
        component={SMDLaunchAnnouncement}
        durationInFrames={sec(9, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: smdBrand,
          headline: 'StoreMD is live',
          subline: 'Your Shopify store, monitored like a vital system.',
          launchDate: 'Available now — Free forever plan',
          features: [
            '60-second store health score',
            '5 audit modules — Performance, Apps, Listings, AI Ready, Accessibility',
            'Auto-fix for common issues',
            'Daily monitoring & score trends',
          ],
          ctaText: 'Scan your store free',
        }}
      />

      <Composition
        id="store-md-stats"
        component={SMDStatsShowcase}
        durationInFrames={sec(8, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: smdBrand,
          headline: 'What we learned scanning 2,000+ Shopify stores',
          stats: [
            { value: 14, label: 'Apps avg per store', prefix: '', suffix: '' },
            { value: 73, label: 'Have residual app code', prefix: '', suffix: '%' },
            { value: 2100, label: 'Lost/mo at 4s load', prefix: '$', suffix: '' },
            { value: 34, label: 'AI readiness score avg', prefix: '', suffix: '%' },
          ],
        }}
      />

      <Composition
        id="store-md-how-it-works"
        component={SMDHowItWorks}
        durationInFrames={sec(8, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: smdBrand,
          headline: 'How StoreMD works',
          steps: [
            {
              title: 'Install from Shopify App Store',
              description:
                'One click, zero config. StoreMD starts scanning immediately.',
            },
            {
              title: 'AI scans 43 health signals',
              description:
                'Performance, apps, listings, AI readiness, accessibility — all in 60 seconds.',
            },
            {
              title: 'Get your score & fix in 1 click',
              description:
                'Prioritized issues with auto-fix. Your store gets healthier every day.',
            },
          ],
          ctaText: 'Start free',
        }}
      />

      <Composition
        id="store-md-feature-health"
        component={SMDFeatureHighlight}
        durationInFrames={sec(7, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: smdBrand,
          featureTitle: 'Store Health module',
          featureDescription:
            "Monitor your Shopify store's vital signs 24/7. One score, five dimensions, zero blind spots.",
          bulletPoints: [
            'Real-time score tracking with 7-day trend',
            'Separate Mobile & Desktop performance scores',
            'App impact on load speed — per app',
            'Critical / major / minor issue severity',
            'Auto-fix for common problems',
            'Instant rescan any time',
          ],
          ctaText: 'Try StoreMD free',
        }}
      />

      {/* ═════════ VERTICAL 1080x1920 @ 30fps ═════════ */}

      <Composition
        id="store-md-scan-progress"
        component={SMDScanProgress}
        durationInFrames={sec(8, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      <Composition
        id="store-md-social-vertical"
        component={SMDSocialShort}
        durationInFrames={sec(8, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          brand: smdBrand,
          hookText:
            "Your Shopify store is bleeding $2,100/month and you don't even know it",
          bodyText:
            'Residual app code, bloated themes, slow apps — StoreMD finds it all in 60 seconds.',
          ctaText: 'Free scan — link in bio',
        }}
      />

      <Composition
        id="store-md-stats-vertical"
        component={SMDStatsShowcase}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          brand: smdBrand,
          headline: 'Is your store healthy?',
          stats: [
            { value: 14, label: 'Apps avg per store', prefix: '', suffix: '' },
            { value: 73, label: 'Have residual code', prefix: '', suffix: '%' },
            { value: 2100, label: 'Lost/mo at 4s load', prefix: '$', suffix: '' },
          ],
        }}
      />

      {/* ═════════ SQUARE 1080x1080 @ 30fps ═════════ */}

      <Composition
        id="store-md-social-square"
        component={SMDSocialShort}
        durationInFrames={sec(6, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1080}
        defaultProps={{
          brand: smdBrand,
          hookText: 'Your Shopify store has 14 apps. Most are hurting performance.',
          bodyText: 'Scan your store health in 60 seconds with StoreMD.',
          ctaText: 'Free scan now',
        }}
      />

      <Composition
        id="store-md-stats-square"
        component={SMDStatsShowcase}
        durationInFrames={sec(8, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1080}
        defaultProps={{
          brand: smdBrand,
          headline: 'Store health facts',
          stats: [
            { value: 14, label: 'Apps avg per store', prefix: '', suffix: '' },
            { value: 73, label: 'Have residual code', prefix: '', suffix: '%' },
          ],
        }}
      />
    </>
  )
}
