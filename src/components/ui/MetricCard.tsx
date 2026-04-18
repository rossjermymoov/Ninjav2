import { ReactNode } from 'react'
import { NinjaCard } from './NinjaCard'
import { colors, font } from '@/lib/tokens'

interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  trend?: { value: string; positive: boolean }
  accent?: boolean
}

export function MetricCard({ label, value, sub, icon, trend, accent = false }: MetricCardProps) {
  return (
    <NinjaCard padding="20px 24px" style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0,
            fontSize: font.size.sm,
            fontWeight: font.weight.semibold,
            color: colors.textSecondary,
            fontFamily: font.family,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {label}
          </p>

          <p style={{
            margin: '8px 0 0',
            fontSize: font.size['3xl'],
            fontWeight: font.weight.extrabold,
            color: accent ? colors.mint : colors.textPrimary,
            fontFamily: font.family,
            lineHeight: 1,
          }}>
            {value}
          </p>

          {sub && (
            <p style={{
              margin: '6px 0 0',
              fontSize: font.size.sm,
              color: colors.textMuted,
              fontFamily: font.family,
            }}>
              {sub}
            </p>
          )}

          {trend && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 8,
              fontSize: font.size.sm,
              fontWeight: font.weight.semibold,
              color: trend.positive ? colors.mint : colors.statusIssue,
              fontFamily: font.family,
            }}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {icon && (
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: colors.mintGlow,
            border: `1px solid ${colors.borderDim}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: colors.mint,
          }}>
            {icon}
          </div>
        )}
      </div>
    </NinjaCard>
  )
}
