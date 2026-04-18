'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MOCK_SHIPMENTS, MOCK_TOTAL_SHIPMENTS, type Shipment, type TrackingEventType } from '@/lib/mock/shipments'
import { colors, font, radii } from '@/lib/tokens'

// ─── Tracking event config ────────────────────────────────────────────────────

const PIPELINE: TrackingEventType[] = [
  'booked',
  'collected',
  'in_transit_to_depot',
  'at_collection_depot',
  'in_transit_to_hub',
  'at_hub',
  'in_transit_to_receiving',
  'at_receiving_depot',
  'out_for_delivery',
  'delivered',
]

const PROBLEM_EVENTS = new Set<TrackingEventType>([
  'on_hold', 'address_issue', 'customs_hold', 'returned_to_sender',
])

const EVENT_LABEL: Record<TrackingEventType, string> = {
  booked:                   'Booked',
  collected:                'Collected',
  in_transit_to_depot:      'In Transit',
  at_collection_depot:      'At Collection Depot',
  in_transit_to_hub:        'In Transit',
  at_hub:                   'At Hub',
  in_transit_to_receiving:  'In Transit',
  at_receiving_depot:       'At Receiving Depot',
  out_for_delivery:         'Out for Delivery',
  delivered:                'Delivered',
  on_hold:                  'On Hold',
  address_issue:            'Address Issue',
  customs_hold:             'Customs Hold',
  returned_to_sender:       'Returned to Sender',
}

const RED    = colors.statusIssue    // #FF4D6A
const MINT   = colors.mint           // #1DFB9D
const AMBER  = colors.statusProcessing
const BLUE   = colors.statusShipped

// Status label + colour for the compact badge in the row
function eventBadgeConfig(evt: TrackingEventType): { label: string; color: string; bg: string } {
  if (PROBLEM_EVENTS.has(evt)) return { label: EVENT_LABEL[evt], color: RED, bg: `${RED}20` }
  if (evt === 'delivered')         return { label: 'Delivered', color: MINT, bg: `${MINT}18` }
  if (evt === 'out_for_delivery')  return { label: 'Out for Delivery', color: BLUE, bg: `${BLUE}18` }
  if (evt === 'booked')            return { label: 'Booked', color: AMBER, bg: `${AMBER}18` }
  return { label: EVENT_LABEL[evt], color: MINT, bg: `${MINT}12` }
}

// ─── Tracking timeline ────────────────────────────────────────────────────────

