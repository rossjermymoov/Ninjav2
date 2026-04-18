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

// ─── Stage icons (brand SVGs) ─────────────────────────────────────────────────

function StageIcon({ stageKey, color, size = 28 }: { stageKey: string; color: string; size?: number }) {
  const s = size
  switch (stageKey) {

    case 'booked':
      // Hand / tap icon
      return (
        <svg width={s} height={s} viewBox="0 0 25 43" fill="none" preserveAspectRatio="xMidYMid meet">
          <path fillRule="evenodd" clipRule="evenodd" d="M2.5673 17.1726C3.12998 17.3215 3.72756 17.7809 4.29792 18.6637C5.10533 19.9139 5.92426 28.3047 6.13212 28.4176C6.18096 28.4437 6.50114 28.4663 6.4989 28.4176C6.37685 25.4542 6.4989 12.867 6.4989 7.67508C6.4989 5.08273 10.9021 4.95906 10.9021 7.67508C10.9021 9.04167 10.7794 20.0222 10.7794 22.9855C10.7794 23.1408 11.0242 23.1092 11.0242 22.9855V18.7874C11.0242 14.9602 15.5489 15.8249 15.5489 18.541V22.9855C15.5489 23.3556 15.9874 23.2807 15.9874 23.0063C15.9874 22.6155 16.0346 20.1458 16.0346 19.7712C16.0346 17.6762 20.1075 17.7999 20.1075 20.1458C20.1075 20.4094 20.2685 24.7926 20.2685 25.5337C20.2685 25.9651 20.7157 25.9128 20.7157 25.5346C20.7157 25.2078 20.6852 22.7346 20.6852 22.4918C20.6852 19.4048 24.9658 20.1458 24.9658 22.3717V31.3195C24.9658 37.7634 19.9136 42.987 13.5313 42.987C8.18881 42.987 3.69283 39.3268 2.36926 34.3551C2.11149 33.3866 -0.226811 21.1333 0.0179212 19.5284C0.198903 18.3406 0.919707 17.3386 1.83676 17.15C2.05524 17.0724 2.29837 17.0688 2.5673 17.1726ZM5.75747 12.0375C4.41551 11.0852 3.53756 9.50922 3.53756 7.72652C3.53756 4.82185 5.8706 2.46329 8.74417 2.46329C11.6178 2.46329 13.9508 4.82185 13.9508 7.72652C13.9508 9.56338 13.0187 11.1809 11.6072 12.1232V10.1248C12.1414 9.47404 12.4627 8.63818 12.4627 7.72652C12.4627 5.65227 10.7965 3.96797 8.74417 3.96797C6.69194 3.96797 5.02569 5.65227 5.02569 7.72652C5.02569 8.56506 5.29783 9.33953 5.75747 9.96595V12.0375ZM5.77024 14.869C2.99819 13.7092 1.04605 10.9462 1.04605 7.72652C1.04605 3.46248 4.47087 0 8.68935 0C12.9077 0 16.3327 3.46248 16.3327 7.72652C16.3327 10.9417 14.3859 13.701 11.62 14.8645V13.1992C13.5399 12.1449 14.8445 10.0887 14.8445 7.72652C14.8445 4.292 12.0865 1.50468 8.68935 1.50468C5.29221 1.50468 2.53408 4.292 2.53408 7.72652C2.53408 10.0932 3.84399 12.1539 5.77024 13.2055V14.869Z" fill={color}/>
        </svg>
      )

    case 'collected':
      // Delivery truck
      return (
        <svg width={s} height={s} viewBox="0 0 35 26" fill="none" preserveAspectRatio="xMidYMid meet">
          <path d="M30.2277 6.3622H25.4549V0H3.1819C1.42382 0 0 1.42382 0 3.1811V20.6772H3.1819C3.1819 23.3098 5.32164 25.4488 7.95468 25.4488C10.5877 25.4488 12.7275 23.3098 12.7275 20.6772H22.273C22.273 23.3098 24.4128 25.4488 27.0458 25.4488C29.6789 25.4488 31.8186 23.3098 31.8186 20.6772H35.0005V13.7157C35.0005 13.0722 34.7918 12.4462 34.4056 11.9315C33.1262 10.226 30.2277 6.3622 30.2277 6.3622ZM7.95468 23.063C6.63418 23.063 5.56811 21.9973 5.56811 20.6772C5.56811 19.357 6.63418 18.2913 7.95468 18.2913C9.27517 18.2913 10.3409 19.357 10.3409 20.6772C10.3409 21.9973 9.27517 23.063 7.95468 23.063ZM29.432 8.74804L32.5584 12.7244H25.4549V8.74804H29.432ZM27.0458 23.063C25.7253 23.063 24.6592 21.9973 24.6592 20.6772C24.6592 19.357 25.7253 18.2913 27.0458 18.2913C28.3664 18.2913 29.432 19.357 29.432 20.6772C29.432 21.9973 28.3664 23.063 27.0458 23.063Z" fill={color}/>
        </svg>
      )

    case 'transit1':
    case 'transit2':
      // No icon for in-transit stages
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"/>

    case 'hub':
      // Hub / network
      return (
        <svg width={s} height={s} viewBox="0 0 45 45" fill="none" preserveAspectRatio="xMidYMid meet">
          <path fillRule="evenodd" clipRule="evenodd" d="M6.27646 27.5626C5.92902 27.9151 5.50674 28.203 5.01978 28.3961C3.132 29.147 0.993801 28.2001 0.253657 26.2839C-0.486487 24.3686 0.44863 22.2001 2.33641 21.4492C4.22512 20.6983 6.36238 21.6451 7.10253 23.5614C7.28364 24.0292 7.36404 24.513 7.35572 24.9864L11.2191 26.7573C12.5275 24.467 14.5779 22.593 17.1901 21.5542C18.8062 20.912 20.4778 20.6523 22.1087 20.732L24.1951 8.63265C23.3737 8.12078 22.7038 7.34451 22.3258 6.36576C21.4009 3.97045 22.5698 1.2592 24.9288 0.321698C27.2888 -0.61674 29.9611 0.567337 30.8869 2.96171C31.8119 5.35703 30.643 8.06734 28.283 9.00577C27.748 9.21859 27.1955 9.32266 26.6512 9.32735L24.6165 21.1276C27.7471 21.9751 30.5062 24.0976 32.102 27.1454L35.7972 25.6764C35.6641 23.6983 36.7942 21.7736 38.707 21.0133C41.066 20.0748 43.7392 21.2589 44.6641 23.6532C45.5891 26.0486 44.4202 28.7589 42.0612 29.6973C40.1494 30.4576 38.0306 29.8248 36.8035 28.2817L33.1092 29.7508C34.6385 35.6176 31.6132 41.8661 25.9111 44.133C19.7746 46.5723 12.8259 43.4926 10.4216 37.2686C9.40243 34.6295 9.36085 31.8432 10.1185 29.3232L6.27646 27.5626ZM4.54391 25.2348C4.61598 25.0304 4.61783 24.7998 4.53467 24.5823C4.34987 24.1042 3.81578 23.8661 3.34268 24.0545C2.8705 24.242 2.63765 24.7849 2.82245 25.263C3.00633 25.7402 3.54134 25.9792 4.01352 25.7917C4.24175 25.7008 4.41455 25.5264 4.51065 25.3173C4.52081 25.2901 4.5319 25.262 4.54391 25.2348ZM30.1107 29.4395C28.2618 24.6517 22.9172 22.2827 18.1964 24.1595C13.4765 26.0364 11.1405 31.4589 12.9904 36.2477C14.8394 41.0355 20.1849 43.4045 24.9048 41.5276C29.6256 39.6508 31.9606 34.2283 30.1107 29.4395ZM38.6718 26.0364C39.0424 26.9955 40.1115 27.468 41.0549 27.093C41.9983 26.718 42.4659 25.6333 42.0963 24.6752C41.7257 23.7161 40.6557 23.2436 39.7132 23.6186C38.7698 23.9936 38.3013 25.0774 38.6718 26.0364ZM15.5583 35.2258C14.2637 31.8742 15.8983 28.0783 19.2026 26.7649C22.507 25.4505 26.2483 27.1089 27.5429 30.4614C28.8374 33.813 27.2028 37.6089 23.8985 38.9223C20.5951 40.2367 16.8528 38.5783 15.5583 35.2258ZM24.975 31.4823C24.2349 29.5661 22.0976 28.6192 20.2089 29.3701C18.3202 30.1211 17.386 32.2895 18.1261 34.2048C18.8663 36.1211 21.0036 37.0679 22.8923 36.317C24.781 35.5661 25.7152 33.3976 24.975 31.4823ZM28.3181 3.98264C27.9476 3.02451 26.8785 2.55201 25.9351 2.92701C24.9917 3.30201 24.5241 4.38577 24.8937 5.34483C25.2642 6.30296 26.3333 6.77639 27.2768 6.40046C28.2202 6.02546 28.6887 4.9417 28.3181 3.98264Z" fill={color}/>
        </svg>
      )

    case 'depot':
      // Warehouse / depot building
      return (
        <svg width={s} height={s} viewBox="0 0 31 29" fill="none" preserveAspectRatio="xMidYMid meet">
          <path fillRule="evenodd" clipRule="evenodd" d="M2.11274 10.1799C1.35973 10.3622 0.550816 10.0176 0.18491 9.30672C-0.241406 8.47852 0.0945596 7.46483 0.934474 7.04472L14.6476 0.182171C15.1301 -0.0592346 15.7 -0.0608021 16.1836 0.177991L29.8866 6.94022C30.7289 7.35588 31.0704 8.36775 30.6489 9.1983C30.2872 9.91076 29.4807 10.2598 28.7272 10.0824V28.7858L24.5387 28.7913V13.5608C24.5387 13.3944 24.4717 13.235 24.3525 13.1175C24.2332 12.9999 24.0713 12.9338 23.9028 12.9338H7.09314C6.92436 12.9338 6.76274 12.9999 6.64351 13.1175C6.52428 13.235 6.45724 13.3944 6.45724 13.5608V28.8148L2.11274 28.8206V10.1799ZM15.2125 23.9313V28.2871C15.2125 28.5875 14.965 28.8316 14.6603 28.8316H9.84658C9.54161 28.8316 9.2944 28.5875 9.2944 28.2871V23.9313C9.2944 23.6309 9.54161 23.3869 9.84658 23.3869H14.6603C14.965 23.3869 15.2125 23.6309 15.2125 23.9313ZM21.7673 23.9313V28.2871C21.7673 28.5875 21.5201 28.8316 21.2151 28.8316H16.4014C16.0967 28.8316 15.8492 28.5875 15.8492 28.2871V23.9313C15.8492 23.6309 16.0967 23.3869 16.4014 23.3869H21.2151C21.5201 23.3869 21.7673 23.6309 21.7673 23.9313ZM18.4603 18.0498V22.4056C18.4603 22.706 18.2129 22.95 17.9082 22.95H13.0944C12.7897 22.95 12.5423 22.706 12.5423 22.4056V18.0498C12.5423 17.7494 12.7897 17.5054 13.0944 17.5054H17.9082C18.2129 17.5054 18.4603 17.7494 18.4603 18.0498Z" fill={color}/>
        </svg>
      )

    case 'delivery':
      // Out for delivery arrow
      return (
        <svg width={s} height={s} viewBox="0 0 26 26" fill="none" preserveAspectRatio="xMidYMid meet">
          <path fillRule="evenodd" clipRule="evenodd" d="M4.06912 12.9668L0 4.23181V0L25.9334 12.9668L0 25.9334V21.7016L4.06912 12.9668ZM21.4552 12.8398L1.88933 3.05686V3.81333L5.78166 12.169C5.8812 12.3824 5.93865 12.6102 5.954 12.8398H21.4552Z" fill={color}/>
        </svg>
      )

    case 'end':
      // Delivered checkmark in circle
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
          <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )

    default:
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"/>
  }
}

