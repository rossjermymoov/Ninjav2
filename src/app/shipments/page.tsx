'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MOCK_SHIPMENTS, MOCK_TOTAL_SHIPMENTS, type Shipment, type TrackingEventType } from '@/lib/mock/shipments'
import { colors, font, radii } from '@/lib/tokens'

// ─── Tracking event config ────────────────────────────────────────────────────

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

function eventBadgeConfig(evt: TrackingEventType): { label: string; color: string; bg: string } {
  if (PROBLEM_EVENTS.has(evt)) return { label: EVENT_LABEL[evt], color: RED, bg: `${RED}20` }
  if (evt === 'delivered')         return { label: 'Delivered',        color: MINT,  bg: `${MINT}18` }
  if (evt === 'out_for_delivery')  return { label: 'Out for Delivery', color: BLUE,  bg: `${BLUE}18` }
  if (evt === 'booked')            return { label: 'Booked',           color: AMBER, bg: `${AMBER}18` }
  return { label: EVENT_LABEL[evt], color: MINT, bg: `${MINT}12` }
}

// ─── 8-stage tracking pipeline ────────────────────────────────────────────────

interface TrackingStage {
  key: string
  label: string
  isTransit: boolean
  pipeline: TrackingEventType[]
}

const TRACKING_STAGES: TrackingStage[] = [
  { key: 'booked',    label: 'Booked',          isTransit: false, pipeline: ['booked'] },
  { key: 'collected', label: 'Collected',        isTransit: false, pipeline: ['collected'] },
  { key: 'transit1',  label: 'In Transit',       isTransit: true,  pipeline: ['in_transit_to_depot'] },
  { key: 'hub',       label: 'At Hub',           isTransit: false, pipeline: ['at_collection_depot', 'in_transit_to_hub', 'at_hub'] },
  { key: 'transit2',  label: 'In Transit',       isTransit: true,  pipeline: ['in_transit_to_receiving'] },
  { key: 'depot',     label: 'At Depot',         isTransit: false, pipeline: ['at_receiving_depot'] },
  { key: 'delivery',  label: 'Out for Delivery', isTransit: false, pipeline: ['out_for_delivery'] },
  { key: 'end',       label: 'Delivered',        isTransit: false, pipeline: ['delivered'] },
]

const N = TRACKING_STAGES.length  // 8

function getTrackingStageIdx(shipment: Shipment): number {
  if (PROBLEM_EVENTS.has(shipment.currentEvent)) {
    const lastNormal = [...shipment.trackingEvents].reverse().find(e => !PROBLEM_EVENTS.has(e.type))
    if (!lastNormal) return 0
    const idx = TRACKING_STAGES.findIndex(s => s.pipeline.includes(lastNormal.type as TrackingEventType))
    return idx === -1 ? 0 : idx
  }
  const idx = TRACKING_STAGES.findIndex(s => s.pipeline.includes(shipment.currentEvent))
  return idx === -1 ? 0 : idx
}

// ─── Stage icons ──────────────────────────────────────────────────────────────