function TrackingTimeline({ shipment }: { shipment: Shipment }) {
  const M = font.family
  const events = shipment.trackingEvents
  const last   = events[events.length - 1]
  const isProblem = PROBLEM_EVENTS.has(shipment.currentEvent)

  return (
    <div style={{ padding: '16px 20px 20px', background: 'rgba(29,251,157,0.03)', borderTop: `1px solid ${colors.borderSubtle}` }}>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {events.map((ev, i) => {
          const isProb  = PROBLEM_EVENTS.has(ev.type)
          const isCurrent = i === events.length - 1
          const dotColor = isProb ? RED : MINT
          return (
            <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
              {/* Vertical line */}
              {i < events.length - 1 && (
                <div style={{ position: 'absolute', left: 9, top: 22, bottom: -2, width: 2, background: isProb ? `${RED}40` : `${MINT}30` }} />
              )}
              {/* Dot */}
              <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                background: isCurrent && !isProb ? 'transparent' : (isProb ? RED : MINT),
                border: `2px solid ${dotColor}`,
                boxShadow: isCurrent ? `0 0 8px ${dotColor}80` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isCurrent && !isProb && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: MINT }} />
                )}
                {isProb && (
                  <span style={{ fontSize: 10, color: '#fff', lineHeight: 1 }}>!</span>
                )}
                {!isCurrent && !isProb && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l1.8 1.8L6.5 2" stroke={colors.cardBg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              {/* Event info */}
              <div style={{ paddingBottom: 16 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontSize: font.size.sm, fontWeight: isProb || isCurrent ? font.weight.bold : font.weight.semibold, color: isProb ? RED : (isCurrent ? MINT : colors.textPrimary), fontFamily: M }}>
                    {EVENT_LABEL[ev.type]}
                  </span>
                  <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: M }}>
                    {ev.timestamp}
                  </span>
                </div>
                {ev.location && (
                  <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: M }}>{ev.location}</span>
                )}
              </div>
            </div>
          )
        })}

        {/* Pending future stages (greyed out) */}
        {!isProblem && shipment.currentEvent !== 'delivered' && (() => {
          const doneIdx = PIPELINE.indexOf(last.type)
          const remaining = PIPELINE.slice(doneIdx + 1)
          return remaining.map((stage, i) => (
            <div key={`pend-${i}`} style={{ display: 'flex', gap: 12, position: 'relative' }}>
              {i < remaining.length - 1 && (
                <div style={{ position: 'absolute', left: 9, top: 22, bottom: -2, width: 2, background: colors.borderSubtle }} />
              )}
              <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2, border: `2px solid ${colors.borderSubtle}`, background: 'transparent' }} />
              <div style={{ paddingBottom: 14 }}>
                <span style={{ fontSize: font.size.sm, color: colors.textMuted, fontFamily: M }}>{EVENT_LABEL[stage]}</span>
              </div>
            </div>
          ))
        })()}
      </div>

      {/* Est. delivery footer (hidden once delivered) */}
      {shipment.currentEvent !== 'delivered' && shipment.estimatedDelivery && (
        <div style={{ marginTop: 4, paddingTop: 12, borderTop: `1px solid ${colors.borderSubtle}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Est. Delivery</span>
          <span style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: isProblem ? RED : AMBER, fontFamily: M }}>
            {shipment.estimatedDelivery}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Options dropdown ─────────────────────────────────────────────────────────

type OptionsAction = 'reset' | 'details' | 'label' | 'invoice' | 'cancel'
const OPTIONS: { action: OptionsAction; label: string; danger?: boolean }[] = [
  { action: 'details',  label: 'View shipment details' },
  { action: 'label',    label: 'View label' },
  { action: 'invoice',  label: 'View commercial invoice' },
  { action: 'reset',    label: 'Reset order' },
  { action: 'cancel',   label: 'Cancel', danger: true },
]

function OptionsMenu({ shipmentId }: { shipmentId: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const M = font.family

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        style={{
          width: 28, height: 28, borderRadius: 8,
          background: open ? colors.borderSubtle : 'transparent',
          border: `1px solid ${open ? colors.borderMint : 'transparent'}`,
          color: colors.textSecondary,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontFamily: M, lineHeight: 1,
          transition: 'all 0.15s',
        }}
        aria-label="Options"
      >
        ⋮
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 34, zIndex: 100,
          background: '#FDFFFF', border: `1px solid ${MINT}`,
          borderRadius: radii.badge + 4, padding: '4px 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          minWidth: 188,
        }}>
          {OPTIONS.map((opt, i) => (
            <React.Fragment key={opt.action}>
              {opt.action === 'cancel' && (
                <div style={{ height: 1, margin: '4px 12px', background: '#E8EAEF' }} />
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false) }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 16px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: font.size.sm, fontFamily: M, fontWeight: font.weight.semibold,
                  color: opt.danger ? RED : '#171B2D',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = opt.danger ? `${RED}12` : 'rgba(29,251,157,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {opt.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function EventBadge({ event }: { event: TrackingEventType }) {
  const { label, color, bg } = eventBadgeConfig(event)
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: radii.badge,
      background: bg,
      border: `1px solid ${color}40`,
      fontSize: font.size.xs,
      fontWeight: font.weight.bold,
      color,
      fontFamily: font.family,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

// ─── Shipment row ─────────────────────────────────────────────────────────────

function ShipmentRow({ shipment, expanded, onToggle }: {
  shipment: Shipment
  expanded: boolean
  onToggle: () => void
}) {
  const M = font.family
  const isProblem = PROBLEM_EVENTS.has(shipment.currentEvent)
  const isMulti   = shipment.trackingNumbers.length > 1

  return (
    <div style={{
      background: colors.cardBg,
      border: `1px solid ${isProblem ? `${RED}50` : colors.borderSubtle}`,
      borderRadius: radii.card,
      marginBottom: 8,
      overflow: 'hidden',
      boxShadow: isProblem ? `0 0 12px ${RED}18` : 'none',
      transition: 'border-color 0.2s',
    }}>

      {/* Main row */}
      <div
        onClick={onToggle}
        style={{
          display: 'grid',
          gridTemplateColumns: '32px 90px 1fr 110px 100px 130px 148px 130px 140px 36px',
          alignItems: 'center',
          gap: 8,
          padding: '12px 14px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Expand chevron */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textMuted }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Order number */}
        <span style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: MINT, fontFamily: M }}>
          {shipment.orderNumber}
        </span>

        {/* Customer name */}
        <span style={{ fontSize: font.size.sm, color: colors.textPrimary, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shipment.customerName}
        </span>

        {/* Country + postcode */}
        <span style={{ fontSize: font.size.sm, color: colors.textSecondary, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shipment.countryFlag} {shipment.postcode}
        </span>

        {/* Carrier */}
        <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textPrimary, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shipment.carrier}
        </span>

        {/* Service */}
        <span style={{ fontSize: font.size.xs, color: colors.textSecondary, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shipment.service}
        </span>

        {/* Tracking number(s) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
          <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shipment.trackingNumbers[0]}
          </span>
          {isMulti && (
            <span style={{
              flexShrink: 0,
              padding: '1px 5px',
              borderRadius: 99,
              background: `${MINT}20`,
              border: `1px solid ${MINT}50`,
              fontSize: 10,
              fontWeight: font.weight.bold,
              color: MINT,
              fontFamily: M,
            }}>
              +{shipment.trackingNumbers.length - 1}
            </span>
          )}
        </div>

        {/* Booked date/time */}
        <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: M, whiteSpace: 'nowrap' }}>
          {shipment.bookedAt}
        </span>

        {/* Status badge */}
        <EventBadge event={shipment.currentEvent} />

        {/* Options button */}
        <div onClick={e => e.stopPropagation()}>
          <OptionsMenu shipmentId={shipment.id} />
        </div>
      </div>

      {/* Expanded tracking timeline */}
      {expanded && <TrackingTimeline shipment={shipment} />}
    </div>
  )
}

// ─── Column headers ───────────────────────────────────────────────────────────

function TableHeader() {
  const M = font.family
  const COL: string[] = ['', 'Order', 'Customer', 'Destination', 'Carrier', 'Service', 'Tracking', 'Booked', 'Status', '']
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '32px 90px 1fr 110px 100px 130px 148px 130px 140px 36px',
      gap: 8,
      padding: '6px 14px 8px',
    }}>
      {COL.map((h, i) => (
        <span key={i} style={{ fontSize: font.size.xs, fontWeight: font.weight.bold, color: colors.textMuted, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {h}
        </span>
      ))}
    </div>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  const M = font.family
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: colors.cardBg, border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.input, overflow: 'hidden' }}>
      <span style={{ padding: '7px 10px', fontSize: font.size.xs, fontWeight: font.weight.bold, color: colors.textMuted, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', borderRight: `1px solid ${colors.borderSubtle}` }}>
        {label}
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '7px 28px 7px 10px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: colors.textPrimary,
          fontFamily: M,
          fontSize: font.size.sm,
          fontWeight: font.weight.semibold,
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          minWidth: 100,
        }}
      >
        <option value="all" style={{ background: '#171B2D' }}>All</option>
        {options.map(o => <option key={o} value={o} style={{ background: '#171B2D' }}>{o}</option>)}
      </select>
      <span style={{ marginLeft: -24, marginRight: 8, color: colors.textMuted, pointerEvents: 'none', fontSize: 10 }}>▼</span>
    </div>
  )
}

// ─── Summary chips ────────────────────────────────────────────────────────────

function SummaryChip({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '12px 20px', background: `${color}14`, border: `1px solid ${color}40`,
      borderRadius: radii.card, minWidth: 80, flex: 1,
    }}>
      <span style={{ fontSize: font.size['2xl'], fontWeight: font.weight.extrabold, color, fontFamily: font.family, lineHeight: 1 }}>{count}</span>
      <span style={{ marginTop: 4, fontSize: font.size.xs, color: colors.textSecondary, fontFamily: font.family, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ShipmentsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterCarrier, setFilterCarrier] = useState('all')
  const [filterService, setFilterService] = useState('all')
  const [filterStatus,  setFilterStatus]  = useState('all')

  const M = font.family

  // Unique carriers and services from data
  const allCarriers = Array.from(new Set(MOCK_SHIPMENTS.map(s => s.carrier))).sort()
  const allServices = Array.from(new Set(MOCK_SHIPMENTS.map(s => s.service))).sort()
  const statusGroups = [
    { value: 'booked',         label: 'Booked' },
    { value: 'in_progress',    label: 'In Progress' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered',      label: 'Delivered' },
    { value: 'problem',        label: 'Problem' },
  ]

  // Filter + sort newest first
  const filtered = MOCK_SHIPMENTS.filter(s => {
    if (filterCarrier !== 'all' && s.carrier !== filterCarrier) return false
    if (filterService !== 'all' && s.service !== filterService) return false
    if (filterStatus !== 'all') {
      const isProb = PROBLEM_EVENTS.has(s.currentEvent)
      if (filterStatus === 'problem'         && !isProb) return false
      if (filterStatus === 'delivered'       && s.currentEvent !== 'delivered') return false
      if (filterStatus === 'out_for_delivery'&& s.currentEvent !== 'out_for_delivery') return false
      if (filterStatus === 'booked'          && s.currentEvent !== 'booked') return false
      if (filterStatus === 'in_progress'     && (s.currentEvent === 'booked' || s.currentEvent === 'delivered' || isProb)) return false
    }
    return true
  }).sort((a, b) => b.bookedAt.localeCompare(a.bookedAt))

  // Summary counts (always from full set)
  const inTransit   = MOCK_SHIPMENTS.filter(s => !PROBLEM_EVENTS.has(s.currentEvent) && s.currentEvent !== 'booked' && s.currentEvent !== 'delivered').length
  const outDelivery = MOCK_SHIPMENTS.filter(s => s.currentEvent === 'out_for_delivery').length
  const delivered   = MOCK_SHIPMENTS.filter(s => s.currentEvent === 'delivered').length
  const problems    = MOCK_SHIPMENTS.filter(s => PROBLEM_EVENTS.has(s.currentEvent)).length
  const booked      = MOCK_SHIPMENTS.filter(s => s.currentEvent === 'booked').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: font.size['2xl'], fontWeight: font.weight.extrabold, color: colors.textPrimary, fontFamily: M }}>
            Shipments
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: font.size.sm, color: colors.textSecondary, fontFamily: M }}>
            {MOCK_TOTAL_SHIPMENTS.toLocaleString()} total · showing {filtered.length}
          </p>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterSelect label="Carrier" value={filterCarrier} options={allCarriers} onChange={setFilterCarrier} />
          <FilterSelect label="Service" value={filterService} options={allServices} onChange={setFilterService} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: colors.cardBg, border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.input, overflow: 'hidden' }}>
            <span style={{ padding: '7px 10px', fontSize: font.size.xs, fontWeight: font.weight.bold, color: colors.textMuted, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.06em', borderRight: `1px solid ${colors.borderSubtle}` }}>
              Status
            </span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: '7px 28px 7px 10px', background: 'transparent', border: 'none', outline: 'none', color: colors.textPrimary, fontFamily: M, fontSize: font.size.sm, fontWeight: font.weight.semibold, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', minWidth: 120 }}
            >
              <option value="all" style={{ background: '#171B2D' }}>All</option>
              {statusGroups.map(g => <option key={g.value} value={g.value} style={{ background: '#171B2D' }}>{g.label}</option>)}
            </select>
            <span style={{ marginLeft: -24, marginRight: 8, color: colors.textMuted, pointerEvents: 'none', fontSize: 10 }}>▼</span>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 10 }}>
        <SummaryChip label="In Progress"      count={inTransit}   color={BLUE} />
        <SummaryChip label="Out for Delivery" count={outDelivery} color={MINT} />
        <SummaryChip label="Delivered"        count={delivered}   color={colors.mintDim} />
        <SummaryChip label="Booked"           count={booked}      color={AMBER} />
        <SummaryChip label="Problems"         count={problems}    color={RED} />
      </div>

      {/* Table */}
      <div>
        <TableHeader />
        {filtered.length === 0 && (
          <p style={{ margin: '24px 0', textAlign: 'center', color: colors.textMuted, fontFamily: M, fontSize: font.size.sm }}>
            No shipments match your filters.
          </p>
        )}
        {filtered.map(s => (
          <ShipmentRow
            key={s.id}
            shipment={s}
            expanded={expandedId === s.id}
            onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
          />
        ))}
      </div>

    </div>
  )
}
