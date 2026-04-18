'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
function StatChip({ label, value, sub, color, warning, live, onClick }: {
  label: string; value: string; sub?: string; color?: string; warning?: boolean; live?: boolean; onClick?: () => void
}) {
  const c = color ?? colors.mint
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        background: colors.cardBg,
        border: `1px solid ${warning ? colors.statusIssue : colors.borderMint}`,
        borderRadius: radii.card,
        padding: '14px 18px',
        boxShadow: warning ? '0 0 12px rgba(255,77,106,0.15)' : shadows.card,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'opacity 0.15s' : undefined,
      }}
    >
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

// Chart colours — consistent across all white-bg chart panels
const CHART_GREEN  = '#1DFB9D'
const CHART_PURPLE = '#7B2FBE'
const CHART_TRACK  = 'rgba(123,47,190,0.15)'  // purple tint track = "outstanding" context
const CHART_PINK   = '#CD1C69'                 // outstanding gap segment on stacked bars
const CHART_RING   = '#4103CC'                 // doughnut ring outstanding arc
const CHART_TEXT   = '#171B2D'
const CHART_MUTED  = '#8892A4'
const CHART_LOGO_BG     = '#F5F6FA'
const CHART_LOGO_BORDER = '#E8EAEF'

function ChannelOrders({ channelCounts, channelMap }: {
  channelCounts: DashboardChannelRow[]
  channelMap: Record<string, ChannelData>
}) {
  // Cap at 5 — most customers won't exceed this
  const rows  = channelCounts.slice(0, 5)
  const max   = Math.max(...rows.map(c => c.count), 1)
  const total = rows.reduce((s, c) => s + c.count, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((row) => {
        const ch = channelMap[row.slug] ?? { displayName: row.slug, colour: colors.manual, logoUrl: null }
        return (
          <div key={row.slug} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Logo — bigger container on white card */}
            <div style={{ width: 40, height: 40, borderRadius: 10, background: CHART_LOGO_BG, border: `1px solid ${CHART_LOGO_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LogoImg src={ch.logoUrl ?? null} name={ch.displayName} size={28} />
            </div>
            <span style={{ width: 100, fontSize: font.size.sm, color: CHART_TEXT, fontFamily: font.family, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: font.weight.semibold }}>
              {ch.displayName}
            </span>
            {/* Bar: green fill (dispatched) on purple-tint track (outstanding context) */}
            <div style={{ flex: 1, height: 8, background: CHART_TRACK, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${(row.count / max) * 100}%`, height: '100%', background: CHART_GREEN, borderRadius: 4, transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ width: 36, fontSize: font.size.md, fontWeight: font.weight.bold, color: CHART_TEXT, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
              {row.count}
            </span>
            <span style={{ width: 36, fontSize: font.size.sm, color: CHART_MUTED, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
              {total > 0 ? Math.round((row.count / total) * 100) : 0}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Doughnut chart (single-item view) ────────────────────────────────────────

function DoughnutChart({
  dispatched, outstanding, label, flag, logoUrl, logoName,
}: {
  dispatched: number; outstanding: number
  label: string; flag?: string
  logoUrl?: string | null; logoName?: string
}) {
  const total     = dispatched + outstanding
  const pct       = total > 0 ? dispatched / total : 1
  const pctText   = Math.round(pct * 100)
  const size      = 136
  const cx = size / 2, cy = size / 2
  const sw        = 30
  const R         = (size / 2) - sw / 2 - 2
  const circ      = 2 * Math.PI * R
  const greenDash = pct * circ

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* Ring */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring — purple/outstanding */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={CHART_RING} strokeWidth={sw} />
          {/* Green arc — dispatched */}
          <circle
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={CHART_GREEN}
            strokeWidth={sw}
            strokeDasharray={`${greenDash} ${circ}`}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        </svg>
        {/* Centre percentage */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 26, fontWeight: font.weight.extrabold, color: CHART_TEXT, fontFamily: font.family, lineHeight: 1 }}>
            {pctText}%
          </span>
          <span style={{ fontSize: 10, color: CHART_MUTED, fontFamily: font.family, marginTop: 3 }}>dispatched</span>
        </div>
      </div>

      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {flag && <span style={{ fontSize: 18 }}>{flag}</span>}
        {logoUrl !== undefined && (
          <div style={{ width: 28, height: 28, borderRadius: 7, background: CHART_LOGO_BG, border: `1px solid ${CHART_LOGO_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoImg src={logoUrl ?? null} name={logoName ?? label} size={20} />
          </div>
        )}
        <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: CHART_TEXT, fontFamily: font.family }}>
          {label}
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: CHART_MUTED, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dispatched</span>
          <span style={{ fontSize: font.size.lg, fontWeight: font.weight.bold, color: CHART_GREEN, fontFamily: font.family }}>{dispatched}</span>
        </div>
        {outstanding > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: CHART_MUTED, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Outstanding</span>
            <span style={{ fontSize: font.size.lg, fontWeight: font.weight.bold, color: CHART_RING, fontFamily: font.family }}>{outstanding}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Breakdown chart — stacked bars (multi-item) or doughnut (single-item) ────

function BreakdownChart({
  items, showLogo, ordersWaiting = 0,
}: {
  items: { key?: string; name: string; count: number; flag?: string; logoUrl?: string | null }[]
  showLogo?: boolean
  ordersWaiting?: number
}) {
  const max = Math.max(...items.map(i => i.count), 1)

  // ── Single item → doughnut ────────────────────────────────────────────────
  if (items.length === 1) {
    const item = items[0]
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: 8 }}>
        <DoughnutChart
          dispatched={item.count}
          outstanding={ordersWaiting}
          label={item.name}
          flag={item.flag}
          logoUrl={showLogo ? (item.logoUrl ?? null) : undefined}
          logoName={item.name}
        />
      </div>
    )
  }

  // ── Multiple items → stacked horizontal bars ──────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {items.map((item) => {
        const greenPct = (item.count / max) * 100
        const pinkPct  = 100 - greenPct

        return (
          <div key={item.key ?? item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* Left identifier — logo / flag / text label */}
            {showLogo && (
              <div style={{ width: 36, height: 36, borderRadius: 8, background: CHART_LOGO_BG, border: `1px solid ${CHART_LOGO_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LogoImg src={item.logoUrl ?? null} name={item.name} size={24} />
              </div>
            )}
            {item.flag && (
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{item.flag}</span>
            )}
            {!showLogo && (
              <span style={{ width: item.flag ? 64 : 80, fontSize: font.size.xs, color: CHART_TEXT, fontFamily: font.family, fontWeight: font.weight.semibold, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </span>
            )}

            {/* Stacked bar: green dispatched + pink gap-to-max */}
            <div style={{ flex: 1, height: 32, display: 'flex', borderRadius: 6, overflow: 'hidden', minWidth: 0 }}>
              <div style={{ width: `${greenPct}%`, background: CHART_GREEN, flexShrink: 0 }} />
              {pinkPct > 0.2 && <div style={{ flex: 1, background: CHART_PINK }} />}
            </div>

            {/* Count */}
            <span style={{ width: 26, fontSize: font.size.sm, fontWeight: font.weight.bold, color: CHART_TEXT, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>
              {item.count}
            </span>
          </div>
        )
      })}
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

// onWhite=true → dark muted text for white-background chart cards
function PanelLabel({ text, onWhite }: { text: string; onWhite?: boolean }) {
  return (
    <p style={{ margin: '0 0 12px', fontSize: font.size.sm, fontWeight: font.weight.bold, color: onWhite ? '#8892A4' : colors.textSecondary, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {text}
    </p>
  )
}

// ─── Main client component ────────────────────────────────────────────────────

export function DashboardClient({ channelMap, carrierMap, rangeData, liveData, dateOptions }: DashboardClientProps) {
  const [range, setRange] = useState(dateOptions[0])
  const router = useRouter()
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
      {/* Dispatched responds to the date selector.                        */}
      {/* Orders Waiting, Alerts, Near Cut-off, Success Rating = live now  */}
      <div style={{ display: 'flex', gap: 12 }}>
        <StatChip
          label="Orders Dispatched"
          value={String(d.ordersDispatched)}
          sub={`sent ${range.toLowerCase()}`}
          color={colors.mint}
        />
        <StatChip
          label="Orders Waiting"
          value={String(live.ordersWaiting)}
          sub="in queue right now"
          color={CHART_PURPLE}
          warning={live.ordersWaiting > 20}
          live
        />
        <AlertsChip
          trackingIssues={live.trackingIssues}
          serviceAlerts={live.serviceAlerts}
        />
        <StatChip
          label="Near Cut-off"
          value={String(live.nearCutoff)}
          sub="tap to view orders"
          color={live.nearCutoff > 0 ? CHART_PURPLE : colors.mint}
          warning={live.nearCutoff > 0}
          live
          onClick={() => router.push('/orders?filter=nearCutoff')}
        />
        <StatChip
          label="Ninja Success Rating"
          value={(() => {
            const total = d.ordersDispatched + live.ordersWaiting
            return total > 0 ? `${Math.round((d.ordersDispatched / total) * 100)}%` : '—'
          })()}
          sub="dispatched vs waiting"
          color={(() => {
            const total = d.ordersDispatched + live.ordersWaiting
            const pct = total > 0 ? (d.ordersDispatched / total) * 100 : 100
            return pct >= 80 ? colors.mint : pct >= 50 ? colors.statusProcessing : colors.statusIssue
          })()}
        />
      </div>

      {/* ── Middle row — each card exactly 50% ── */}
      <div style={{ display: 'flex', gap: 12 }}>

        {/* Channel breakdown — follows date range */}
        <NinjaCard style={{ flex: '1 1 0', minWidth: 0, background: '#fff' }} padding="18px 20px">
          <PanelLabel text="Orders by Channel" onWhite />
          <ChannelOrders channelCounts={d.channelCounts} channelMap={channelMap} />
        </NinjaCard>

        {/* Live alerts panel — always right now */}
        <NinjaCard style={{ flex: '1 1 0', minWidth: 0 }} padding="18px 20px">

          {/* Panel header — label + Live dot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <PanelLabel text="Live Alerts" />
            <span style={{ fontSize: font.size.xs, color: colors.mintDim, fontFamily: font.family, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: colors.mint, display: 'inline-block' }} />
              Live
            </span>
          </div>

          {/* Scrollable alerts body */}
          <div className="mn-alerts-scroll" style={{ maxHeight: 230, paddingRight: 4 }}>

            {/* Tracking issues */}
            <PanelLabel text="Tracking Issues" />
            {live.trackingAlerts.length > 0
              ? live.trackingAlerts.map((a, i) => <TrackingAlert key={i} a={a} carrierMap={carrierMap} />)
              : <p style={{ margin: '0 0 10px', fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family }}>No tracking issues ✓</p>
            }

            {/* Service alerts */}
            {live.serviceAlertList.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${colors.borderSubtle}` }}>
                <PanelLabel text="Service Alerts" />
                {live.serviceAlertList.map((a, i) => <ServiceAlertRow key={i} a={a} />)}
              </div>
            )}

          </div>
        </NinjaCard>
      </div>

      {/* ── Bottom row — 3 breakdowns, all follow date range ── */}
      <div style={{ display: 'flex', gap: 12 }}>
        <NinjaCard style={{ flex: 1, minWidth: 0, background: '#fff', display: 'flex', flexDirection: 'column' }} padding="18px 20px">
          <PanelLabel text="Shipments by Country" onWhite />
          <BreakdownChart
            items={d.countries.map(c => ({ name: c.name, count: c.count, flag: c.flag }))}
            ordersWaiting={live.ordersWaiting}
          />
        </NinjaCard>

        <NinjaCard style={{ flex: 1, minWidth: 0, background: '#fff', display: 'flex', flexDirection: 'column' }} padding="18px 20px">
          <PanelLabel text="Shipments by Service" onWhite />
          <BreakdownChart
            items={d.services.map(s => ({ name: s.name, count: s.count }))}
            ordersWaiting={live.ordersWaiting}
          />
        </NinjaCard>

        <NinjaCard style={{ flex: 1, minWidth: 0, background: '#fff', display: 'flex', flexDirection: 'column' }} padding="18px 20px">
          <PanelLabel text="Shipments by Courier" onWhite />
          <BreakdownChart
            items={courierItems}
            showLogo
            ordersWaiting={live.ordersWaiting}
          />
        </NinjaCard>
      </div>

    </div>
  )
}
