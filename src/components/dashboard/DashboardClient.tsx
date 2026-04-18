'use client'

import React, { useState } from 'react'
import { NinjaCard } from '@/components/ui/NinjaCard'
import { colors, font, radii, shadows } from '@/lib/tokens'
import type { ChannelData } from '@/lib/channels'
import type { CarrierData } from '@/lib/carriers'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardChannelRow {
  slug: string
  channelKey: string
  count: number
}

export interface DashboardCourierRow {
  key: string
  count: number
}

// Date-range-dependent data — changes when the selector changes
export interface RangeData {
  revenue: number
  ordersDispatched: number
  channelCounts: DashboardChannelRow[]
  countries: { flag: string; name: string; count: number }[]
  services: { name: string; count: number }[]
  courierCounts: DashboardCourierRow[]
}

// Live "right now" data — never changes with date range
export interface LiveData {
  ordersWaiting: number       // orders in queue waiting to be dispatched
  trackingIssues: number      // parcels with a tracking problem
  serviceAlerts: number       // service/API/carrier alerts
  nearCutoff: number          // orders at risk of missing collection cutoff
  collectionAlerts: { orderNo: string; channelSlug: string; service: string; cutoff: string; minsLeft: number }[]
  trackingAlerts: { orderNo: string; carrierKey: string; tracking: string; issue: string }[]
  serviceAlertList: { message: string; severity: 'warn' | 'info' }[]
}

export interface DashboardClientProps {
  channelMap: Record<string, ChannelData>
  carrierMap: Record<string, CarrierData>
  rangeData: Record<string, RangeData>   // keyed by date option label
  liveData: LiveData                      // fixed — does not change with range
  dateOptions: string[]
}

// ─── Date selector ────────────────────────────────────────────────────────────

function DateSelector({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 2, background: colors.cardBg, border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.pill, padding: 3 }}>
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)} style={{
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
        }}>
          {opt}
        </button>
      ))}
    </div>
  )
}

// ─── Logo image ───────────────────────────────────────────────────────────────

function LogoImg({ src, name, size = 20 }: { src: string | null; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, fontSize: Math.round(size * 0.4), fontWeight: font.weight.bold, color: colors.mint, fontFamily: font.family, lineHeight: 1 }}>
        {initials}
      </span>
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={name} width={size} height={size} onError={() => setFailed(true)} style={{ objectFit: 'contain', display: 'block' }} />
}

// ─── Stat chips ───────────────────────────────────────────────────────────────

// Standard chip — single number
function StatChip({ label, value, sub, color, warning, live }: {
  label: string; value: string; sub?: string; color?: string; warning?: boolean; live?: boolean
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
      position: 'relative',
    }}>
      {live && (
        <span style={{
          position: 'absolute', top: 10, right: 12,
          fontSize: font.size.xs, color: colors.mintDim, fontFamily: font.family,
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: colors.mint, display: 'inline-block' }} />
          Live
        </span>
      )}
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

// Alerts chip — shows tracking + service as two sub-values
function AlertsChip({ trackingIssues, serviceAlerts }: { trackingIssues: number; serviceAlerts: number }) {
  const total = trackingIssues + serviceAlerts
  const hasAlert = total > 0
  return (
    <div style={{
      flex: 1,
      background: colors.cardBg,
      border: `1px solid ${hasAlert ? colors.statusIssue : colors.borderMint}`,
      borderRadius: radii.card,
      padding: '14px 18px',
      boxShadow: hasAlert ? '0 0 12px rgba(255,77,106,0.15)' : shadows.card,
      position: 'relative',
    }}>
      <span style={{
        position: 'absolute', top: 10, right: 12,
        fontSize: font.size.xs, color: colors.mintDim, fontFamily: font.family,
        display: 'flex', alignItems: 'center', gap: 3,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: colors.mint, display: 'inline-block' }} />
        Live
      </span>
      <p style={{ margin: 0, fontSize: font.size.xs, fontWeight: font.weight.semibold, color: colors.textMuted, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Alerts
      </p>
      <p style={{ margin: '6px 0 0', fontSize: font.size['3xl'], fontWeight: font.weight.extrabold, color: hasAlert ? colors.statusIssue : colors.mint, fontFamily: font.family, lineHeight: 1 }}>
        {total}
      </p>
      {/* Two-line breakdown */}
      <div style={{ marginTop: 6, display: 'flex', gap: 10 }}>
        <span style={{ fontSize: font.size.xs, fontFamily: font.family, color: trackingIssues > 0 ? colors.statusIssue : colors.textMuted }}>
          {trackingIssues} tracking
        </span>
        <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family }}>·</span>
        <span style={{ fontSize: font.size.xs, fontFamily: font.family, color: serviceAlerts > 0 ? colors.statusProcessing : colors.textMuted }}>
          {serviceAlerts} service
        </span>
      </div>
    </div>
  )
}