// ─── Ninja characters ─────────────────────────────────────────────────────────

function MovingNinja({ size = 35 }: { size?: number }) {
  const w = size
  const h = Math.round(size * 72 / 35)
  return (
    <svg width={w} height={h} viewBox="0 0 35 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head skin */}
      <ellipse cx="17.5" cy="13" rx="10" ry="11" fill="#FED5B2"/>
      {/* Hair / upper head dark */}
      <path d="M8 10 Q17.5 2 27 10 Q27 4 17.5 2 Q8 4 8 10Z" fill="#151B2D"/>
      {/* Face mask lower half */}
      <path d="M8 16 Q8.5 24.5 17.5 24.5 Q26.5 24.5 27 16Z" fill="#151B2D"/>
      {/* Eyes white */}
      <ellipse cx="13.5" cy="13.8" rx="2.6" ry="2.3" fill="white"/>
      <ellipse cx="21.5" cy="13.8" rx="2.6" ry="2.3" fill="white"/>
      {/* Pupils */}
      <circle cx="13.5" cy="13.8" r="1.3" fill="#0D101B"/>
      <circle cx="21.5" cy="13.8" r="1.3" fill="#0D101B"/>
      {/* Eye highlights */}
      <circle cx="13.9" cy="13.2" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="21.9" cy="13.2" r="0.5" fill="white" opacity="0.8"/>
      {/* Forehead green Moov diamond */}
      <path d="M15.5 8 L17.5 5.5 L19.5 8 L17.5 10.5Z" fill="#28FB9D"/>
      {/* Neck */}
      <rect x="15.2" y="23.5" width="4.6" height="4" rx="1" fill="#FED5B2"/>
      {/* Torso */}
      <path d="M10 27.5 L25 27.5 L26.5 51 L8.5 51Z" fill="#151B2D"/>
      {/* Green belt sash */}
      <rect x="10.5" y="37.5" width="14" height="3.5" rx="1.5" fill="#28FB9D"/>
      {/* Left arm extended back-left */}
      <path d="M10.5 30 L1 23.5 L0 27.5 L9.5 35Z" fill="#151B2D"/>
      {/* Left hand skin */}
      <ellipse cx="0.8" cy="25.2" rx="1.8" ry="2.4" fill="#FED5B2"/>
      {/* Right arm extended forward-right */}
      <path d="M24.5 30 L34 23.5 L35 27.5 L25.5 35Z" fill="#151B2D"/>
      {/* Right hand skin */}
      <ellipse cx="34.2" cy="25.2" rx="1.8" ry="2.4" fill="#FED5B2"/>
      {/* Left leg */}
      <path d="M12.5 51 L10.5 65.5 L15.5 65.5 L17 51Z" fill="#0D101B"/>
      {/* Right leg */}
      <path d="M18 51 L19 65.5 L24 65.5 L22.5 51Z" fill="#0D101B"/>
      {/* Left shoe */}
      <path d="M7.5 64 L16 64 L16 69 L7.5 69 Q5.5 69 5.5 66.5 Q5.5 64 7.5 64Z" fill="#101010"/>
      {/* Right shoe */}
      <path d="M19 64 L27.5 64 Q29.5 64 29.5 66.5 Q29.5 69 27.5 69 L19 69Z" fill="#101010"/>
      {/* Green laces left */}
      <line x1="7" y1="65.8" x2="15.5" y2="65.8" stroke="#28FB9D" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7" y1="67.2" x2="15.5" y2="67.2" stroke="#28FB9D" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Green laces right */}
      <line x1="19.5" y1="65.8" x2="28" y2="65.8" stroke="#28FB9D" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="19.5" y1="67.2" x2="28" y2="67.2" stroke="#28FB9D" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function DeliveredNinja({ size = 37 }: { size?: number }) {
  const w = size
  const h = Math.round(size * 74 / 37)
  return (
    <svg width={w} height={h} viewBox="0 0 37 74" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head skin */}
      <ellipse cx="18.5" cy="13" rx="10" ry="11" fill="#FED5B2"/>
      {/* Hair / upper head dark */}
      <path d="M9 10 Q18.5 2 28 10 Q28 4 18.5 2 Q9 4 9 10Z" fill="#151B2D"/>
      {/* Face mask lower half */}
      <path d="M9 16 Q9.5 24.5 18.5 24.5 Q27.5 24.5 28 16Z" fill="#151B2D"/>
      {/* Eyes wider/open (celebration) */}
      <ellipse cx="14.5" cy="13.5" rx="3" ry="2.8" fill="white"/>
      <ellipse cx="22.5" cy="13.5" rx="3" ry="2.8" fill="white"/>
      {/* Pupils */}
      <circle cx="14.5" cy="13.5" r="1.5" fill="#0D101B"/>
      <circle cx="22.5" cy="13.5" r="1.5" fill="#0D101B"/>
      {/* Eye highlights larger for excitement */}
      <circle cx="15" cy="12.8" r="0.6" fill="white" opacity="0.8"/>
      <circle cx="23" cy="12.8" r="0.6" fill="white" opacity="0.8"/>
      {/* Forehead green Moov diamond */}
      <path d="M16.5 8 L18.5 5.5 L20.5 8 L18.5 10.5Z" fill="#28FB9D"/>
      {/* Neck */}
      <rect x="16.2" y="23.5" width="4.6" height="4" rx="1" fill="#FED5B2"/>
      {/* Torso */}
      <path d="M11 27.5 L26 27.5 L27.5 51 L9.5 51Z" fill="#151B2D"/>
      {/* Green belt sash */}
      <rect x="11.5" y="37.5" width="14" height="3.5" rx="1.5" fill="#28FB9D"/>
      {/* Left arm raised up-left (celebration) */}
      <path d="M11.5 30.5 L3.5 15.5 L6.5 14.5 L13.5 30Z" fill="#151B2D"/>
      {/* Left hand skin */}
      <ellipse cx="5" cy="14.5" rx="2" ry="2.5" fill="#FED5B2"/>
      {/* Right arm raised up-right (celebration) */}
      <path d="M25.5 30.5 L33.5 15.5 L30.5 14.5 L23.5 30Z" fill="#151B2D"/>
      {/* Right hand skin */}
      <ellipse cx="32" cy="14.5" rx="2" ry="2.5" fill="#FED5B2"/>
      {/* Left leg */}
      <path d="M13 51 L11 66 L16 66 L17.5 51Z" fill="#0D101B"/>
      {/* Right leg */}
      <path d="M19.5 51 L20.5 66 L25.5 66 L24 51Z" fill="#0D101B"/>
      {/* Left shoe */}
      <path d="M8 64 L17 64 L17 69.5 L8 69.5 Q6 69.5 6 67 Q6 64 8 64Z" fill="#101010"/>
      {/* Right shoe */}
      <path d="M20 64 L29 64 Q31 64 31 67 Q31 69.5 29 69.5 L20 69.5Z" fill="#101010"/>
      {/* Green laces left (prominent for delivered) */}
      <line x1="7.5" y1="66" x2="16.5" y2="66" stroke="#28FB9D" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7.5" y1="67.4" x2="16.5" y2="67.4" stroke="#28FB9D" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Green laces right */}
      <line x1="20.5" y1="66" x2="29.5" y2="66" stroke="#28FB9D" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20.5" y1="67.4" x2="29.5" y2="67.4" stroke="#28FB9D" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
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
  // [0..59]  ninja zone (60px) — ninja floats above current node
  // [60..103] transit-label zone (44px)
  // [104..137] icon zone (34px)
  // [138..153] circle zone (16px) — track is centred here at 146px
  const TRACK_TOP = 146  // vertical centre of circles (shifted down for ninja zone)

  return (
    <div style={{
      background: colors.pageBg,
      borderTop: `1px solid ${colors.borderSubtle}`,
      padding: '22px 28px 28px',
      fontFamily: M,
    }}>

      {/* ── Header ─────────────────────────────────────── */}
      <h3 style={{ margin: '0 0 14px', fontSize: font.size.sm, fontWeight: font.weight.bold, color: '#FDFFFF', fontFamily: M, letterSpacing: '0.01em' }}>
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

      {/* Info pills: Carrier / Service */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
        {[
          { label: 'Carrier', value: shipment.carrier },
          { label: 'Service', value: shipment.service },
        ].map(pill => (
          <div key={pill.label} style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(253,255,255,0.08)',
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            <span style={{
              padding: '6px 14px',
              background: 'rgba(253,255,255,0.10)',
              fontSize: font.size.xs, fontWeight: font.weight.semibold,
              color: 'rgba(253,255,255,0.55)',
              fontFamily: M, whiteSpace: 'nowrap',
            }}>
              {pill.label}
            </span>
            <span style={{
              padding: '6px 16px',
              fontSize: font.size.xs, fontWeight: font.weight.bold,
              color: colors.textPrimary,
              fontFamily: M, whiteSpace: 'nowrap',
            }}>
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

                {/* ① Ninja zone (60px fixed) — ninja floats above the current node */}
                <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
                  {!isDelivered && current && (
                    <MovingNinja size={35} />
                  )}
                  {isDelivered && stage.key === 'end' && (
                    <DeliveredNinja size={37} />
                  )}
                </div>

                {/* ② Transit-label zone (44px fixed) */}
                <div style={{ height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 2 }}>
                  {stage.isTransit && completed && ev && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 9, fontWeight: font.weight.bold, color: current ? MINT : '#FDFFFF', fontFamily: M, lineHeight: 1.4 }}>
                        In Transit
                      </div>
                      {(() => { const { date, time } = fmtTimestamp(ev.timestamp); return (
                        <>
                          <div style={{ fontSize: 9, color: '#DFE0EB', fontFamily: M, lineHeight: 1.3 }}>{date}</div>
                          <div style={{ fontSize: 9, color: '#DFE0EB', fontFamily: M, lineHeight: 1.3 }}>{time}</div>
                        </>
                      )})()}
                    </div>
                  )}
                </div>

                {/* ③ Icon zone (34px fixed) */}
                <div style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StageIcon stageKey={showAsEDD ? 'end' : stage.key} color={iconColor} size={24} />
                </div>

                {/* ④ Circle (16px, on the track at TRACK_TOP) */}
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
                      <div style={{ fontSize: font.size.xs, fontWeight: font.weight.bold, color: '#FDFFFF', fontFamily: M, lineHeight: 1.3 }}>
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
                          fontWeight: current ? font.weight.bold : font.weight.semibold,
                          color: current ? (isProblem ? RED : MINT) : (completed ? '#FDFFFF' : 'rgba(253,255,255,0.35)'),
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
                            <div style={{ fontSize: 9, color: '#DFE0EB', fontFamily: M, lineHeight: 1.3 }}>{date}</div>
                            <div style={{ fontSize: 9, color: '#DFE0EB', fontFamily: M, lineHeight: 1.3 }}>{time}</div>
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
