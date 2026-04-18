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

const RED   = colors.statusIssue    // #FF4D6A
const MINT  = colors.mint           // #1DFB9D
const AMBER = colors.statusProcessing
const BLUE  = colors.statusShipped

// Status label + colour for the compact badge in the row
function eventBadgeConfig(evt: TrackingEventType): { label: string; color: string; bg: string } {
  if (PROBLEM_EVENTS.has(evt)) return { label: EVENT_LABEL[evt], color: RED, bg: `${RED}20` }
  if (evt === 'delivered')         return { label: 'Delivered',       color: MINT,  bg: `${MINT}18` }
  if (evt === 'out_for_delivery')  return { label: 'Out for Delivery', color: BLUE, bg: `${BLUE}18` }
  if (evt === 'booked')            return { label: 'Booked',           color: AMBER, bg: `${AMBER}18` }
  return { label: EVENT_LABEL[evt], color: MINT, bg: `${MINT}12` }
}

// ─── Visual stages (horizontal timeline) ─────────────────────────────────────

interface VisualStage {
  key: string
  label: string
  events: TrackingEventType[]
}

const VISUAL_STAGES: VisualStage[] = [
  { key: 'booked',    label: 'Booked',           events: ['booked'] },
  { key: 'collected', label: 'Collected',         events: ['collected', 'in_transit_to_depot'] },
  { key: 'depot',     label: 'At Depot',          events: ['at_collection_depot', 'in_transit_to_hub'] },
  { key: 'hub',       label: 'At Hub',            events: ['at_hub', 'in_transit_to_receiving'] },
  { key: 'route',     label: 'Out for Delivery',  events: ['at_receiving_depot', 'out_for_delivery'] },
  { key: 'delivered', label: 'Delivered',         events: ['delivered'] },
]

function getVisualStageIdx(event: TrackingEventType): number {
  const idx = VISUAL_STAGES.findIndex(s => s.events.includes(event))
  return idx === -1 ? 0 : idx
}

function getEffectiveStageIdx(shipment: Shipment): number {
  if (PROBLEM_EVENTS.has(shipment.currentEvent)) {
    // Walk back through events to find the last non-problem event
    const lastNormal = [...shipment.trackingEvents].reverse().find(e => !PROBLEM_EVENTS.has(e.type))
    if (!lastNormal) return 0
    return getVisualStageIdx(lastNormal.type)
  }
  return getVisualStageIdx(shipment.currentEvent)
}

// ─── Horizontal tracking timeline ────────────────────────────────────────────