// ─── Channel orders panel ─────────────────────────────────────────────────────

function ChannelOrders({ channelCounts, channelMap }: {
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
          <div key={row.slug} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: colors.surfaceBg, border: `1px solid ${colors.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LogoImg src={ch.logoUrl ?? null} name={ch.displayName} size={24} />
            </div>
            <span style={{ width: 100, fontSize: font.size.sm, color: colors.textPrimary, fontFamily: font.family, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ch.displayName}
            </span>
            {/* Bar fills remaining space — flex: 1, not fixed width */}
            <div style={{ flex: 1, height: 8, background: colors.borderSubtle, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${(row.count / max) * 100}%`, height: '100%', background: ch.colour, borderRadius: 4, transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ width: 36, fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.textPrimary, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
              {row.count}
            </span>
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
          {showLogo && (
            <div style={{ width: 30, height: 30, borderRadius: 6, background: colors.surfaceBg, border: `1px solid ${colors.borderSubtle}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LogoImg src={item.logoUrl ?? null} name={item.name} size={20} />
            </div>
          )}
          {item.flag && <span style={{ fontSize: 13, flexShrink: 0 }}>{item.flag}</span>}
          <span style={{ flex: 1, fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
          </span>
          {/* Fixed 80px bar */}
          <div style={{ width: 80, height: 5, background: colors.borderSubtle, borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ width: `${(item.count / max) * 100}%`, height: '100%', background: PALETTE[idx % PALETTE.length], borderRadius: 3 }} />
          </div>
          <span style={{ width: 30, fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textPrimary, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
            {item.count}
          </span>
          <span style={{ width: 30, fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
            {total > 0 ? Math.round((item.count / total) * 100) : 0}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Alert rows ───────────────────────────────────────────────────────────────

function CollectionAlert({ a, channelMap }: { a: LiveData['collectionAlerts'][0]; channelMap: Record<string, ChannelData> }) {
  const ch = channelMap[a.channelSlug]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 10, marginBottom: 7 }}>
      {ch && <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogoImg src={ch.logoUrl ?? null} name={ch.displayName} size={18} /></div>}
      <span style={{ fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.mint, fontFamily: font.family, width: 52, flexShrink: 0 }}>{a.orderNo}</span>
      <span style={{ flex: 1, fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>{a.service}</span>
      <span style={{ fontSize: font.size.sm, color: colors.statusProcessing, fontFamily: font.family, fontWeight: font.weight.bold, flexShrink: 0 }}>⏱ {a.minsLeft}m left</span>
      <span style={{ fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family, flexShrink: 0 }}>cutoff {a.cutoff}</span>
    </div>
  )
}

function TrackingAlert({ a, carrierMap }: { a: LiveData['trackingAlerts'][0]; carrierMap: Record<string, CarrierData> }) {
  const carrier = carrierMap[a.carrierKey]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,77,106,0.07)', border: '1px solid rgba(255,77,106,0.20)', borderRadius: 10, marginBottom: 7 }}>
      {carrier && <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogoImg src={carrier.logoUrl ?? null} name={carrier.displayName} size={18} /></div>}
      <span style={{ fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.mint, fontFamily: font.family, width: 52, flexShrink: 0 }}>{a.orderNo}</span>
      <span style={{ fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family, width: 74, flexShrink: 0 }}>{carrier?.displayName ?? a.carrierKey}</span>
      <span style={{ flex: 1, fontSize: font.size.sm, color: colors.statusIssue, fontFamily: font.family }}>{a.issue}</span>
      <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, flexShrink: 0, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.tracking}</span>
    </div>
  )
}

function ServiceAlertRow({ a }: { a: LiveData['serviceAlertList'][0] }) {
  const c = a.severity === 'warn' ? colors.statusProcessing : colors.statusShipped
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: a.severity === 'warn' ? 'rgba(245,166,35,0.07)' : 'rgba(77,166,255,0.07)', border: `1px solid ${a.severity === 'warn' ? 'rgba(245,166,35,0.25)' : 'rgba(77,166,255,0.20)'}`, borderRadius: 10, marginBottom: 7 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: font.size.sm, color: colors.textPrimary, fontFamily: font.family }}>{a.message}</span>
    </div>
  )
}

// ─── Panel label ──────────────────────────────────────────────────────────────

function PanelLabel({ text }: { text: string }) {
  return (
    <p style={{ margin: '0 0 12px', fontSize: font.size.sm, fontWeight: font.weight.bold, color: colors.textSecondary, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {text}
    </p>
  )
}

// ─── Main client component ────────────────────────────────────────────────────

export function DashboardClient({ channelMap, carrierMap, rangeData, liveData, dateOptions }: DashboardClientProps) {
  const [range, setRange] = useState(dateOptions[0])
  const d = rangeData[range]
  const live = liveData

  const fmt = (n: number) => n >= 1000 ? `£${(n / 1000).toFixed(1)}k` : `£${n.toLocaleString()}`

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

      {/* ── Stat strip ── */}
      {/* Revenue + Dispatched respond to the date selector.        */}
      {/* Orders Waiting, Alerts, Near Cut-off are always "right now" */}
      <div style={{ display: 'flex', gap: 12 }}>
        <StatChip
          label="Revenue"
          value={fmt(d.revenue)}
          sub={`${range.toLowerCase()}`}
        />
        <StatChip
          label="Orders Waiting"
          value={String(live.ordersWaiting)}
          sub="in queue right now"
          color={live.ordersWaiting > 0 ? colors.statusProcessing : colors.mint}
          warning={live.ordersWaiting > 20}
          live
        />
        <StatChip
          label="Orders Dispatched"
          value={String(d.ordersDispatched)}
          sub={`sent ${range.toLowerCase()}`}
          color={colors.mint}
        />
        <AlertsChip
          trackingIssues={live.trackingIssues}
          serviceAlerts={live.serviceAlerts}
        />
        <StatChip
          label="Near Cut-off"
          value={String(live.nearCutoff)}
          sub="at risk of missing"
          color={live.nearCutoff > 0 ? colors.statusProcessing : colors.mint}
          warning={live.nearCutoff > 0}
          live
        />
      </div>

      {/* ── Middle row — each card exactly 50% ── */}
      <div style={{ display: 'flex', gap: 12 }}>

        {/* Channel breakdown — follows date range */}
        <NinjaCard style={{ flex: '1 1 0', minWidth: 0 }} padding="18px 20px">
          <PanelLabel text="Orders by Channel" />
          <ChannelOrders channelCounts={d.channelCounts} channelMap={channelMap} />
        </NinjaCard>

        {/* Live alerts panel — always right now */}
        <NinjaCard style={{ flex: '1 1 0', minWidth: 0 }} padding="18px 20px">
          {/* Collection cutoff */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <PanelLabel text="Near Cut-off" />
            <span style={{ fontSize: font.size.xs, color: colors.mintDim, fontFamily: font.family, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: colors.mint, display: 'inline-block' }} />
              Live
            </span>
          </div>
          {live.collectionAlerts.length > 0
            ? live.collectionAlerts.map((a, i) => <CollectionAlert key={i} a={a} channelMap={channelMap} />)
            : <p style={{ margin: '0 0 4px', fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family }}>No orders at risk ✓</p>
          }

          {/* Tracking issues */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${colors.borderSubtle}` }}>
            <PanelLabel text="Tracking Issues" />
            {live.trackingAlerts.slice(0, 3).map((a, i) => <TrackingAlert key={i} a={a} carrierMap={carrierMap} />)}
            {live.trackingAlerts.length > 3 && (
              <p style={{ margin: '4px 0 0', fontSize: font.size.sm, color: colors.mint, fontFamily: font.family, cursor: 'pointer' }}>+{live.trackingAlerts.length - 3} more →</p>
            )}
            {live.trackingAlerts.length === 0 && (
              <p style={{ margin: '0 0 4px', fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family }}>No tracking issues ✓</p>
            )}
          </div>

          {/* Service alerts */}
          {live.serviceAlertList.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${colors.borderSubtle}` }}>
              <PanelLabel text="Service Alerts" />
              {live.serviceAlertList.map((a, i) => <ServiceAlertRow key={i} a={a} />)}
            </div>
          )}
        </NinjaCard>
      </div>

      {/* ── Bottom row — 3 breakdowns, all follow date range ── */}
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
