import React from 'react'
import { Composition } from 'remotion'
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit'
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans'
import {
  LogoRevealTemplate,
  LaunchAnnouncementTemplate,
  FeatureHighlightTemplate,
} from '@altidigitech/templates'
import type {
  LogoRevealProps,
  LaunchAnnouncementProps,
  FeatureHighlightProps,
} from '@altidigitech/templates'
import { storeMdBrand } from '@altidigitech/brand'
import type { BrandConfig } from '@altidigitech/brand'
import { SMDProductDemo } from './compositions/SMDProductDemo'
import { SMDScanProgress } from './compositions/SMDScanProgress'
import { SMDHealthDashboard } from './compositions/SMDHealthDashboard'
import { SMDSocialAggressive } from './compositions/SMDSocialAggressive'
import { SMDStatsAggressive } from './compositions/SMDStatsAggressive'
import type { SMDStat } from './compositions/SMDStatsAggressive'
import { SMDHowItWorksAggressive } from './compositions/SMDHowItWorksAggressive'
import { SMDBeforeAfter } from './compositions/SMDBeforeAfter'
import { SMDMoneyCounter } from './compositions/SMDMoneyCounter'
import { SMDTestimonialFake } from './compositions/SMDTestimonialFake'
import { SMDComparisonGrid } from './compositions/SMDComparisonGrid'

// ── Font loading ──────────────────────────────────────────────────────────────

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

// ── Generic templates wrapped with smdBrand ──────────────────────────────────

const SMDLogoReveal: React.FC<LogoRevealProps> = (props) => (
  <LogoRevealTemplate {...props} brand={smdBrand} />
)

const SMDLaunchAnnouncement: React.FC<LaunchAnnouncementProps> = (props) => (
  <LaunchAnnouncementTemplate {...props} brand={smdBrand} />
)

const SMDFeatureHighlight: React.FC<FeatureHighlightProps> = (props) => (
  <FeatureHighlightTemplate {...props} brand={smdBrand} />
)

// ── Timing helpers ────────────────────────────────────────────────────────────

const FPS_60 = 60
const FPS_30 = 30
const sec = (s: number, fps: number) => Math.round(s * fps)

// ── Stat sets ────────────────────────────────────────────────────────────────
// Shame-gap framing: average score, residual code, monthly loss, ghost billing.

const STATS_FULL: ReadonlyArray<SMDStat> = [
  { value: 41, suffix: '/100', label: 'Average health score — you\u2019re probably lower', icon: 'warning' },
  { value: 73, suffix: '%', label: 'Have dead app code still running', icon: 'bug' },
  { value: 2100, prefix: '$', label: 'Average monthly invisible loss', icon: 'dollar-slash' },
  { value: 89, suffix: '%', label: 'Found at least 1 ghost billing app', icon: 'robot-x' },
]

const STATS_VERTICAL: ReadonlyArray<SMDStat> = [
  { value: 41, suffix: '/100', label: 'Average score (you\u2019re probably lower)', icon: 'warning' },
  { value: 2100, prefix: '$', label: 'You\u2019re losing this. Monthly.', icon: 'dollar-slash' },
  { value: 89, suffix: '%', label: 'Of stores have ghost billing', icon: 'robot-x' },
]

const STATS_SQUARE: ReadonlyArray<SMDStat> = [
  { value: 41, suffix: '/100', label: 'Average health score', icon: 'warning' },
  { value: 89, suffix: '%', label: 'Of stores have ghost billing', icon: 'robot-x' },
]

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
          headline: 'Your Shopify store has been lying to you.',
          subline:
            '14 hidden problems. $2,100/month bleeding. 73% running dead code. We found them all.',
          launchDate: 'Available now \u2014 Free forever plan',
          features: [
            'Health score in 60 seconds \u2014 not 60 days',
            'Ghost billing detector \u2014 stop paying for ghosts',
            'Dead code scanner \u2014 remove what\u2019s killing your speed',
            'AI readiness score \u2014 your competitors are already there',
          ],
          ctaText:
            'Scan now. It\u2019s free. It takes 60 seconds. You have zero excuse.',
        }}
      />

      <Composition
        id="store-md-stats"
        component={SMDStatsAggressive}
        durationInFrames={sec(8, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          headline: 'We scanned 2,847 stores. The results are embarrassing.',
          stats: STATS_FULL,
        }}
      />

      <Composition
        id="store-md-how-it-works"
        component={SMDHowItWorksAggressive}
        durationInFrames={sec(8, FPS_60)}
        fps={FPS_60}
        width={1920}
        height={1080}
        defaultProps={{
          headline: '3 steps. 60 seconds. $2,100/month saved.',
          steps: [
            {
              title: 'Install \u2014 1 click',
              description:
                'From the Shopify App Store. No config. No developer needed. No BS.',
            },
            {
              title: 'Scan \u2014 60 seconds',
              description:
                'AI scans 43 signals. Performance, dead code, ghost billing, AI readiness, accessibility. Everything.',
            },
            {
              title: 'Fix \u2014 1 click',
              description:
                'Auto-fix for most issues. What took agencies $2,000 now costs you $0 and 60 seconds.',
            },
          ],
          ctaText: 'Still reading? Your store is still bleeding.',
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
        component={SMDSocialAggressive}
        durationInFrames={sec(8, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          hookText:
            'You\u2019re paying |$70/day| to run a |broken| store. Here\u2019s proof.',
          bodyText:
            'Ghost billing. Dead code. 4-second load times. StoreMD finds it ALL in 60 seconds.',
          ctaText: 'Free scan. No excuses.',
          showUrgencyBar: true,
        }}
      />

      <Composition
        id="store-md-stats-vertical"
        component={SMDStatsAggressive}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          headline: 'Your store\u2019s report card is in.',
          stats: STATS_VERTICAL,
        }}
      />

      <Composition
        id="store-md-before-after"
        component={SMDBeforeAfter}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      <Composition
        id="store-md-money-counter"
        component={SMDMoneyCounter}
        durationInFrames={sec(8, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      <Composition
        id="store-md-testimonial"
        component={SMDTestimonialFake}
        durationInFrames={sec(6, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* ═════════ SQUARE 1080x1080 @ 30fps ═════════ */}

      <Composition
        id="store-md-social-square"
        component={SMDSocialAggressive}
        durationInFrames={sec(6, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1080}
        defaultProps={{
          hookText:
            'Every Shopify store has |dirty secrets.| Most owners never look.',
          bodyText:
            '14 apps. 3 are ghost billing. 4 are killing speed. We find them in 60 seconds.',
          ctaText: 'Scan free or stay blind.',
          showUrgencyBar: false,
        }}
      />

      <Composition
        id="store-md-stats-square"
        component={SMDStatsAggressive}
        durationInFrames={sec(8, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1080}
        defaultProps={{
          headline: 'Think you\u2019re the exception?',
          stats: STATS_SQUARE,
        }}
      />

      <Composition
        id="store-md-comparison"
        component={SMDComparisonGrid}
        durationInFrames={sec(8, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1080}
        defaultProps={{}}
      />
    </>
  )
}
