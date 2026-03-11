import React from 'react'
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { z } from 'zod'
import type { BrandConfig } from '@altidigitech/brand'

// ── Schema ────────────────────────────────────────────────────────────────────

const screenSlideSchema = z.object({
  /** Chemin vers le screenshot (relatif à public/) */
  src: z.string(),
  /** Légende affichée sous l'image */
  caption: z.string().optional(),
  /** Durée d'affichage en frames (par défaut: calculé automatiquement) */
  durationInFrames: z.number().optional(),
})

export const screenMockupSchema = z.object({
  brand: z.custom<BrandConfig>(),

  /** Titre de la séquence */
  headline: z.string().optional(),

  /** Liste des slides (screenshots) à afficher */
  slides: z.array(screenSlideSchema).min(1).max(6),

  /** Style d'affichage du mockup */
  mockupStyle: z.enum(['browser', 'floating', 'fullscreen']).default('browser'),

  /** Animation d'entrée de chaque slide */
  slideAnimation: z.enum(['slideUp', 'zoomIn', 'fadeIn']).default('slideUp'),

  /** Afficher le CTA final */
  ctaText: z.string().optional(),

  /** Durée de la transition entre slides (frames) */
  transitionDuration: z.number().default(20),
})

export type ScreenMockupProps = z.infer<typeof screenMockupSchema>
export type ScreenSlide = z.infer<typeof screenSlideSchema>

// ── Composant principal ────────────────────────────────────────────────────────

