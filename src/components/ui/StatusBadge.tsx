import { colors, font, radii } from '@/lib/tokens'

type BadgeVariant = 'ready' | 'processing' | 'issue' | 'shipped' | 'delivered' | 'pending'

const VARIANTS: Record<BadgeVariant, { bg: string; color: string; label: string }> = {
  ready:      { bg: colors.statusReadyBg,      color: colors.statusReady,      label: 'Ready' },
  processing: { bg: colors.statusProcessingBg, color: colors.statusProcessing, label: 'Processing' },
  issue:      { bg: colors.statusIssueBg,      color: colors.statusIssue,      label: 'Issue' },
  shipped:    { bg: colors.statusShippedBg,    color: colors.statusShipped,    label: 'Shipped' },
  delivered:  { bg: colors.statusDeliveredBg,  color: colors.statusDelivered,  label: 'Delivered' },
  pending:    { bg: colors.statusProcessingBg, color: colors.statusProcessing, label: 'Pending' },
}

interface StatusBadgeProps {
  status: BadgeVariant
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const v = VARIANTS[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: v.bg,
        color: v.color,
        borderRadius: radii.badge,
        padding: '3px 10px',
        fontSize: font.size.sm,
        fontWeight: font.weight.semibold,
        fontFamily: font.family,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Dot indicator */}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: v.color,
          flexShrink: 0,
        }}
      />
      {label ?? v.label}
    </span>
  )
}