function StageIcon({ stageKey, color, size = 28 }: { stageKey: string; color: string; size?: number }) {
  const s = size
  switch (stageKey) {
    case 'booked':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          {/* finger touch / tap */}
          <path d="M12 3a1.5 1.5 0 00-1.5 1.5V11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M14.5 6a1.5 1.5 0 013 0v5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9.5 7.5a1.5 1.5 0 00-3 0v3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M6.5 12.5V11c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v2.5l.5 1a8 8 0 001.5 3l1.5 2A5 5 0 0010.5 22h2a5 5 0 005-5v-6a1.5 1.5 0 00-3 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'collected':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          {/* delivery truck */}
          <rect x="1" y="8" width="13" height="9" rx="1.5" stroke={color} strokeWidth="1.5"/>
          <path d="M14 10.5h4.5l3 4v3.5h-7.5" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="5.5" cy="18.5" r="2" stroke={color} strokeWidth="1.5"/>
          <circle cx="18" cy="18.5" r="2" stroke={color} strokeWidth="1.5"/>
          <line x1="5.5" y1="8" x2="5.5" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="9" y1="8" x2="9" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 'transit1':
    case 'transit2':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          {/* network hub — circles with radiating spokes */}
          <circle cx="12" cy="12" r="2.5" stroke={color} strokeWidth="1.4"/>
          <circle cx="5"  cy="5"  r="1.8" stroke={color} strokeWidth="1.3"/>
          <circle cx="19" cy="5"  r="1.8" stroke={color} strokeWidth="1.3"/>
          <circle cx="5"  cy="19" r="1.8" stroke={color} strokeWidth="1.3"/>
          <circle cx="19" cy="19" r="1.8" stroke={color} strokeWidth="1.3"/>
          <line x1="9.8"  y1="9.8"  x2="6.5"  y2="6.5"  stroke={color} strokeWidth="1.2"/>
          <line x1="14.2" y1="9.8"  x2="17.5" y2="6.5"  stroke={color} strokeWidth="1.2"/>
          <line x1="9.8"  y1="14.2" x2="6.5"  y2="17.5" stroke={color} strokeWidth="1.2"/>
          <line x1="14.2" y1="14.2" x2="17.5" y2="17.5" stroke={color} strokeWidth="1.2"/>
        </svg>
      )
    case 'hub':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          {/* hub — same network but with filled centre */}
          <circle cx="12" cy="12" r="3"   stroke={color} strokeWidth="1.4"/>
          <circle cx="12" cy="12" r="1.2" fill={color}/>
          <circle cx="4"  cy="7"  r="1.8" stroke={color} strokeWidth="1.3"/>
          <circle cx="20" cy="7"  r="1.8" stroke={color} strokeWidth="1.3"/>
          <circle cx="4"  cy="17" r="1.8" stroke={color} strokeWidth="1.3"/>
          <circle cx="20" cy="17" r="1.8" stroke={color} strokeWidth="1.3"/>
          <line x1="9.6"  y1="10.2" x2="5.7"  y2="8.2"  stroke={color} strokeWidth="1.2"/>
          <line x1="14.4" y1="10.2" x2="18.3" y2="8.2"  stroke={color} strokeWidth="1.2"/>
          <line x1="9.6"  y1="13.8" x2="5.7"  y2="15.8" stroke={color} strokeWidth="1.2"/>
          <line x1="14.4" y1="13.8" x2="18.3" y2="15.8" stroke={color} strokeWidth="1.2"/>
        </svg>
      )
    case 'depot':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          {/* warehouse / depot building */}
          <path d="M3 11L12 4l9 7v9H3V11z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
          <rect x="9" y="14" width="6" height="7" rx="1" stroke={color} strokeWidth="1.5"/>
          <line x1="3" y1="11" x2="21" y2="11" stroke={color} strokeWidth="1" strokeOpacity="0.4"/>
        </svg>
      )
    case 'delivery':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          {/* paper plane / send */}
          <path d="M22 2L11 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'end':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          {/* delivered checkmark in circle */}
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
          <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"/>
  }
}

// ─── Tracking details panel (expanded row) ────────────────────────────────────

