import React from 'react'
import { Composition } from 'remotion'
// TODO: Import templates from @altidigitech/templates
// import { ProductDemoTemplate, LogoRevealTemplate } from '@altidigitech/templates'
// TODO: Import brand from @altidigitech/brand/TODO_SAAS_ID
// import { saasBrand } from '@altidigitech/brand/TODO_SAAS_ID'

// TODO: Replace TODO_SAAS_ID with the actual SaaS ID
const FPS = 60
const sec = (s: number) => Math.round(s * FPS)

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* TODO: Add compositions here
      <Composition
        id="TODO_SAAS_ID-product-demo"
        component={ProductDemoTemplate}
        durationInFrames={sec(10)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          brand: saasBrand,
          headline: 'TODO: Headline',
          subline: 'TODO: Subline',
          features: ['Feature 1', 'Feature 2', 'Feature 3'],
          ctaText: 'Get started',
        }}
      />

      <Composition
        id="TODO_SAAS_ID-logo-reveal"
        component={LogoRevealTemplate}
        durationInFrames={sec(3)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          brand: saasBrand,
          showTagline: true,
        }}
      />
      */}
    </>
  )
}