function HorizontalTimeline({ shipment }: { shipment: Shipment }) {
  const M = font.family
  const isProblem = PROBLEM_EVENTS.has(shipment.currentEvent)
  const stageIdx  = getEffectiveStageIdx(shipment)
  const isDelivered = shipment.currentEvent === 'delivered'
  const activeColor = isProblem ? RED : MINT

  // Fill percentage: from node 0 to current node along the track
  const fillPct = VISUAL_STAGES.length > 1
    ? (stageIdx / (VISUAL_STAGES.length - 1)) * 100
    : 0

  const lastEvent = shipment.trackingEvents[shipment.trackingEvents.length - 1]

  // Icons for each stage (SVG paths)
  const stageIcons: Record<string, React.ReactNode> = {
    booked:    <path d="M4 4h8v1.5H4V4zm0 3h8v1.5H4V7zm0 3h5v1.5H4V10z" fill="currentColor"/>,
    collected: <path d="M8 2l1.5 3H13l-2.7 2 1 3L8 8.3 4.7 10l1-3L3 5h3.5L8 2z" fill="currentColor"/>,
    depot:     <path d="M2 6l6-4 6 4v7H9v-4H7v4H2V6z" fill="currentColor"/>,
    hub:       <path d="M8 2l6 3v2H2V5l6-3zm-5 6h10v5H3V8zm2 1v3h2V9H5zm4 0v3h2V9H9z" fill="currentColor"/>,
    route:     <path d="M13 4H5l-3 4 3 4h8l2-4-2-4zm-5 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/>,
    delivered: <path d="M2 4h12v8H2V4zm10 2l-5 3-5-3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>,
  }

  return (
    <div style={{ padding: '20px 28px 22px', background: '#F8F9FB', borderTop: '1px solid #E4E6ED' }}>

      {/* Problem banner */}
      {isProblem && (
        <div style={{ marginBottom: 16, padding: '8px 14px', borderRadius: 8, background: `${RED}12`, border: `1px solid ${RED}40`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>⚠️</span>
          <span style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: RED, fontFamily: M }}>
            {EVENT_LABEL[shipment.currentEvent]}
          </span>
          {lastEvent.location && (
            <span style={{ fontSize: font.size.xs, color: RED, fontFamily: M, opacity: 0.8 }}>· {lastEvent.location}</span>
          )}
          <span style={{ fontSize: font.size.xs, color: RED, fontFamily: M, opacity: 0.7, marginLeft: 'auto' }}>{lastEvent.timestamp}</span>
        </div>
      )}

      {/* Progress track */}
      <div style={{ position: 'relative', paddingTop: 8, paddingBottom: 4 }}>

        {/* Track background line (node-to-node) */}
        <div style={{
          position: 'absolute',
          top: '50%', transform: 'translateY(-50%)',
          left: 12, right: 12,
          height: 4, background: '#E2E5EF', borderRadius: 2, zIndex: 0,
        }} />

        {/* Track fill */}
        <div style={{
          position: 'absolute',
          top: '50%', transform: 'translateY(-50%)',
          left: 12,
          width: `calc((100% - 24px) * ${fillPct / 100})`,
          height: 4,
          background: activeColor,
          borderRadius: 2,
          zIndex: 1,
          transition: 'width 0.3s ease',
          boxShadow: isProblem ? `0 0 6px ${RED}60` : `0 0 8px ${MINT}50`,
        }} />

        {/* Nodes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          {VISUAL_STAGES.map((stage, i) => {
            const isCompleted = isDelivered || i < stageIdx
            const isCurrent   = i === stageIdx
            const isPending   = !isDelivered && i > stageIdx

            const dotBg    = isCompleted ? MINT : (isCurrent ? (isProblem ? RED : MINT) : '#E2E5EF')
            const dotBorder = isCompleted ? MINT : (isCurrent ? activeColor : '#C8CBDA')
            const dotGlow  = isCurrent ? `0 0 12px ${activeColor}70` : 'none'
            const dotSize  = isCurrent ? 26 : 22

            return (
              <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                {/* Carrier logo above node for collected / out_for_delivery stage */}
                {(i === 1 || i === 4) && isCurrent && shipment.carrierLogoUrl && (
                  <div style={{
                    position: 'absolute',
                    marginTop: -32,
                    width: 22, height: 22,
                    borderRadius: 6,
                    background: '#fff',
                    border: '1px solid #E4E6ED',
                    overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={shipment.carrierLogoUrl} alt={shipment.carrier} width={16} height={16} style={{ objectFit: 'contain' }} />
                  </div>
                )}

                {/* Node circle */}
                <div style={{
                  width: dotSize, height: dotSize,
                  borderRadius: '50%',
                  background: dotBg,
                  border: `2px solid ${dotBorder}`,
                  boxShadow: dotGlow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}>
                  {isCompleted && !isCurrent && (
                    // Filled: dark inner dot (per Figma spec)
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.cardBg }} />
                  )}
                  {isCurrent && !isProblem && (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: colors.cardBg }}>
                      {stageIcons[stage.key]}
                    </svg>
                  )}
                  {isCurrent && isProblem && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', lineHeight: 1 }}>!</span>
                  )}
                  {isPending && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8CBDA' }} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stage labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        {VISUAL_STAGES.map((stage, i) => {
          const isCompleted = isDelivered || i < stageIdx
          const isCurrent   = i === stageIdx
          const isPending   = !isDelivered && i > stageIdx
          return (
            <div key={stage.key} style={{ width: 72, textAlign: 'center', flexShrink: 0 }}>
              <span style={{
                fontSize: font.size.xs,
                fontWeight: isCurrent ? font.weight.bold : font.weight.regular,
                color: isCurrent
                  ? (isProblem ? RED : '#171B2D')
                  : (isCompleted ? '#5C6478' : '#C8CBDA'),
                fontFamily: M,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Recent events (last 3) */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {shipment.trackingEvents.slice(-3).reverse().map((ev, i) => {
          const isProb = PROBLEM_EVENTS.has(ev.type)
          const isFirst = i === 0
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: isProb ? RED : (isFirst ? MINT : '#C8CBDA'), flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: font.size.xs, fontWeight: isFirst ? font.weight.bold : font.weight.regular, color: isProb ? RED : (isFirst ? '#171B2D' : '#9FA2B4'), fontFamily: M }}>
                {EVENT_LABEL[ev.type]}
              </span>
              {ev.location && (
                <span style={{ fontSize: font.size.xs, color: '#9FA2B4', fontFamily: M }}>· {ev.location}</span>
              )}
              <span style={{ fontSize: font.size.xs, color: '#C8CBDA', fontFamily: M, marginLeft: 'auto' }}>
                {ev.timestamp}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer: est delivery + action buttons */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #E4E6ED', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          {shipment.estimatedDelivery && shipment.currentEvent !== 'delivered' && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
              <span style={{ fontSize: font.size.xs, color: '#9FA2B4', fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Delivery</span>
              <span style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: isProblem ? RED : AMBER, fontFamily: M }}>
                {shipment.estimatedDelivery}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
            <span style={{ fontSize: font.size.xs, color: '#9FA2B4', fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight</span>
            <span style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: '#5C6478', fontFamily: M }}>{shipment.weight}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
            <span style={{ fontSize: font.size.xs, color: '#9FA2B4', fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</span>
            <span style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: '#5C6478', fontFamily: M }}>{shipment.items}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button style={{
            padding: '7px 18px', borderRadius: 99,
            background: MINT, border: 'none',
            fontSize: font.size.xs, fontWeight: font.weight.bold,
            color: colors.cardBg, fontFamily: M,
            cursor: 'pointer', letterSpacing: '0.04em',
            boxShadow: `0 2px 8px ${MINT}40`,
          }}>
            Raise
          </button>
          <button style={{
            padding: '7px 18px', borderRadius: 99,
            background: 'transparent',
            border: `1.5px solid ${colors.mintDim}`,
            fontSize: font.size.xs, fontWeight: font.weight.bold,
            color: colors.mintDim, fontFamily: M,
            cursor: 'pointer', letterSpacing: '0.04em',
          }}>
            Track
          </button>
        </div>
      </div>
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
          {OPTIONS.map((opt) => (
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

// ─── Carrier logo ─────────────────────────────────────────────────────────────

function CarrierLogo({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    return (
      <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F0F2F5', border: '1px solid #E4E6ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: font.weight.bold, color: '#6B7280', fontFamily: font.family }}>{initials}</span>
      </div>
    )
  }
  return (
    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F0F2F5', border: '1px solid #E4E6ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} width={28} height={28} onError={() => setFailed(true)} style={{ objectFit: 'contain', display: 'block' }} />
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

  const TXT  = '#171B2D'
  const TXT2 = '#5C6478'
  const TXT3 = '#9FA2B4'

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${isProblem ? `${RED}60` : '#E4E6ED'}`,
      borderRadius: radii.card,
      marginBottom: 8,
      overflow: 'hidden',
      boxShadow: isProblem ? `0 0 14px ${RED}20` : '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'border-color 0.2s',
    }}>

      {/* Main row */}
      <div
        onClick={onToggle}
        style={{
          display: 'grid',
          gridTemplateColumns: '32px 90px 1fr 110px 52px 130px 148px 130px 140px 36px',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Expand chevron */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: TXT3 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Order number */}
        <span style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: colors.mintDim, fontFamily: M }}>
          {shipment.orderNumber}
        </span>

        {/* Customer name */}
        <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: TXT, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shipment.customerName}
        </span>

        {/* Country + postcode */}
        <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: TXT, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shipment.countryFlag} {shipment.postcode}
        </span>

        {/* Carrier logo */}
        <CarrierLogo src={shipment.carrierLogoUrl} name={shipment.carrier} />

        {/* Service */}
        <span style={{ fontSize: font.size.xs, color: TXT2, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shipment.service}
        </span>

        {/* Tracking number(s) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
          <span style={{ fontSize: font.size.xs, color: TXT3, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shipment.trackingNumbers[0]}
          </span>
          {isMulti && (
            <span style={{
              flexShrink: 0, padding: '1px 5px', borderRadius: 99,
              background: `${colors.mintDim}20`, border: `1px solid ${colors.mintDim}50`,
              fontSize: 10, fontWeight: font.weight.bold, color: colors.mintDim, fontFamily: M,
            }}>
              +{shipment.trackingNumbers.length - 1}
            </span>
          )}
        </div>

        {/* Booked date/time */}
        <span style={{ fontSize: font.size.xs, color: TXT3, fontFamily: M, whiteSpace: 'nowrap' }}>
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
      {expanded && <HorizontalTimeline shipment={shipment} />}
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
      gridTemplateColumns: '32px 90px 1fr 110px 52px 130px 148px 130px 140px 36px',
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
          padding: '7px 28px 7px 10px', background: 'transparent', border: 'none', outline: 'none',
          color: colors.textPrimary, fontFamily: M, fontSize: font.size.sm, fontWeight: font.weight.semibold,
          cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', minWidth: 100,
        }}
      >
        <option value="all" style={{ background: '#171B2D' }}>All</option>
        {options.map(o => <option key={o} value={o} style={{ background: '#171B2D' }}>{o}</option>)}
      </select>
      <span style={{ marginLeft: -24, marginRight: 8, color: colors.textMuted, pointerEvents: 'none', fontSize: 10 }}>▼</span>
    </div>
  )
}

// ─── Summary chips (clickable, filter on click) ───────────────────────────────

type CardFilter = 'booked' | 'in_transit' | 'issues' | 'awaiting_pickup' | 'delivered'

function SummaryChip({
  label, count, color, active, onClick,
}: {
  label: string; count: number; color: string; active: boolean; onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '12px 20px',
        background: active ? `${color}22` : `${color}10`,
        border: `${active ? 2 : 1}px solid ${active ? color : color + '38'}`,
        borderRadius: radii.card,
        minWidth: 80, flex: 1,
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: active ? `0 0 16px ${color}30` : 'none',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: font.size['2xl'], fontWeight: font.weight.extrabold, color, fontFamily: font.family, lineHeight: 1 }}>
        {count}
      </span>
      <span style={{ marginTop: 4, fontSize: font.size.xs, color: active ? color : colors.textSecondary, fontFamily: font.family, whiteSpace: 'nowrap', fontWeight: active ? font.weight.bold : font.weight.regular }}>
        {label}
      </span>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ShipmentsPage() {
  const [expandedId,    setExpandedId]    = useState<string | null>(null)
  const [filterCarrier, setFilterCarrier] = useState('all')
  const [filterService, setFilterService] = useState('all')
  const [activeCard,    setActiveCard]    = useState<CardFilter | null>(null)

  const M = font.family

  // Unique carriers and services from data
  const allCarriers = Array.from(new Set(MOCK_SHIPMENTS.map(s => s.carrier))).sort()
  const allServices = Array.from(new Set(MOCK_SHIPMENTS.map(s => s.service))).sort()

  // Card toggle handler
  function toggleCard(card: CardFilter) {
    setActiveCard(prev => prev === card ? null : card)
  }

  // Card-based status test
  function passesCardFilter(s: Shipment): boolean {
    if (!activeCard) return true
    const isProb = PROBLEM_EVENTS.has(s.currentEvent)
    switch (activeCard) {
      case 'booked':          return s.currentEvent === 'booked'
      case 'in_transit':      return !isProb && s.currentEvent !== 'booked' && s.currentEvent !== 'delivered' && s.currentEvent !== 'out_for_delivery'
      case 'issues':          return isProb
      case 'awaiting_pickup': return s.currentEvent === 'out_for_delivery'
      case 'delivered':       return s.currentEvent === 'delivered'
    }
  }

  // Filter + sort newest first
  const filtered = MOCK_SHIPMENTS.filter(s => {
    if (filterCarrier !== 'all' && s.carrier !== filterCarrier) return false
    if (filterService !== 'all' && s.service !== filterService) return false
    if (!passesCardFilter(s)) return false
    return true
  }).sort((a, b) => b.bookedAt.localeCompare(a.bookedAt))

  // Summary counts (always from full set)
  const countBooked   = MOCK_SHIPMENTS.filter(s => s.currentEvent === 'booked').length
  const countTransit  = MOCK_SHIPMENTS.filter(s => !PROBLEM_EVENTS.has(s.currentEvent) && s.currentEvent !== 'booked' && s.currentEvent !== 'delivered' && s.currentEvent !== 'out_for_delivery').length
  const countIssues   = MOCK_SHIPMENTS.filter(s => PROBLEM_EVENTS.has(s.currentEvent)).length
  const countPickup   = MOCK_SHIPMENTS.filter(s => s.currentEvent === 'out_for_delivery').length
  const countDelivered = MOCK_SHIPMENTS.filter(s => s.currentEvent === 'delivered').length

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
        </div>
      </div>

      {/* Summary strip — clickable cards */}
      <div style={{ display: 'flex', gap: 10 }}>
        <SummaryChip label="Booked"          count={countBooked}    color={AMBER} active={activeCard === 'booked'}          onClick={() => toggleCard('booked')} />
        <SummaryChip label="In Transit"      count={countTransit}   color={BLUE}  active={activeCard === 'in_transit'}      onClick={() => toggleCard('in_transit')} />
        <SummaryChip label="Issues"          count={countIssues}    color={RED}   active={activeCard === 'issues'}          onClick={() => toggleCard('issues')} />
        <SummaryChip label="Awaiting Pickup" count={countPickup}    color={MINT}  active={activeCard === 'awaiting_pickup'} onClick={() => toggleCard('awaiting_pickup')} />
        <SummaryChip label="Delivered"       count={countDelivered} color={colors.mintDim} active={activeCard === 'delivered'} onClick={() => toggleCard('delivered')} />
      </div>

      {/* Active card indicator */}
      {activeCard && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: -8 }}>
          <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: M }}>
            Filtered by:
          </span>
          <span style={{ fontSize: font.size.xs, fontWeight: font.weight.bold, color: colors.textSecondary, fontFamily: M, textTransform: 'capitalize' }}>
            {activeCard.replace('_', ' ')}
          </span>
          <button
            onClick={() => setActiveCard(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: font.size.xs, fontFamily: M, padding: '0 4px', lineHeight: 1 }}
          >
            ✕ Clear
          </button>
        </div>
      )}

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
