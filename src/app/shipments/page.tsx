'use client'

import { NinjaCard } from '@/components/ui/NinjaCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MOCK_SHIPMENTS, MOCK_TOTAL_SHIPMENTS, type Shipment, type ShipmentStatus } from '@/lib/mock/shipments'
import { colors, font, radii } from '@/lib/tokens'

// ─── NinjaTracker — 5-stage pipeline visual ──────────────────────────────────

const STAGES: { key: ShipmentStatus; label: string }[] = [
  { key: 'ordered',    label: 'Ordered' },
  { key: 'processing', label: 'Processing' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered',  label: 'Delivered' },
]

const STAGE_ORDER: Record<ShipmentStatus, number> = {
  ordered:    0,
  processing: 1,
  dispatched: 2,
  in_transit: 3,
  delivered:  4,
  issue:      -1,
}

function NinjaTracker({ status }: { status: ShipmentStatus }) {
  const activeIdx = STAGE_ORDER[status]
  const isIssue = status === 'issue'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%' }}>
      {STAGES.map((stage, i) => {
        const isDone    = !isIssue && activeIdx > i
        const isActive  = !isIssue && activeIdx === i
        const isPending = isIssue || activeIdx < i

        const nodeColor = isDone
          ? colors.mint
          : isActive
          ? colors.mint
          : colors.borderSubtle

        const lineColor = isDone ? colors.mint : colors.borderSubtle

        return (
          <div key={stage.key} style={{ display: 'flex', alignItems: 'center', flex: i < STAGES.length - 1 ? 1 : 'none' }}>
            {/* Stage node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: isDone ? colors.mint : isActive ? 'transparent' : 'transparent',
                border: `2px solid ${nodeColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: isActive ? `0 0 8px ${colors.mint}` : 'none',
                transition: 'all 0.2s',
              }}>
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke={colors.cardBg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {isActive && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.mint }} />
                )}
              </div>
              <span style={{
                fontSize: font.size.xs,
                fontWeight: isActive ? font.weight.bold : font.weight.regular,
                color: isDone || isActive ? colors.textPrimary : colors.textMuted,
                fontFamily: font.family,
                whiteSpace: 'nowrap',
              }}>
                {stage.label}
              </span>
            </div>

            {/* Connector line — not after last node */}
            {i < STAGES.length - 1 && (
              <div style={{
                flex: 1,
                height: 2,
                background: lineColor,
                marginBottom: 18,
                transition: 'background 0.2s',
              }} />
            )}
          </div>
        )
      })}

      {/* Issue state overlay label */}
      {isIssue && (
        <span style={{
          marginLeft: 8,
          fontSize: font.size.sm,
          fontWeight: font.weight.semibold,
          color: colors.statusIssue,
          fontFamily: font.family,
          flexShrink: 0,
        }}>
          ⚠ Issue
        </span>
      )}
    </div>
  )
}

// ─── Shipment card (expanded detail view) ────────────────────────────────────

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const badgeStatus: 'ready' | 'processing' | 'issue' | 'shipped' | 'delivered' | 'pending' =
    shipment.status === 'delivered'  ? 'delivered'  :
    shipment.status === 'in_transit' ? 'shipped'    :
    shipment.status === 'dispatched' ? 'shipped'    :
    shipment.status === 'processing' ? 'processing' :
    shipment.status === 'issue'      ? 'issue'      :
    'pending'

  return (
    <NinjaCard padding="20px 24px" style={{ marginBottom: 12 }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>

        {/* Left: order + customer */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.mint, fontFamily: font.family }}>
              {shipment.orderNumber}
            </span>
            <StatusBadge status={badgeStatus} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: font.size.md, color: colors.textPrimary, fontFamily: font.family }}>
              {shipment.customerName}
            </span>
            <span style={{ fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family }}>
              {shipment.countryFlag} {shipment.postcode}
            </span>
          </div>
        </div>

        {/* Right: carrier + tracking */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary, fontFamily: font.family }}>
            {shipment.carrier}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family }}>
            {shipment.trackingNumber}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>
            {shipment.service}
          </p>
        </div>
      </div>

      {/* Tracker */}
      <div style={{ marginBottom: 16 }}>
        <NinjaTracker status={shipment.status} />
      </div>

      {/* Bottom meta row */}
      <div style={{
        display: 'flex',
        gap: 24,
        paddingTop: 12,
        borderTop: `1px solid ${colors.borderSubtle}`,
      }}>
        {shipment.dispatchedAt && (
          <div>
            <p style={{ margin: 0, fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dispatched</p>
            <p style={{ margin: '2px 0 0', fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>{shipment.dispatchedAt}</p>
          </div>
        )}
        <div>
          <p style={{ margin: 0, fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Delivery</p>
          <p style={{ margin: '2px 0 0', fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>{shipment.estimatedDelivery}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight</p>
          <p style={{ margin: '2px 0 0', fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>{shipment.weight}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</p>
          <p style={{ margin: '2px 0 0', fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>{shipment.items}</p>
        </div>
      </div>
    </NinjaCard>
  )
}

// ─── Summary chips ────────────────────────────────────────────────────────────

function SummaryChip({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '14px 20px',
      background: `${color}14`,
      border: `1px solid ${color}40`,
      borderRadius: radii.card,
      minWidth: 90,
      flex: 1,
    }}>
      <span style={{ fontSize: font.size['2xl'], fontWeight: font.weight.extrabold, color, fontFamily: font.family, lineHeight: 1 }}>{count}</span>
      <span style={{ marginTop: 4, fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>{label}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShipmentsPage() {
  const inTransit  = MOCK_SHIPMENTS.filter(s => s.status === 'in_transit').length
  const dispatched = MOCK_SHIPMENTS.filter(s => s.status === 'dispatched').length
  const delivered  = MOCK_SHIPMENTS.filter(s => s.status === 'delivered').length
  const issues     = MOCK_SHIPMENTS.filter(s => s.status === 'issue').length
  const pending    = MOCK_SHIPMENTS.filter(s => s.status === 'ordered' || s.status === 'processing').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page title */}
      <div>
        <h1 style={{ margin: 0, fontSize: font.size['2xl'], fontWeight: font.weight.extrabold, color: colors.textPrimary, fontFamily: font.family }}>
          Shipments
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: font.size.md, color: colors.textSecondary, fontFamily: font.family }}>
          Ninja Tracking — live shipment pipeline
        </p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 12 }}>
        <SummaryChip label="In Transit"  count={inTransit}  color={colors.statusShipped} />
        <SummaryChip label="Dispatched"  count={dispatched} color={colors.mint} />
        <SummaryChip label="Delivered"   count={delivered}  color={colors.mintDim} />
        <SummaryChip label="Pending"     count={pending}    color={colors.statusProcessing} />
        <SummaryChip label="Issues"      count={issues}     color={colors.statusIssue} />
      </div>

      {/* Shipment cards */}
      <div>
        <SectionHeader title="All Shipments" count={MOCK_TOTAL_SHIPMENTS} />
        <div>
          {MOCK_SHIPMENTS.map((s) => (
            <ShipmentCard key={s.id} shipment={s} />
          ))}
        </div>
      </div>

    </div>
  )
}
