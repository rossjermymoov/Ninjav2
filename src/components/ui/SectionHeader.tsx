import { ReactNode } from 'react'
import { colors, font } from '@/lib/tokens'

interface SectionHeaderProps {
  title: string
  count?: number
  action?: ReactNode
}

export function SectionHeader({ title, count, action }: SectionHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{
          margin: 0,
          fontSize: font.size.lg,
          fontWeight: font.weight.bold,
          color: colors.textPrimary,
          fontFamily: font.family,
        }}>
          {title}
        </h2>
        {count !== undefined && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 26,
            height: 22,
            padding: '0 8px',
            borderRadius: 11,
            background: colors.mintGlow,
            border: `1px solid ${colors.borderMint}`,
            fontSize: font.size.xs,
            fontWeight: font.weight.bold,
            color: colors.mint,
            fontFamily: font.family,
          }}>
            {count}
          </span>
        )}
      </div>
      {action && (
        <div style={{
          fontSize: font.size.sm,
          color: colors.mint,
          fontFamily: font.family,
          fontWeight: font.weight.semibold,
          cursor: 'pointer',
        }}>
          {action}
        </div>
      )}
    </div>
  )
}