export const ScreenMockupTemplate: React.FC<ScreenMockupProps> = ({
  brand,
  headline,
  slides,
  mockupStyle = 'browser',
  slideAnimation = 'slideUp',
  ctaText,
  transitionDuration = 20,
}) => {
  const { durationInFrames } = useVideoConfig()

  // Calcul du timing automatique des slides
  const headlineDuration = headline ? 60 : 0
  const ctaDuration = ctaText ? 90 : 0
  const slidesAvailableDuration = durationInFrames - headlineDuration - ctaDuration

  // Distribution équitable du temps entre les slides
  const slideDuration = Math.floor(slidesAvailableDuration / slides.length)

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      {/* Fond gradient subtil */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${brand.colors.backgroundAlt} 0%, ${brand.colors.background} 60%)`,
        }}
      />

      {/* Headline optionnel */}
      {headline && (
        <Sequence from={0} durationInFrames={headlineDuration} name="Headline">
          <HeadlineSection brand={brand} text={headline} />
        </Sequence>
      )}

      {/* Slides */}
      {slides.map((slide, i) => {
        const slideStart = headlineDuration + i * slideDuration

        return (
          <Sequence
            key={i}
            from={slideStart}
            durationInFrames={slideDuration}
            name={`Slide ${i + 1}`}
          >
            <SlideSection
              brand={brand}
              slide={slide}
              mockupStyle={mockupStyle}
              animation={slideAnimation}
              transitionDuration={transitionDuration}
              totalSlides={slides.length}
              currentIndex={i}
            />
          </Sequence>
        )
      })}

      {/* CTA final */}
      {ctaText && (
        <Sequence from={durationInFrames - ctaDuration} durationInFrames={ctaDuration} name="CTA">
          <CTASection brand={brand} text={ctaText} />
        </Sequence>
      )}
    </AbsoluteFill>
  )
}

// ── Sous-composants ────────────────────────────────────────────────────────────

const HeadlineSection: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const translateY = spring({
    frame,
    fps,
    from: 30,
    to: 0,
    config: brand.motion.springSmooth,
  })

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: brand.spacing.paddingScreen,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.size4xl,
          fontWeight: brand.typography.weightBold,
          color: brand.colors.textPrimary,
          textAlign: 'center',
          letterSpacing: `${brand.typography.trackingTight}em`,
          lineHeight: brand.typography.lineHeightTight,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  )
}

type SlideSectionProps = {
  brand: BrandConfig
  slide: ScreenSlide
  mockupStyle: 'browser' | 'floating' | 'fullscreen'
  animation: 'slideUp' | 'zoomIn' | 'fadeIn'
  transitionDuration: number
  totalSlides: number
  currentIndex: number
}

const SlideSection: React.FC<SlideSectionProps> = ({
  brand,
  slide,
  mockupStyle,
  animation,
  transitionDuration,
  totalSlides,
  currentIndex,
}) => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, transitionDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const getTransform = (): string => {
    switch (animation) {
      case 'slideUp': {
        const translateY = interpolate(frame, [0, transitionDuration], [60, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
        return `translateY(${translateY}px)`
      }
      case 'zoomIn': {
        const scale = interpolate(frame, [0, transitionDuration], [0.9, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
        return `scale(${scale})`
      }
      case 'fadeIn':
      default:
        return 'none'
    }
  }

  // Container style selon le mockupStyle
  const getContainerStyle = (): React.CSSProperties => {
    switch (mockupStyle) {
      case 'browser':
        return {
          opacity,
          transform: getTransform(),
          borderRadius: brand.spacing.borderRadiusLg,
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
          border: `1px solid ${brand.colors.border}`,
          maxWidth: '85%',
          maxHeight: '75%',
        }
      case 'floating':
        return {
          opacity,
          transform: getTransform(),
          borderRadius: brand.spacing.borderRadius,
          overflow: 'hidden',
          boxShadow: `0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px ${brand.colors.border}`,
          maxWidth: '80%',
          maxHeight: '70%',
        }
      case 'fullscreen':
        return {
          opacity,
          transform: getTransform(),
          width: '100%',
          height: '100%',
        }
    }
  }

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: mockupStyle === 'fullscreen' ? 0 : brand.spacing.paddingScreen,
        flexDirection: 'column',
        gap: brand.spacing.md,
      }}
    >
      {/* Barre de navigateur pour le style "browser" */}
      {mockupStyle === 'browser' && (
        <BrowserBar brand={brand} opacity={opacity} transform={getTransform()} />
      )}

      {/* Screenshot */}
      <div style={getContainerStyle()}>
        <Img
          src={staticFile(slide.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Légende optionnelle */}
      {slide.caption && (
        <CaptionText brand={brand} text={slide.caption} transitionDuration={transitionDuration} />
      )}

      {/* Dots de navigation (si > 1 slide) */}
      {totalSlides > 1 && (
        <div style={{ display: 'flex', gap: brand.spacing.xs, marginTop: brand.spacing.xs }}>
          {Array.from({ length: totalSlides }, (_, i) => (
            <div
              key={i}
              style={{
                width: i === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === currentIndex ? brand.colors.accent : brand.colors.border,
              }}
            />
          ))}
        </div>
      )}
    </AbsoluteFill>
  )
}

const BrowserBar: React.FC<{
  brand: BrandConfig
  opacity: number
  transform: string
}> = ({ brand, opacity, transform }) => {
  return (
    <div
      style={{
        opacity,
        transform,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '85%',
        backgroundColor: brand.colors.surface,
        padding: '12px 16px',
        borderRadius: `${brand.spacing.borderRadiusLg}px ${brand.spacing.borderRadiusLg}px 0 0`,
        border: `1px solid ${brand.colors.border}`,
        borderBottom: 'none',
        flexShrink: 0,
      }}
    >
      {/* Dots macOS */}
      <BrowserDot color="#EF4444" />
      <BrowserDot color="#F59E0B" />
      <BrowserDot color="#10B981" />
      {/* URL bar */}
      <div
        style={{
          flex: 1,
          height: 28,
          backgroundColor: brand.colors.background,
          borderRadius: 6,
          marginLeft: 8,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
          color: brand.colors.textMuted,
          fontFamily: brand.typography.fontMono,
          fontSize: brand.typography.sizeXs,
        }}
      >
        {brand.id}.tech
      </div>
    </div>
  )
}

const BrowserDot: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
)

const CaptionText: React.FC<{
  brand: BrandConfig
  text: string
  transitionDuration: number
}> = ({ brand, text, transitionDuration }) => {
  const frame = useCurrentFrame()

  const captionOpacity = interpolate(frame, [transitionDuration, transitionDuration + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        opacity: captionOpacity,
        color: brand.colors.textMuted,
        fontFamily: brand.typography.fontBody,
        fontSize: brand.typography.sizeSm,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  )
}

const CTASection: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          background: `linear-gradient(135deg, ${brand.colors.accent}, ${brand.colors.accentAlt})`,
          color: brand.colors.white,
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.sizeLg,
          fontWeight: brand.typography.weightBold,
          padding: `${brand.spacing.md}px ${brand.spacing.xl}px`,
          borderRadius: brand.spacing.borderRadius,
          boxShadow: `0 8px 32px ${brand.colors.accent}40`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  )
}
