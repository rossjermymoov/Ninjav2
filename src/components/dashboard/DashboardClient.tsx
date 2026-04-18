'use client'

import React, { useState } from 'react'
import { NinjaCard } from '@/components/ui/NinjaCard'
import { colors, font, radii, shadows } from '@/lib/tokens'
import type { ChannelData } from '@/lib/channels'
import type { CarrierData } from '@/lib/carriers'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardChannelRow {
  slug: string          // matches Channel.slug / CHANNEL_TO_SLUG value
  channelKey: string    // matches our SalesChannel enum key (tiktok, shopify, etc.)
  count: number
}

export interface DashboardCourierRow {
  key: string           // matches Carrier.key
  count: number
}

export interface DashboardData {
  revenue: number
  ordersOutstanding: number
  toDispatch: number
  trackedIssues: number
  collectionRisk: number
  channelCounts: DashboardChannelRow[]
  countries: { flag: string; name: string; count: number }[]
  services: { name: string; count: number }[]
  courierCounts: DashboardCourierRow[]
  collectionAlerts: { orderNo: string; channelSlug: string; service: string; cutoff: string; minsLeft: number }[]
  trackingAlerts: { orderNo: string; carrierKey: string; tracking: string; issue: string }[]
}

export interface DashboardClientProps {
  channelMap: Record<string, ChannelData>    // slug → ChannelData
  carrierMap: Record<string, CarrierData>    // key  → CarrierData
  data: Record<string, DashboardData>        // range label → data
  dateOptions: string[]
}

// ─── Date selector ────────────────────────────────────────────────────────────

