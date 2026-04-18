import { CSSProperties, ReactNode } from 'react'
import { cardStyle, colors, radii, shadows } from '@/lib/tokens'

interface NinjaCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  padding?: number | string
  hover?: boolean
  glow?: boolean
}

export function NinjaCard({ children, className, style, padding = 24, hover = false, glow = false }: NinjaCardProps) {
  return (
    <div
      className={className}
      style={{
        ...cardStyle,
        padding,
        boxShadow: glow ? shadows.glow : hover ? shadows.cardHover : shadows.card,
        transition: 'box-shadow 0.2s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Dimmer variant — mint border replaced with subdued dim green
export function NinjaCardDim({ children, className, style, padding = 24 }: NinjaCardProps) {
  return (
    <div
      className={className}
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.borderDim}`,
        borderRadius: radii.card,
        boxShadow: shadows.card,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