function TrackingDetails({ shipment }: { shipment: Shipment }) {
  const M = font.family
  const isProblem  = PROBLEM_EVENTS.has(shipment.currentEvent)
  const stageIdx   = getTrackingStageIdx(shipment)
  const isDelivered = shipment.currentEvent === 'delivered'
  const activeColor = isProblem ? RED : MINT

  // Per-stage: find the first tracking event that belongs to this stage
  function eventForStage(stage: TrackingStage) {
    return shipment.trackingEvents.find(e => stage.pipeline.includes(e.type as TrackingEventType))
  }

  // Format "2024-03-15 14:00" → { date: '15-03-2024', time: '14:00:00' }
  function fmtTimestamp(ts: string) {
    const [datePart, timePart] = ts.split(' ')
    const [y, m, d] = datePart.split('-')
    return { date: `${d}-${m}-${y}`, time: timePart ? `${timePart}:00` : '' }
  }

  // Track fill: each of N stages occupies 100%/N of flex width
  // Centre of stage i = (2i+1)/(2N) * 100%
  // Fill width = stageIdx * 100/N  %
  const trackEdgePct = 50 / N          // 6.25 for N=8
  const fillWidthPct = stageIdx * 100 / N  // up to 87.5% at stageIdx=7

  // Vertical layout constants (px from top of .stages container)
  // [0..43]  transit-label zone
  // [44..77] icon zone (34px)
  // [78..93] circle zone (16px) — track is centred here at 86px
  const TRACK_TOP = 86  // vertical centre of circles

  return (
    <div style={{
      background: colors.pageBg,
      borderTop: `1px solid ${colors.borderSubtle}`,
      padding: '22px 28px 28px',
      fontFamily: M,
    }}>

      {/* ── Header ─────────────────────────────────────── */}
      <h3 style={{ margin: '0 0 14px', fontSize: font.size.md, fontWeight: font.weight.extrabold, color: colors.textPrimary, fontFamily: M }}>
        Tracking Details
      </h3>

      {/* Carrier logo + tracking number */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        {shipment.carrierLogoUrl ? (
          <div style={{ width: 44, height: 24, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0 4px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shipment.carrierLogoUrl} alt={shipment.carrier} height={18} style={{ objectFit: 'contain', display: 'block' }} />
          </div>
        ) : (
          <span style={{ fontSize: font.size.sm, fontWeight: font.weight.extrabold, color: MINT, fontFamily: M }}>{shipment.carrier}</span>
        )}
        <span style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: MINT, fontFamily: M }}>
          {shipment.trackingNumbers[0]}
        </span>
        {shipment.trackingNumbers.length > 1 && (
          <span style={{ fontSize: font.size.xs, padding: '2px 8px', borderRadius: 99, background: `${MINT}18`, color: MINT, fontWeight: font.weight.bold, fontFamily: M }}>
            +{shipment.trackingNumbers.length - 1}
          </span>
        )}
        {/* expand circle (decorative, matching screenshot) */}
        <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${MINT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke={MINT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Info pills: Carrier / Service / Tracking Number */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
        {[
          { label: 'Carrier',         value: shipment.carrier },
          { label: 'Service',         value: shipment.service },
          { label: 'Tracking Number', value: shipment.trackingNumbers[0] },
        ].map(pill => (
          <div key={pill.label} style={{
            display: 'flex', alignItems: 'stretch',
            background: colors.surfaceBg,
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: 8, overflow: 'hidden',
          }}>
            <span style={{ padding: '7px 14px', fontSize: font.size.xs, fontWeight: font.weight.semibold, color: colors.textMuted, fontFamily: M, borderRight: `1px solid ${colors.borderSubtle}`, whiteSpace: 'nowrap' }}>
              {pill.label}
            </span>
            <span style={{ padding: '7px 16px', fontSize: font.size.xs, fontWeight: font.weight.bold, color: colors.textPrimary, fontFamily: M, whiteSpace: 'nowrap' }}>
              {pill.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Timeline ───────────────────────────────────── */}
      <div style={{ position: 'relative' }}>

        {/* Track background */}
        <div style={{
          position: 'absolute',
          top: TRACK_TOP, transform: 'translateY(-50%)',
          left: `${trackEdgePct}%`, right: `${trackEdgePct}%`,
          height: 8, background: colors.surfaceBg, borderRadius: 4, zIndex: 0,
        }} />

        {/* Track fill */}
        <div style={{
          position: 'absolute',
          top: TRACK_TOP, transform: 'translateY(-50%)',
          left: `${trackEdgePct}%`,
          width: `${fillWidthPct}%`,
          height: 8,
          background: activeColor,
          borderRadius: 4,
          zIndex: 1,
          boxShadow: `0 0 10px ${activeColor}50`,
          transition: 'width 0.4s ease',
        }} />

        {/* Stage columns */}
        <div style={{ display: 'flex', position: 'relative', zIndex: 2 }}>
          {TRACKING_STAGES.map((stage, i) => {
            const completed  = isDelivered || i <= stageIdx
            const current    = i === stageIdx
            const pending    = !isDelivered && i > stageIdx
            const ev         = eventForStage(stage)
            const iconColor  = pending ? `${MINT}30` : (isProblem && current ? RED : MINT)
            const isEndNode  = stage.key === 'end'
            const showAsEDD  = isEndNode && !isDelivered

            return (
              <div key={stage.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* ① Transit-label zone (44px fixed) */}
                <div style={{ height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 2 }}>
                  {stage.isTransit && completed && ev && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 9, fontWeight: font.weight.bold, color: current ? MINT : colors.textSecondary, fontFamily: M, lineHeight: 1.4 }}>
                        In Transit
                      </div>
                      {(() => { const { date, time } = fmtTimestamp(ev.timestamp); return (
                        <>
                          <div style={{ fontSize: 9, color: colors.textMuted, fontFamily: M, lineHeight: 1.3 }}>{date}</div>
                          <div style={{ fontSize: 9, color: colors.textMuted, fontFamily: M, lineHeight: 1.3 }}>{time}</div>
                        </>
                      )})()}
                    </div>
                  )}
                </div>

                {/* ② Icon zone (34px fixed) */}
                <div style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StageIcon stageKey={showAsEDD ? 'end' : stage.key} color={iconColor} size={24} />
                </div>

                {/* ③ Circle (16px, on the track at TRACK_TOP) */}
                <div style={{
                  width: current ? 18 : 14,
                  height: current ? 18 : 14,
                  borderRadius: '50%',
                  background: completed ? (isProblem && current ? RED : MINT) : colors.surfaceBg,
                  border: `2px solid ${completed ? (isProblem && current ? RED : MINT) : '#3D4566'}`,
                  boxShadow: current ? `0 0 12px ${activeColor}80` : 'none',
                  position: 'relative', zIndex: 3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  marginTop: 4,
                }}>
                  {completed && !current && (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: colors.pageBg }} />
                  )}
                  {current && isProblem && (
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', lineHeight: 1 }}>!</span>
                  )}
                </div>

                {/* ④ Label + timestamp below */}
                <div style={{ marginTop: 8, textAlign: 'center', paddingLeft: 2, paddingRight: 2 }}>
                  {showAsEDD ? (
                    <>
                      <div style={{ fontSize: font.size.xs, fontWeight: font.weight.bold, color: colors.textSecondary, fontFamily: M, lineHeight: 1.3 }}>
                        Expected<br/>Delivery Date
                      </div>
                      {shipment.estimatedDelivery && (
                        <div style={{ fontSize: 10, color: AMBER, fontWeight: font.weight.bold, fontFamily: M, marginTop: 2 }}>
                          {(() => { const [y,m,d] = shipment.estimatedDelivery.split('-'); return `${d}-${m}-${y}` })()}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Label — don't show for transit stages (label already shown above) */}
                      {!stage.isTransit && (
                        <div style={{
                          fontSize: font.size.xs,
                          fontWeight: current ? font.weight.bold : font.weight.regular,
                          color: current ? (isProblem ? RED : MINT) : (completed ? colors.textSecondary : colors.textMuted),
                          fontFamily: M, lineHeight: 1.3,
                          whiteSpace: 'nowrap',
                        }}>
                          {stage.label}
                        </div>
                      )}
                      {/* Timestamp for completed node stages */}
                      {!stage.isTransit && completed && ev && (
                        (() => { const { date, time } = fmtTimestamp(ev.timestamp); return (
                          <div style={{ marginTop: 2 }}>
                            <div style={{ fontSize: 9, color: colors.textMuted, fontFamily: M, lineHeight: 1.3 }}>{date}</div>
                            <div style={{ fontSize: 9, color: colors.textMuted, fontFamily: M, lineHeight: 1.3 }}>{time}</div>
                          </div>
                        )})()
                      )}
                    </>
                  )}
                </div>

              </div>
            )
          })}
        </div>

      </div>

      {/* Problem banner */}
      {isProblem && (
        <div style={{ marginTop: 20, padding: '10px 14px', borderRadius: 8, background: `${RED}12`, border: `1px solid ${RED}40`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <div>
            <div style={{ fontSize: font.size.sm, fontWeight: font.weight.bold, color: RED, fontFamily: M }}>
              {EVENT_LABEL[shipment.currentEvent]}
            </div>
            {shipment.trackingEvents.at(-1)?.location && (
              <div style={{ fontSize: font.size.xs, color: RED, opacity: 0.8, fontFamily: M }}>
                {shipment.trackingEvents.at(-1)!.location}
              </div>
            )}
          </div>
          <span style={{ marginLeft: 'auto', fontSize: font.size.xs, color: RED, opacity: 0.7, fontFamily: M }}>
            {shipment.trackingEvents.at(-1)?.timestamp}
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
          fontSize: 16, fontFamily: M, lineHeight: 1, transition: 'all 0.15s',
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)', minWidth: 188,
        }}>
          {OPTIONS.map((opt) => (
            <React.Fragment key={opt.action}>
              {opt.action === 'cancel' && (
                <div style={{ height: 1, margin: '4px 12px', background: '#E8EAEF' }} />
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false) }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: font.size.sm, fontFamily: M, fontWeight: font.weight.semibold,
                  color: opt.danger ? RED : '#171B2D', transition: 'background 0.1s',
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
      display: 'inline-block', padding: '3px 8px', borderRadius: radii.badge,
      background: bg, border: `1px solid ${color}40`,
      fontSize: font.size.xs, fontWeight: font.weight.bold, color, fontFamily: font.family, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

// ─── Shipment row ─────────────────────────────────────────────────────────────

function ShipmentRow({ shipment, expanded, onToggle }: {
  shipment: Shipment; expanded: boolean; onToggle: () => void
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
      borderRadius: radii.card, marginBottom: 8, overflow: 'hidden',
      boxShadow: isProblem ? `0 0 14px ${RED}20` : '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'border-color 0.2s',
    }}>
      <div
        onClick={onToggle}
        style={{
          display: 'grid',
          gridTemplateColumns: '32px 90px 1fr 110px 52px 130px 148px 130px 140px 36px',
          alignItems: 'center', gap: 8, padding: '10px 14px',
          cursor: 'pointer', userSelect: 'none',
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
        {/* Destination */}
        <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: TXT, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shipment.countryFlag} {shipment.postcode}
        </span>
        {/* Carrier logo */}
        <CarrierLogo src={shipment.carrierLogoUrl} name={shipment.carrier} />
        {/* Service */}
        <span style={{ fontSize: font.size.xs, color: TXT2, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shipment.service}
        </span>
        {/* Tracking number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
          <span style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: TXT, fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shipment.trackingNumbers[0]}
          </span>
          {isMulti && (
            <span style={{ flexShrink: 0, padding: '1px 5px', borderRadius: 99, background: `${colors.mintDim}20`, border: `1px solid ${colors.mintDim}50`, fontSize: 10, fontWeight: font.weight.bold, color: colors.mintDim, fontFamily: M }}>
              +{shipment.trackingNumbers.length - 1}
            </span>
          )}
        </div>
        {/* Booked */}
        <span style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: TXT, fontFamily: M, whiteSpace: 'nowrap' }}>
          {shipment.bookedAt}
        </span>
        {/* Status badge */}
        <EventBadge event={shipment.currentEvent} />
        {/* Options */}
        <div onClick={e => e.stopPropagation()}>
          <OptionsMenu shipmentId={shipment.id} />
        </div>
      </div>

      {expanded && <TrackingDetails shipment={shipment} />}
    </div>
  )
}

// ─── Column headers ───────────────────────────────────────────────────────────

function TableHeader() {
  const M = font.family
  const COL = ['', 'Order', 'Customer', 'Destination', 'Carrier', 'Service', 'Tracking', 'Booked', 'Status', '']
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '32px 90px 1fr 110px 52px 130px 148px 130px 140px 36px', gap: 8, padding: '6px 14px 8px' }}>
      {COL.map((h, i) => (
        <span key={i} style={{ fontSize: font.size.xs, fontWeight: font.weight.bold, color: colors.textMuted, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {h}
        </span>
      ))}
    </div>
  )
}

// ─── Filter select ────────────────────────────────────────────────────────────

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  const M = font.family
  return (
    <div style={{ display: 'flex', alignItems: 'center', background: colors.cardBg, border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.input, overflow: 'hidden' }}>
      <span style={{ padding: '7px 10px', fontSize: font.size.xs, fontWeight: font.weight.bold, color: colors.textMuted, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', borderRight: `1px solid ${colors.borderSubtle}` }}>
        {label}
      </span>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: '7px 28px 7px 10px', background: 'transparent', border: 'none', outline: 'none', color: colors.textPrimary, fontFamily: M, fontSize: font.size.sm, fontWeight: font.weight.semibold, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', minWidth: 100 }}
      >
        <option value="all" style={{ background: '#171B2D' }}>All</option>
        {options.map(o => <option key={o} value={o} style={{ background: '#171B2D' }}>{o}</option>)}
      </select>
      <span style={{ marginLeft: -24, marginRight: 8, color: colors.textMuted, pointerEvents: 'none', fontSize: 10 }}>▼</span>
    </div>
  )
}

// ─── Summary chips ────────────────────────────────────────────────────────────

type CardFilter = 'booked' | 'in_transit' | 'issues' | 'awaiting_pickup' | 'delivered'

function SummaryChip({ label, count, color, active, onClick }: {
  label: string; count: number; color: string; active: boolean; onClick: () => void
}) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '12px 20px',
      background: active ? `${color}28` : `${color}18`,
      border: `${active ? 2 : 1}px solid ${color}`,
      borderRadius: radii.card, minWidth: 80, flex: 1,
      cursor: 'pointer', transition: 'all 0.15s',
      boxShadow: active ? `0 0 18px ${color}40` : `0 0 8px ${color}18`,
      userSelect: 'none',
    }}>
      <span style={{ fontSize: font.size['2xl'], fontWeight: font.weight.extrabold, color, fontFamily: font.family, lineHeight: 1 }}>{count}</span>
      <span style={{ marginTop: 4, fontSize: font.size.xs, color, fontFamily: font.family, whiteSpace: 'nowrap', fontWeight: font.weight.bold }}>{label}</span>
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

  const allCarriers = Array.from(new Set(MOCK_SHIPMENTS.map(s => s.carrier))).sort()
  const allServices = Array.from(new Set(MOCK_SHIPMENTS.map(s => s.service))).sort()

  function toggleCard(card: CardFilter) {
    setActiveCard(prev => prev === card ? null : card)
  }

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

  const filtered = MOCK_SHIPMENTS.filter(s => {
    if (filterCarrier !== 'all' && s.carrier !== filterCarrier) return false
    if (filterService !== 'all' && s.service !== filterService) return false
    if (!passesCardFilter(s)) return false
    return true
  }).sort((a, b) => b.bookedAt.localeCompare(a.bookedAt))

  const countBooked    = MOCK_SHIPMENTS.filter(s => s.currentEvent === 'booked').length
  const countTransit   = MOCK_SHIPMENTS.filter(s => !PROBLEM_EVENTS.has(s.currentEvent) && s.currentEvent !== 'booked' && s.currentEvent !== 'delivered' && s.currentEvent !== 'out_for_delivery').length
  const countIssues    = MOCK_SHIPMENTS.filter(s => PROBLEM_EVENTS.has(s.currentEvent)).length
  const countPickup    = MOCK_SHIPMENTS.filter(s => s.currentEvent === 'out_for_delivery').length
  const countDelivered = MOCK_SHIPMENTS.filter(s => s.currentEvent === 'delivered').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: font.size['2xl'], fontWeight: font.weight.extrabold, color: colors.textPrimary, fontFamily: M }}>Shipments</h1>
          <p style={{ margin: '3px 0 0', fontSize: font.size.sm, color: colors.textSecondary, fontFamily: M }}>
            {MOCK_TOTAL_SHIPMENTS.toLocaleString()} total · showing {filtered.length}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterSelect label="Carrier" value={filterCarrier} options={allCarriers} onChange={setFilterCarrier} />
          <FilterSelect label="Service" value={filterService} options={allServices} onChange={setFilterService} />
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 10 }}>
        <SummaryChip label="Booked"          count={countBooked}    color={MINT}  active={activeCard === 'booked'}          onClick={() => toggleCard('booked')} />
        <SummaryChip label="In Transit"      count={countTransit}   color={AMBER} active={activeCard === 'in_transit'}      onClick={() => toggleCard('in_transit')} />
        <SummaryChip label="Issues"          count={countIssues}    color={RED}   active={activeCard === 'issues'}          onClick={() => toggleCard('issues')} />
        <SummaryChip label="Awaiting Pickup" count={countPickup}    color={AMBER} active={activeCard === 'awaiting_pickup'} onClick={() => toggleCard('awaiting_pickup')} />
        <SummaryChip label="Delivered"       count={countDelivered} color={MINT}  active={activeCard === 'delivered'}       onClick={() => toggleCard('delivered')} />
      </div>

      {/* Active filter indicator */}
      {activeCard && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: -8 }}>
          <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: M }}>Filtered by:</span>
          <span style={{ fontSize: font.size.xs, fontWeight: font.weight.bold, color: colors.textSecondary, fontFamily: M, textTransform: 'capitalize' }}>
            {activeCard.replace('_', ' ')}
          </span>
          <button onClick={() => setActiveCard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: font.size.xs, fontFamily: M, padding: '0 4px', lineHeight: 1 }}>
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
            key={s.id} shipment={s}
            expanded={expandedId === s.id}
            onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
          />
        ))}
      </div>

    </div>
  )
}
