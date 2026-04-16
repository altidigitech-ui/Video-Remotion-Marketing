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
import { SMDMoneyCounterVariant } from './compositions/SMDMoneyCounterVariant'
import { SMDHorrorStory } from './compositions/SMDHorrorStory'
import { SMDTierList } from './compositions/SMDTierList'
import { SMDMythReality } from './compositions/SMDMythReality'
import { SMDCountdownReveal } from './compositions/SMDCountdownReveal'
import { SMDFastList } from './compositions/SMDFastList'
import { SMDQuiz } from './compositions/SMDQuiz'
import { SMDPOV } from './compositions/SMDPOV'

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
      {/* ═══════════════════════════════════════════════════════════════════════
          EXISTING — WIDESCREEN 1920x1080 @ 60fps
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-product-demo"
        component={SMDProductDemo}
        durationInFrames={sec(18, FPS_60)}
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

      {/* ═══════════════════════════════════════════════════════════════════════
          EXISTING — VERTICAL 1080x1920 @ 30fps
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-scan-progress"
        component={SMDScanProgress}
        durationInFrames={sec(12, FPS_30)}
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
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      <Composition
        id="store-md-money-counter"
        component={SMDMoneyCounter}
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      <Composition
        id="store-md-testimonial"
        component={SMDTestimonialFake}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          EXISTING — SQUARE 1080x1080 @ 30fps
          ═══════════════════════════════════════════════════════════════════════ */}

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

      {/* ═══════════════════════════════════════════════════════════════════════
          GROUP 1 — MONEY COUNTER VARIANTS (5)
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-money-daily"
        component={SMDMoneyCounterVariant}
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          introText: 'Right now, your Shopify store is losing...',
          targetAmount: 70,
          prefix: '$',
          unit: '/day',
          milestones: [
            { threshold: 0, label: 'ghost billing kicking in...' },
            { threshold: 15, label: 'slow load time tax...' },
            { threshold: 30, label: 'dead code drag...' },
            { threshold: 50, label: 'invisible products...' },
            { threshold: 65, label: 'AI agents skipping you...' },
          ],
          finalMessage: "That's $25,550 a year. Gone.",
          ctaText: 'Stop the bleeding \u2192',
        }}
      />

      <Composition
        id="store-md-money-yearly"
        component={SMDMoneyCounterVariant}
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          introText: 'Multiply that loss over 12 months...',
          targetAmount: 25200,
          prefix: '$',
          unit: '/year',
          milestones: [
            { threshold: 0, label: 'January...' },
            { threshold: 5000, label: 'by March it hurts...' },
            { threshold: 10000, label: 'half your ad budget...' },
            { threshold: 18000, label: 'a full-time salary...' },
            { threshold: 23000, label: 'almost there...' },
          ],
          finalMessage: 'What else could that money do?',
          ctaText: 'Scan free \u2192',
        }}
      />

      <Composition
        id="store-md-money-visitors"
        component={SMDMoneyCounterVariant}
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          introText: 'For every second your store loads slower than 2s...',
          targetAmount: 53,
          prefix: '',
          unit: '%',
          milestones: [
            { threshold: 0, label: 'visitors start leaving...' },
            { threshold: 10, label: 'bounce rate climbing...' },
            { threshold: 25, label: 'Google ranking dropping...' },
            { threshold: 40, label: 'competitors winning...' },
            { threshold: 50, label: 'more than half gone...' },
          ],
          finalMessage: '53% of your traffic leaves. Forever.',
          ctaText: 'Check your speed \u2192',
        }}
      />

      <Composition
        id="store-md-money-ai-missed"
        component={SMDMoneyCounterVariant}
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          introText: "AI shoppers (ChatGPT, Copilot, Gemini) can't see your store...",
          targetAmount: 47,
          prefix: '',
          unit: '%',
          milestones: [
            { threshold: 0, label: 'structured data missing...' },
            { threshold: 10, label: 'product feeds broken...' },
            { threshold: 20, label: 'schema markup absent...' },
            { threshold: 35, label: 'competitors indexed instead...' },
            { threshold: 45, label: 'almost half of future revenue...' },
          ],
          finalMessage: '47% of future revenue. Invisible.',
          ctaText: 'Get AI-ready \u2192',
        }}
      />

      <Composition
        id="store-md-money-ghost-cumulative"
        component={SMDMoneyCounterVariant}
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          introText: '3 ghost apps \u00d7 12 months = ...',
          targetAmount: 1692,
          prefix: '$',
          unit: '',
          milestones: [
            { threshold: 0, label: 'app #1: $47/mo...' },
            { threshold: 300, label: 'app #2: $29/mo...' },
            { threshold: 700, label: 'app #3: $65/mo...' },
            { threshold: 1200, label: 'compounding month after month...' },
            { threshold: 1600, label: 'you never even noticed...' },
          ],
          finalMessage: '$1,692 to apps you thought you deleted.',
          ctaText: 'Find ghost apps \u2192',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          GROUP 2 — HORROR STORIES (4)
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-horror-ghost-apps"
        component={SMDHorrorStory}
        durationInFrames={sec(25, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          chapters: [
            { text: 'A merchant came to us last week.', duration: 70, emphasis: 'normal' as const },
            { text: "He'd been running his store for 4 years.", duration: 75, emphasis: 'normal' as const },
            { text: 'Revenue was stable. $85K/month.', duration: 70, emphasis: 'normal' as const },
            { text: 'But he was hemorrhaging money.', duration: 75, emphasis: 'shock' as const },
            { text: '3 apps he uninstalled in 2023...', duration: 70, emphasis: 'normal' as const },
            { text: 'Were still billing him.', duration: 65, emphasis: 'shock' as const },
            { text: '$189/month \u00d7 22 months = $4,158', duration: 90, emphasis: 'money' as const },
            { text: 'Gone. For nothing.', duration: 65, emphasis: 'shock' as const },
          ],
          resolution: 'StoreMD would have found it in 60 seconds.',
          ctaText: "Don't be next. Scan free \u2192",
        }}
      />

      <Composition
        id="store-md-horror-slow-store"
        component={SMDHorrorStory}
        durationInFrames={sec(23, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          chapters: [
            { text: 'Black Friday 2024.', duration: 55, emphasis: 'normal' as const },
            { text: 'A DTC brand spent $12K on Facebook ads.', duration: 80, emphasis: 'normal' as const },
            { text: 'Traffic spiked 8x.', duration: 55, emphasis: 'normal' as const },
            { text: 'But their store loaded in 4.7 seconds.', duration: 80, emphasis: 'shock' as const },
            { text: '62% of visitors bounced before seeing a product.', duration: 90, emphasis: 'money' as const },
            { text: '$7,440 in ad spend. Wasted.', duration: 75, emphasis: 'money' as const },
            { text: 'Because nobody checked load time.', duration: 75, emphasis: 'shock' as const },
          ],
          resolution: 'StoreMD monitors speed 24/7. No surprises.',
          ctaText: 'Check your speed \u2192',
        }}
      />

      <Composition
        id="store-md-horror-ai-invisible"
        component={SMDHorrorStory}
        durationInFrames={sec(25, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          chapters: [
            { text: 'She noticed sales dropping in Q1 2025.', duration: 80, emphasis: 'normal' as const },
            { text: 'Same traffic. Same ads. Fewer orders.', duration: 80, emphasis: 'normal' as const },
            { text: 'Her competitor? Revenue up 35%.', duration: 70, emphasis: 'shock' as const },
            { text: 'The difference? AI shopping agents.', duration: 75, emphasis: 'normal' as const },
            { text: 'ChatGPT, Copilot, Gemini\u2014all recommending competitors.', duration: 100, emphasis: 'shock' as const },
            { text: 'Her store was invisible to every single one.', duration: 85, emphasis: 'money' as const },
            { text: 'Missing schema. Broken feeds. Zero AI readiness.', duration: 90, emphasis: 'shock' as const },
          ],
          resolution: 'StoreMD checks AI readiness in 60 seconds.',
          ctaText: 'Get visible \u2192',
        }}
      />

      <Composition
        id="store-md-horror-agency-ripoff"
        component={SMDHorrorStory}
        durationInFrames={sec(25, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          chapters: [
            { text: 'He hired an agency for a Shopify audit.', duration: 80, emphasis: 'normal' as const },
            { text: '$2,000. One PDF. 47 pages.', duration: 70, emphasis: 'money' as const },
            { text: 'Took them 3 weeks to deliver.', duration: 70, emphasis: 'normal' as const },
            { text: 'Half the findings were already outdated.', duration: 80, emphasis: 'shock' as const },
            { text: 'He fixed 5 issues. New ones appeared the next week.', duration: 95, emphasis: 'normal' as const },
            { text: 'One-shot audits are snapshots of the past.', duration: 85, emphasis: 'shock' as const },
            { text: '$2,000 for a PDF vs $0 for continuous monitoring.', duration: 95, emphasis: 'money' as const },
          ],
          resolution: 'StoreMD monitors 24/7. Not once a quarter.',
          ctaText: 'Free forever plan \u2192',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          GROUP 3 — TIER LISTS (3)
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-tier-apps-danger"
        component={SMDTierList}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'Shopify apps ranked by how much they slow your store',
          tiers: [
            { rank: 'F' as const, color: '#dc2626', items: ['Privy', 'Yotpo', 'TinyIMG (misconfigured)'] },
            { rank: 'C' as const, color: '#ea580c', items: ['Apps with multiple trackers'] },
            { rank: 'B' as const, color: '#ca8a04', items: ['Simple but redundant apps'] },
            { rank: 'A' as const, color: '#65a30d', items: ['Well-coded essential apps'] },
            { rank: 'S' as const, color: '#16a34a', items: ['Shopify native apps'] },
          ],
          ctaText: 'Scan your apps \u2192',
        }}
      />

      <Composition
        id="store-md-tier-merchant-types"
        component={SMDTierList}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'Shopify merchants ranked by money left on the table',
          tiers: [
            { rank: 'F' as const, color: '#dc2626', items: ['Never audited', '20+ apps', 'Dashboard only'] },
            { rank: 'C' as const, color: '#ea580c', items: ['Audited once a year'] },
            { rank: 'B' as const, color: '#ca8a04', items: ['Use TinyIMG', 'Run Lighthouse manually'] },
            { rank: 'A' as const, color: '#65a30d', items: ['Monthly audits', 'Removed dead apps'] },
            { rank: 'S' as const, color: '#16a34a', items: ['Use StoreMD 24/7'] },
          ],
          ctaText: 'Move to S-tier \u2192',
        }}
      />

      <Composition
        id="store-md-tier-hidden-costs"
        component={SMDTierList}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'Hidden costs of a broken Shopify store',
          tiers: [
            { rank: 'F' as const, color: '#dc2626', items: ['Ghost billing', 'Dead code', '5s+ load'] },
            { rank: 'C' as const, color: '#ea580c', items: ['Slow mobile', 'No AI readiness'] },
            { rank: 'B' as const, color: '#ca8a04', items: ['Missing alt texts', 'No compliance'] },
            { rank: 'A' as const, color: '#65a30d', items: ['Clean but unmonitored'] },
            { rank: 'S' as const, color: '#16a34a', items: ['Healthy + StoreMD monitored'] },
          ],
          ctaText: 'Find your hidden costs \u2192',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          GROUP 4 — MYTH vs REALITY (4)
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-myth-apps-fine"
        component={SMDMythReality}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          myth: 'My apps are fine, Shopify would block bad ones',
          reality: "Shopify doesn't check app performance after install",
          stat: '73% of stores run code from deleted apps',
          source: 'StoreMD scan data, 2,847 stores',
          ctaText: 'Scan your apps \u2192',
        }}
      />

      <Composition
        id="store-md-myth-speed"
        component={SMDMythReality}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          myth: 'My store loads fast enough',
          reality: 'Average Shopify: 3.2s. You lose 32% of visitors over 2s',
          stat: 'Every second = -7% conversions',
          source: 'Google Web Vitals benchmark',
          ctaText: 'Check your speed \u2192',
        }}
      />

      <Composition
        id="store-md-myth-audit-cost"
        component={SMDMythReality}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          myth: 'A Shopify audit costs $2,000',
          reality: 'StoreMD audits 24/7 for $0',
          stat: 'Continuous monitoring > one-shot PDF',
          source: 'Why pay for a snapshot when you can have live data?',
          ctaText: 'Free audit now \u2192',
        }}
      />

      <Composition
        id="store-md-myth-ai-future"
        component={SMDMythReality}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          myth: 'AI shopping is the future',
          reality: 'AI shopping is NOW. Orders via ChatGPT +15x since Jan 2025',
          stat: 'Your store is probably invisible to them',
          source: 'Shopify AI commerce report, Q1 2025',
          ctaText: 'Get AI-ready \u2192',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          GROUP 5 — COUNTDOWN REVEALS (3)
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-countdown-money"
        component={SMDCountdownReveal}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          teaser: "In 10 seconds, you'll see how much your store loses monthly",
          countdownFrom: 10,
          revealContent: {
            number: '$2,100',
            label: '/month',
            subtext: 'in invisible costs',
          },
          ctaText: 'Stop the bleeding \u2192',
        }}
      />

      <Composition
        id="store-md-countdown-time"
        component={SMDCountdownReveal}
        durationInFrames={sec(8, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          teaser: "In 5 seconds, you'll see how fast StoreMD finds everything",
          countdownFrom: 5,
          revealContent: {
            number: '60',
            label: 'seconds',
            subtext: 'for a full store audit',
          },
          ctaText: 'Try it now \u2192',
        }}
      />

      <Composition
        id="store-md-countdown-apps"
        component={SMDCountdownReveal}
        durationInFrames={sec(9, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          teaser: "Count the apps on your Shopify. I'll tell you how many are hurting you",
          countdownFrom: 7,
          revealContent: {
            number: '9/14',
            label: 'apps',
            subtext: 'impact your speed negatively',
          },
          ctaText: 'Find the bad ones \u2192',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          GROUP 6 — FAST LISTS (3)
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-list-hidden"
        component={SMDFastList}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          title: '10 things your Shopify dashboard is HIDING from you',
          items: [
            { text: 'Ghost apps still billing you', severity: 'red' as const },
            { text: 'Dead code slowing every page', severity: 'red' as const },
            { text: 'Real mobile load time (not cached)', severity: 'red' as const },
            { text: 'Which apps inject the most scripts', severity: 'orange' as const },
            { text: 'Products invisible to Google', severity: 'orange' as const },
            { text: 'Missing alt text on images', severity: 'yellow' as const },
            { text: 'Broken structured data', severity: 'orange' as const },
            { text: 'AI shopping readiness score', severity: 'red' as const },
            { text: 'Accessibility violations', severity: 'yellow' as const },
            { text: 'Your real health score vs industry', severity: 'red' as const },
          ],
          conclusion: 'StoreMD shows ALL of this. In 60 seconds.',
          ctaText: 'See what you\u2019re missing \u2192',
        }}
      />

      <Composition
        id="store-md-list-fixes"
        component={SMDFastList}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          title: '10 things StoreMD fixes in 1 click',
          items: [
            { text: 'Remove dead app code', severity: 'green' as const },
            { text: 'Optimize image sizes', severity: 'green' as const },
            { text: 'Fix missing alt texts', severity: 'green' as const },
            { text: 'Add structured data for AI', severity: 'green' as const },
            { text: 'Clean up unused CSS', severity: 'green' as const },
            { text: 'Fix broken meta tags', severity: 'green' as const },
            { text: 'Detect ghost billing apps', severity: 'green' as const },
            { text: 'Optimize font loading', severity: 'green' as const },
            { text: 'Fix mobile viewport issues', severity: 'green' as const },
            { text: 'Generate AI-ready product feeds', severity: 'green' as const },
          ],
          conclusion: 'Zero dev needed. Zero cost.',
          ctaText: 'Fix everything \u2192',
        }}
      />

      <Composition
        id="store-md-list-ghost"
        component={SMDFastList}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          title: '10 signs your store has ghost billing',
          items: [
            { text: 'You uninstalled an app but never checked billing', severity: 'red' as const },
            { text: 'Monthly charges you don\u2019t recognize', severity: 'red' as const },
            { text: 'App count doesn\u2019t match your bill', severity: 'red' as const },
            { text: 'Scripts loading from apps you removed', severity: 'orange' as const },
            { text: '"Free trial" apps you forgot about', severity: 'orange' as const },
            { text: 'Partner dashboard shows unknown charges', severity: 'red' as const },
            { text: 'Store is slower than it should be', severity: 'orange' as const },
            { text: 'You haven\u2019t audited in 6+ months', severity: 'yellow' as const },
            { text: 'Multiple apps doing the same thing', severity: 'yellow' as const },
            { text: 'You\u2019re reading this list and feeling nervous', severity: 'red' as const },
          ],
          conclusion: 'If you checked 3+, you\u2019re bleeding money.',
          ctaText: 'Scan for ghosts \u2192',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          GROUP 7 — QUIZ + POV (3)
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-quiz-healthy"
        component={SMDQuiz}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          questions: [
            { text: 'Do you know your mobile load time?' },
            { text: 'Have you checked for ghost billing this month?' },
            { text: 'Is your store ready for ChatGPT shopping?' },
          ],
          failMessage: 'If you said NO to any \u2014 scan your store free.',
          ctaText: 'Scan now \u2192',
        }}
      />

      <Composition
        id="store-md-pov-first-scan"
        component={SMDPOV}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'You open StoreMD for the first time',
          steps: [
            { label: 'Health Score: 34/100', reaction: 'wait what?', reactionColor: '#fca5a5' },
            { label: 'Ghost Apps Found: 3 ($189/mo)', reaction: '$189/month?!', reactionColor: '#dc2626' },
            { label: 'Dead Code: 47 scripts still running', reaction: 'holy shit', reactionColor: '#dc2626' },
            { label: 'AI Readiness: 12%', reaction: 'my competitors see this?', reactionColor: '#ea580c' },
            { label: 'Auto-Fix Available: 11 issues', reaction: 'wait I can fix this NOW?', reactionColor: '#16a34a' },
          ],
          slamText: '60 seconds changed everything.',
          ctaText: 'Have your moment \u2192',
        }}
      />

      <Composition
        id="store-md-pov-competitor"
        component={SMDPOV}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'You realize your competitor already uses StoreMD',
          steps: [
            { label: 'Their Score: 94/100', reaction: 'how?!', reactionColor: '#16a34a' },
            { label: 'Their Load Time: 1.2s', reaction: 'mine is 4.1s...', reactionColor: '#ea580c' },
            { label: 'Their AI Readiness: 98%', reaction: 'they\u2019re everywhere', reactionColor: '#16a34a' },
            { label: 'Your Score: 34/100', reaction: 'I\u2019m the broken one', reactionColor: '#dc2626' },
          ],
          slamText: 'They scanned. You didn\u2019t.\nThat\u2019s the only difference.',
          ctaText: 'Close the gap \u2192',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          GROUP 8 — BEFORE/AFTER VARIANTS (3)
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-before-after-speed"
        component={SMDBeforeAfter}
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          beforeTitle: 'Your load time now',
          afterTitle: 'After StoreMD optimization',
          beforeScore: 28,
          afterScore: 87,
          beforeIssues: [
            { icon: '\uD83D\uDC0C', text: 'Load time: 4.1s' },
            { icon: '\uD83D\uDEAB', text: '53% visitors bouncing' },
            { icon: '\uD83D\uDCC9', text: 'Google ranking: dropping' },
            { icon: '\uD83D\uDCB8', text: 'Every second = -7% conversions' },
          ],
          afterWins: [
            { icon: '\u26A1', text: 'Load time: 1.8s' },
            { icon: '\u2705', text: '+53% visitors staying' },
            { icon: '\uD83D\uDCC8', text: 'Google ranking: climbing' },
            { icon: '\uD83D\uDCB0', text: 'Conversions up 16%' },
          ],
          slamHeadline: 'Same store.\n2.3 seconds faster.',
          slamSub: 'What are you waiting for?',
          ctaLabel: 'Speed up now \u2192',
        }}
      />

      <Composition
        id="store-md-before-after-ai"
        component={SMDBeforeAfter}
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          beforeTitle: 'Your AI readiness',
          afterTitle: 'After StoreMD AI fix',
          beforeScore: 23,
          afterScore: 98,
          beforeIssues: [
            { icon: '\uD83E\uDD16', text: 'ChatGPT can\u2019t see your products' },
            { icon: '\uD83D\uDEAB', text: 'Missing schema markup' },
            { icon: '\uD83D\uDCC9', text: 'Broken product feeds' },
            { icon: '\uD83D\uDC7B', text: 'Invisible to AI agents' },
          ],
          afterWins: [
            { icon: '\u2705', text: 'All products AI-indexed' },
            { icon: '\u2705', text: 'Schema markup complete' },
            { icon: '\u2705', text: 'Product feeds optimized' },
            { icon: '\uD83D\uDE80', text: 'AI agents recommending you' },
          ],
          slamHeadline: 'Same products.\nNow AI can find them.',
          slamSub: '98% readiness in 60 seconds.',
          ctaLabel: 'Get AI-ready \u2192',
        }}
      />

      <Composition
        id="store-md-before-after-billing"
        component={SMDBeforeAfter}
        durationInFrames={sec(12, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          beforeTitle: 'Ghost billing: before',
          afterTitle: 'After StoreMD cleanup',
          beforeScore: 31,
          afterScore: 92,
          beforeIssues: [
            { icon: '\uD83D\uDC7B', text: '3 ghost apps: -$189/mo' },
            { icon: '\uD83D\uDCB8', text: '22 months undetected' },
            { icon: '\uD83D\uDCC9', text: '$4,158 already lost' },
            { icon: '\uD83E\uDEE5', text: 'Shopify didn\u2019t warn you' },
          ],
          afterWins: [
            { icon: '\u2705', text: 'All ghost apps detected' },
            { icon: '\uD83D\uDCB0', text: '+$189/mo recovered' },
            { icon: '\uD83D\uDD14', text: '24/7 billing monitoring' },
            { icon: '\uD83D\uDEE1\uFE0F', text: 'Never again' },
          ],
          slamHeadline: '-$189/mo became +$189/mo.\nSame store. Same day.',
          slamSub: 'How much are you losing?',
          ctaLabel: 'Find ghost apps \u2192',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          GROUP 9 — TESTIMONIAL VARIANTS (2)
          ═══════════════════════════════════════════════════════════════════════ */}

      <Composition
        id="store-md-testimonial-agency"
        component={SMDTestimonialFake}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          headerName: 'Agency owner',
          bubbles: [
            { side: 'them' as const, text: 'just ran StoreMD on a client store' },
            { side: 'them' as const, text: 'found $2,100/mo in invisible losses' },
            { side: 'us' as const, text: 'for real?' },
            { side: 'them' as const, text: 'ghost billing, dead code, the works' },
            { side: 'them' as const, text: 'client thought his store was fine' },
            { side: 'us' as const, text: 'how long did the scan take?' },
            { side: 'them' as const, text: '60 seconds. I look like a hero.' },
          ],
          slamLine1: 'Be the hero.',
          slamLine2: 'Not the client.',
          slamLine3: 'Scan their store.',
          ctaHeadline: 'Agency-grade audits.\n$0.',
          ctaButtonText: 'Scan a client store \u2192',
        }}
      />

      <Composition
        id="store-md-testimonial-founder"
        component={SMDTestimonialFake}
        durationInFrames={sec(10, FPS_30)}
        fps={FPS_30}
        width={1080}
        height={1920}
        defaultProps={{
          headerName: 'Shopify founder',
          bubbles: [
            { side: 'them' as const, text: 'what\u2019s your StoreMD score?' },
            { side: 'us' as const, text: '41. why?' },
            { side: 'them' as const, text: 'bro. mine was 38 last week.' },
            { side: 'them' as const, text: 'fixed everything in one afternoon. now 91.' },
            { side: 'us' as const, text: 'wait how much were you losing?' },
            { side: 'them' as const, text: '$2,300/month. ghost apps + dead code.' },
          ],
          slamLine1: 'Your score is',
          slamLine2: 'a competition.',
          slamLine3: 'Are you winning?',
          ctaHeadline: 'Check your score.\nBeat your friends.',
          ctaButtonText: 'Get my score \u2192',
        }}
      />
    </>
  )
}