function DateSelector({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 2, background: colors.cardBg, border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.pill, padding: 3 }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '5px 14px',
            borderRadius: radii.pill,
            border: 'none',
            background: value === opt ? colors.mint : 'transparent',
            color: value === opt ? colors.cardBg : colors.textSecondary,
            fontSize: font.size.sm,
            fontWeight: font.weight.bold,
            fontFamily: font.family,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ─── Logo image — with text fallback ─────────────────────────────────────────

function LogoImg({ src, name, size = 20 }: { src: string | null; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    // Text initials fallback
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        fontWeight: font.weight.bold,
        color: colors.mint,
        fontFamily: font.family,
        lineHeight: 1,
      }}>
        {initials}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  )
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({ label, value, sub, color, warning }: {
  label: string; value: string; sub?: string; color?: string; warning?: boolean
}) {
  const c = color ?? colors.mint
  return (
    <div style={{
      flex: 1,
      background: colors.cardBg,
      border: `1px solid ${warning ? colors.statusIssue : colors.borderMint}`,
      borderRadius: radii.card,
      padding: '14px 18px',
      boxShadow: warning ? '0 0 12px rgba(255,77,106,0.15)' : shadows.card,
    }}>
      <p style={{ margin: 0, fontSize: font.size.xs, fontWeight: font.weight.semibold, color: colors.textMuted, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </p>
      <p style={{ margin: '6px 0 0', fontSize: font.size['3xl'], fontWeight: font.weight.extrabold, color: c, fontFamily: font.family, lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ margin: '4px 0 0', fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family }}>{sub}</p>}
    </div>
  )
}

// ─── Channel orders row ───────────────────────────────────────────────────────

function ChannelOrders({
  channelCounts,
  channelMap,
}: {
  channelCounts: DashboardChannelRow[]
  channelMap: Record<string, ChannelData>
}) {
  const max   = Math.max(...channelCounts.map(c => c.count), 1)
  const total = channelCounts.reduce((s, c) => s + c.count, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {channelCounts.map((row) => {
        const ch = channelMap[row.slug] ?? { displayName: row.slug, colour: colors.manual, logoUrl: null }
        return (
          <div key={row.slug} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Logo */}
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: colors.surfaceBg,
              border: `1px solid ${colors.borderSubtle}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <LogoImg src={ch.logoUrl ?? null} name={ch.displayName} size={18} />
            </div>
            {/* Name */}
            <span style={{ width: 96, fontSize: font.size.sm, color: colors.textPrimary, fontFamily: font.family, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ch.displayName}
            </span>
            {/* Bar — fixed 160px so it never shifts with data changes */}
            <div style={{ width: 160, height: 8, background: colors.borderSubtle, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
              <div style={{
                width: `${(row.count / max) * 100}%`,
                height: '100%',
                background: ch.colour,
                borderRadius: 4,
                transition: 'width 0.4s ease',
              }} />
            </div>
            {/* Count */}
            <span style={{ width: 36, fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.textPrimary, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
              {row.count}
            </span>
            {/* Pct */}
            <span style={{ width: 36, fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
              {total > 0 ? Math.round((row.count / total) * 100) : 0}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Breakdown mini-list ──────────────────────────────────────────────────────

const PALETTE = [colors.mint, colors.statusShipped, colors.statusProcessing, colors.mintDim]

function BreakdownList({ items, showLogo }: {
  items: { key?: string; name: string; count: number; flag?: string; logoUrl?: string | null }[]
  showLogo?: boolean
}) {
  const max   = Math.max(...items.map(i => i.count), 1)
  const total = items.reduce((s, i) => s + i.count, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {items.map((item, idx) => (
        <div key={item.key ?? item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Logo or flag */}
          {showLogo && (
            <div style={{
              width: 22, height: 22, borderRadius: 4,
              background: colors.surfaceBg,
              border: `1px solid ${colors.borderSubtle}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <LogoImg src={item.logoUrl ?? null} name={item.name} size={14} />
            </div>
          )}
          {item.flag && <span style={{ fontSize: 13, flexShrink: 0 }}>{item.flag}</span>}
          {/* Name */}
          <span style={{ flex: 1, fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
          </span>
          {/* Mini bar — fixed 80px, never shifts */}
          <div style={{ width: 80, height: 5, background: colors.borderSubtle, borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ width: `${(item.count / max) * 100}%`, height: '100%', background: PALETTE[idx % PALETTE.length], borderRadius: 3 }} />
          </div>
          {/* Count */}
          <span style={{ width: 30, fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textPrimary, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
            {item.count}
          </span>
          {/* Pct */}
          <span style={{ width: 30, fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
            {total > 0 ? Math.round((item.count / total) * 100) : 0}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Alert rows ───────────────────────────────────────────────────────────────

function CollectionAlert({
  a, channelMap,
}: {
  a: DashboardData['collectionAlerts'][0]
  channelMap: Record<string, ChannelData>
}) {
  const ch = channelMap[a.channelSlug]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px',
      background: 'rgba(245,166,35,0.07)',
      border: '1px solid rgba(245,166,35,0.25)',
      borderRadius: 10,
      marginBottom: 7,
    }}>
      {ch && (
        <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogoImg src={ch.logoUrl ?? null} name={ch.displayName} size={18} />
        </div>
      )}
      <span style={{ fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.mint, fontFamily: font.family, width: 52, flexShrink: 0 }}>{a.orderNo}</span>
      <span style={{ flex: 1, fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>{a.service}</span>
      <span style={{ fontSize: font.size.sm, color: colors.statusProcessing, fontFamily: font.family, fontWeight: font.weight.bold, flexShrink: 0 }}>⏱ {a.minsLeft}m left</span>
      <span style={{ fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family, flexShrink: 0 }}>cutoff {a.cutoff}</span>
    </div>
  )
}

function TrackingAlert({
  a, carrierMap,
}: {
  a: DashboardData['trackingAlerts'][0]
  carrierMap: Record<string, CarrierData>
}) {
  const carrier = carrierMap[a.carrierKey]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px',
      background: 'rgba(255,77,106,0.07)',
      border: '1px solid rgba(255,77,106,0.20)',
      borderRadius: 10,
      marginBottom: 7,
    }}>
      {carrier && (
        <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogoImg src={carrier.logoUrl ?? null} name={carrier.displayName} size={18} />
        </div>
      )}
      <span style={{ fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.mint, fontFamily: font.family, width: 52, flexShrink: 0 }}>{a.orderNo}</span>
      <span style={{ fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family, width: 70, flexShrink: 0 }}>
        {carrier?.displayName ?? a.carrierKey}
      </span>
      <span style={{ flex: 1, fontSize: font.size.sm, color: colors.statusIssue, fontFamily: font.family }}>{a.issue}</span>
      <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, flexShrink: 0, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {a.tracking}
      </span>
    </div>
  )
}

// ─── Panel label ──────────────────────────────────────────────────────────────

function PanelLabel({ text }: { text: string }) {
  return (
    <p style={{
      margin: '0 0 12px',
      fontSize: font.size.sm,
      fontWeight: font.weight.bold,
      color: colors.textSecondary,
      fontFamily: font.family,
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
    }}>
      {text}
    </p>
  )
}

// ─── Main client component ────────────────────────────────────────────────────

export function DashboardClient({ channelMap, carrierMap, data, dateOptions }: DashboardClientProps) {
  const [range, setRange] = useState(dateOptions[0])
  const d = data[range]

  const fmt = (n: number) => n >= 1000 ? `£${(n / 1000).toFixed(1)}k` : `£${n.toLocaleString()}`

  // Build courier rows with logo data from carrierMap
  const courierItems = d.courierCounts.map(row => {
    const carrier = carrierMap[row.key] ?? { key: row.key, displayName: row.key, logoUrl: null }
    return { key: row.key, name: carrier.displayName, count: row.count, logoUrl: carrier.logoUrl }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: font.size.xl, fontWeight: font.weight.extrabold, color: colors.textPrimary, fontFamily: font.family }}>
          Dashboard
        </h1>
        <DateSelector value={range} options={dateOptions} onChange={setRange} />
      </div>

      {/* Stat strip */}
      <div style={{ display: 'flex', gap: 12 }}>
        <StatChip label="Revenue"            value={fmt(d.revenue)}              sub="gross sales" />
        <StatChip label="Orders Outstanding" value={String(d.ordersOutstanding)} sub="across all channels" color={colors.textPrimary} />
        <StatChip label="Left to Dispatch"   value={String(d.toDispatch)}        sub="need action today"  color={d.toDispatch > 0 ? colors.statusProcessing : colors.mint} warning={d.toDispatch > 5} />
        <StatChip label="Tracking Issues"    value={String(d.trackedIssues)}     sub="parcels flagged"    color={d.trackedIssues > 0 ? colors.statusIssue : colors.mint}      warning={d.trackedIssues > 0} />
        <StatChip label="Collection Risk"    value={String(d.collectionRisk)}    sub="near cutoff time"   color={d.collectionRisk > 0 ? colors.statusProcessing : colors.mint} warning={d.collectionRisk > 0} />
      </div>

      {/* Middle row */}
      <div style={{ display: 'flex', gap: 12 }}>
        <NinjaCard style={{ flex: '1.4 1 0', minWidth: 0 }} padding="18px 20px">
          <PanelLabel text="Orders by Channel" />
          <ChannelOrders channelCounts={d.channelCounts} channelMap={channelMap} />
        </NinjaCard>

        <NinjaCard style={{ flex: '1 1 0', minWidth: 0 }} padding="18px 20px">
          <PanelLabel text={`Collection Cutoff Risk${d.collectionAlerts.length ? ' — cutoff 14:30' : ''}`} />
          {d.collectionAlerts.length > 0
            ? d.collectionAlerts.map((a, i) => <CollectionAlert key={i} a={a} channelMap={channelMap} />)
            : <p style={{ margin: '0 0 12px', fontSize: font.size.md, color: colors.textMuted, fontFamily: font.family }}>No orders at risk ✓</p>
          }

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${colors.borderSubtle}` }}>
            <PanelLabel text="Tracking Issues" />
            {d.trackingAlerts.slice(0, 3).map((a, i) => <TrackingAlert key={i} a={a} carrierMap={carrierMap} />)}
            {d.trackingAlerts.length > 3 && (
              <p style={{ margin: '4px 0 0', fontSize: font.size.sm, color: colors.mint, fontFamily: font.family, cursor: 'pointer' }}>
                +{d.trackingAlerts.length - 3} more issues →
              </p>
            )}
            {d.trackingAlerts.length === 0 && (
              <p style={{ margin: 0, fontSize: font.size.md, color: colors.textMuted, fontFamily: font.family }}>No tracking issues ✓</p>
            )}
          </div>
        </NinjaCard>
      </div>

      {/* Bottom row — 3 breakdowns */}
      <div style={{ display: 'flex', gap: 12 }}>
        <NinjaCard style={{ flex: 1, minWidth: 0 }} padding="18px 20px">
          <PanelLabel text="Shipments by Country" />
          <BreakdownList items={d.countries.map(c => ({ name: c.name, count: c.count, flag: c.flag }))} />
        </NinjaCard>

        <NinjaCard style={{ flex: 1, minWidth: 0 }} padding="18px 20px">
          <PanelLabel text="Shipments by Service" />
          <BreakdownList items={d.services.map(s => ({ name: s.name, count: s.count }))} />
        </NinjaCard>

        <NinjaCard style={{ flex: 1, minWidth: 0 }} padding="18px 20px">
          <PanelLabel text="Shipments by Courier" />
          <BreakdownList items={courierItems} showLogo />
        </NinjaCard>
      </div>

    </div>
  )
}
