'use client'

import React, { useState } from 'react'
import { NinjaCard } from '@/components/ui/NinjaCard'
import { colors, font, radii, shadows } from '@/lib/tokens'

// ─── Date range selector ──────────────────────────────────────────────────────

const DATE_OPTIONS = ['Today', 'Yesterday', 'This Week', 'This Month'] as const
type DateRange = typeof DATE_OPTIONS[number]

function DateSelector({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  return (
    <div style={{ display: 'flex', gap: 2, background: colors.cardBg, border: `1px solid ${colors.borderSubtle}`, borderRadius: radii.pill, padding: 3 }}>
      {DATE_OPTIONS.map((opt) => (
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

// ─── Channel logos ────────────────────────────────────────────────────────────

function LogoTikTok() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.83a8.18 8.18 0 0 0 4.78 1.52V4.54a4.85 4.85 0 0 1-1-.15z" fill="#FF0050"/>
    </svg>
  )
}

function LogoShopify() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M15.337 23.979l7.046-1.523S19.987 7.514 19.97 7.388c-.017-.126-.126-.207-.225-.207s-1.946-.135-1.946-.135-.529-.53-1.324-1.342v-.01c0-.009-.009-.009-.009-.018-.765-.756-1.972-1.108-2.917-.918C13.218 3.466 12.372 3 11.599 3c-5.836.009-8.608 7.298-9.481 11.007-.324 1.27-.459 2.513-.404 3.693L.009 18.458s-.927 3.476 2.422 3.467c.891-.009 1.853-1.018 1.853-1.018s.107 1.09 1.323 1.072h.018zm-4.68-13.39c-.027.008-.054.017-.072.017-.873.243-1.818.522-2.764.801 0-.053-.008-.098-.008-.143C7.83 9.95 8.856 8.8 9.603 8.413c.072 1.036.09 1.999.054 3.176zm1.288-9.571c.783.044 1.316.945 1.639 1.935-.423.081-1.846.357-3.332.639.647-2.422 1.882-2.583 1.693-2.574zm-.324 4.725c-1.873.333-3.898.693-5.916 1.045.602-2.305 2.152-4.5 3.953-4.977.026.143.044.296.062.44 0 .485.018 2.044.018 2.044l-.117 1.448zm8.456 3.071c-.009 0-1.693-.108-1.693-.108s-1.449-1.44-1.612-1.601c-.054-.063-.126-.09-.207-.099V23.98l5.233-1.126s-1.693-12.953-1.72-13.04z" fill="#96BF48"/>
    </svg>
  )
}

function LogoAmazon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M13.958 10.09c0 1.232.031 2.256-.59 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.698-3.182v.685zm3.186 7.705a.66.66 0 01-.663.075c-.931-.775-1.097-1.133-1.608-1.87-1.537 1.57-2.627 2.04-4.619 2.04-2.355 0-4.191-1.453-4.191-4.363 0-2.274 1.232-3.821 2.989-4.579 1.523-.67 3.651-.788 5.278-.973v-.363c0-.668.053-1.458-.341-2.036-.342-.518-.997-.733-1.573-.733-1.069 0-2.019.548-2.253 1.684-.048.254-.233.504-.487.517l-2.724-.294c-.23-.051-.484-.238-.419-.592.627-3.306 3.611-4.302 6.286-4.302 1.366 0 3.151.362 4.227 1.394 1.366 1.275 1.235 2.977 1.235 4.829v4.37c0 1.313.545 1.889 1.057 2.597.181.251.221.553-.01.741-.57.477-1.586 1.36-2.144 1.858l-.04-.04z" fill="#FF9900"/>
      <path d="M20.583 17.69c-2.396 1.771-5.869 2.715-8.858 2.715-4.191 0-7.961-1.549-10.816-4.13-.224-.202-.024-.478.246-.321 3.08 1.792 6.886 2.874 10.82 2.874 2.652 0 5.565-.551 8.246-1.692.405-.172.742.265.362.554z" fill="#FF9900"/>
      <path d="M21.529 16.6c-.307-.393-2.03-.186-2.803-.094-.236.028-.272-.176-.059-.325 1.373-.965 3.626-.686 3.89-.362.263.325-.069 2.578-1.358 3.653-.198.166-.387.078-.299-.141.29-.724.937-2.338.629-2.731z" fill="#FF9900"/>
    </svg>
  )
}

function LogoEtsy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9.82 17.34v-.77c-.94.16-1.87.23-2.78.22-.74 0-1.17-.41-1.17-1.16V12.5h3.42v-1.38H5.87V7.85c.71 0 1.65.07 2.41.2l.58 1.73h.96V6.67H3v.82l1.02.27v9.63L3 17.65v.82h6.82v-1.13zm9.49-1.99c-.35.75-1.2 1.32-2.08 1.32-1.43 0-2.09-1.05-2.14-2.83h4.82c.04-.27.06-.55.06-.82 0-2.07-1.26-3.62-3.22-3.62-2.02 0-3.48 1.58-3.48 3.82 0 2.38 1.42 3.78 3.6 3.78 1.49 0 2.66-.68 3.22-1.84l-.78-.61zm-4.2-2.94c.06-1.22.62-2.08 1.53-2.08.96 0 1.47.76 1.52 2.08h-3.05z" fill="#F45800"/>
    </svg>
  )
}

function LogoEbay() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M1 10.295c0-1.32 1.069-2.39 2.39-2.39s2.39 1.07 2.39 2.39v3.41c0 1.32-1.069 2.39-2.39 2.39S1 15.025 1 13.705v-3.41z" fill="#E53238"/>
      <path d="M7.33 8.265h1.33v7.535H7.33V8.265z" fill="#0064D2"/>
      <path d="M10.32 8.265h1.33v7.535H10.32V8.265z" fill="#F5AF02"/>
      <path d="M13.31 8.265h1.33v7.535H13.31V8.265z" fill="#86B817"/>
      <path d="M16.3 8.265h1.33v7.535H16.3V8.265z" fill="#E53238"/>
      <path d="M19.29 10.295c0-1.32 1.069-2.39 2.39-2.39.63 0 1.2.24 1.63.64l-1.63 1.75v3.41l1.63 1.75c-.43.4-1 .64-1.63.64-1.321 0-2.39-1.07-2.39-2.39v-3.41z" fill="#0064D2"/>
    </svg>
  )
}

function LogoManual() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.manual} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}

function LogoWoo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3.88 4h16.24C21.16 4 22 4.84 22 5.88v12.24c0 1.04-.84 1.88-1.88 1.88H3.88C2.84 20 2 19.16 2 18.12V5.88C2 4.84 2.84 4 3.88 4z" fill="#7F54B3"/>
      <path d="M4.52 8.33c.2-.28.49-.43.88-.46 1.51-.1 2.28.62 2.3 2.14.03 1.04-.17 2.03-.42 2.95l1.67-4.87c.19-.52.49-.79.91-.82.59-.04.96.28 1.09.96l.84 3.93c.3-.94.67-1.75 1.12-2.45.27-.41.6-.63.99-.66.31-.02.59.07.82.27-.37.07-.68.26-.93.59-.44.59-.87 1.74-1.27 3.44-.06.27-.1.5-.1.7 0 .29.1.46.3.52-.5.31-1 .43-1.49.37-.46-.06-.76-.37-.91-.93L9.28 11l-1.33 3.88c-.21.57-.55.86-.99.89-.37.02-.66-.17-.87-.57L3.85 9.95c-.1-.22-.06-.46.07-.62l.6-1z" fill="white"/>
    </svg>
  )
}

const CHANNEL_LOGOS: Record<string, React.ReactElement> = {
  tiktok: <LogoTikTok />,
  shopify: <LogoShopify />,
  amazon: <LogoAmazon />,
  etsy: <LogoEtsy />,
  ebay: <LogoEbay />,
  manual: <LogoManual />,
  woocommerce: <LogoWoo />,
}

// ─── Mock data (driven by date range) ────────────────────────────────────────

const DATA: Record<DateRange, {
  revenue: number
  ordersOutstanding: number
  toDispatch: number
  trackedIssues: number
  collectionRisk: number
  channels: { key: string; name: string; count: number; color: string }[]
  countries: { flag: string; name: string; count: number }[]
  services: { name: string; count: number }[]
  couriers: { name: string; count: number }[]
  collectionAlerts: { orderNo: string; channel: string; service: string; cutoff: string; minsLeft: number }[]
  trackingAlerts: { orderNo: string; carrier: string; tracking: string; issue: string }[]
}> = {
  Today: {
    revenue: 3840,
    ordersOutstanding: 47,
    toDispatch: 9,
    trackedIssues: 3,
    collectionRisk: 2,
    channels: [
      { key: 'tiktok',      name: 'TikTok',     count: 18, color: colors.tiktok },
      { key: 'shopify',     name: 'Shopify',    count: 11, color: colors.shopify },
      { key: 'amazon',      name: 'Amazon',     count: 9,  color: colors.amazon },
      { key: 'etsy',        name: 'Etsy',       count: 5,  color: colors.etsy },
      { key: 'ebay',        name: 'eBay',       count: 3,  color: colors.ebay },
      { key: 'manual',      name: 'Manual',     count: 1,  color: colors.manual },
    ],
    countries: [
      { flag: '🇬🇧', name: 'United Kingdom', count: 38 },
      { flag: '🇩🇪', name: 'Germany',        count: 4 },
      { flag: '🇫🇷', name: 'France',         count: 3 },
      { flag: '🇺🇸', name: 'United States',  count: 2 },
    ],
    services: [
      { name: '24hr Tracked',    count: 22 },
      { name: 'Next Day',        count: 14 },
      { name: '48hr',            count: 8 },
      { name: 'Saturday',        count: 3 },
    ],
    couriers: [
      { name: 'Royal Mail', count: 21 },
      { name: 'DPD',        count: 15 },
      { name: 'Evri',       count: 9 },
      { name: 'UPS',        count: 2 },
    ],
    collectionAlerts: [
      { orderNo: '#5501', channel: 'shopify',  service: 'Next Day',  cutoff: '14:30', minsLeft: 18 },
      { orderNo: '#5502', channel: 'tiktok',   service: '24hr',      cutoff: '14:30', minsLeft: 18 },
    ],
    trackingAlerts: [
      { orderNo: '#4873', carrier: 'DPD',        tracking: 'DPD15935742013', issue: 'Address not found' },
      { orderNo: '#4901', carrier: 'Royal Mail', tracking: 'RM551234567GB',  issue: 'Delivery attempted' },
      { orderNo: '#4812', carrier: 'Evri',       tracking: 'H00CC11223344',  issue: 'Held at depot' },
    ],
  },
  Yesterday: {
    revenue: 4120,
    ordersOutstanding: 39,
    toDispatch: 0,
    trackedIssues: 1,
    collectionRisk: 0,
    channels: [
      { key: 'tiktok',      name: 'TikTok',     count: 15, color: colors.tiktok },
      { key: 'shopify',     name: 'Shopify',    count: 10, color: colors.shopify },
      { key: 'amazon',      name: 'Amazon',     count: 8,  color: colors.amazon },
      { key: 'etsy',        name: 'Etsy',       count: 4,  color: colors.etsy },
      { key: 'ebay',        name: 'eBay',       count: 2,  color: colors.ebay },
    ],
    countries: [
      { flag: '🇬🇧', name: 'United Kingdom', count: 32 },
      { flag: '🇩🇪', name: 'Germany',        count: 4 },
      { flag: '🇫🇷', name: 'France',         count: 2 },
      { flag: '🇺🇸', name: 'United States',  count: 1 },
    ],
    services: [
      { name: '24hr Tracked', count: 19 },
      { name: 'Next Day',     count: 12 },
      { name: '48hr',         count: 6 },
      { name: 'Saturday',     count: 2 },
    ],
    couriers: [
      { name: 'Royal Mail', count: 20 },
      { name: 'DPD',        count: 12 },
      { name: 'Evri',       count: 7 },
    ],
    collectionAlerts: [],
    trackingAlerts: [
      { orderNo: '#4812', carrier: 'Evri', tracking: 'H00CC11223344', issue: 'Held at depot' },
    ],
  },
  'This Week': {
    revenue: 21300,
    ordersOutstanding: 211,
    toDispatch: 9,
    trackedIssues: 8,
    collectionRisk: 2,
    channels: [
      { key: 'tiktok',      name: 'TikTok',     count: 80, color: colors.tiktok },
      { key: 'shopify',     name: 'Shopify',    count: 55, color: colors.shopify },
      { key: 'amazon',      name: 'Amazon',     count: 38, color: colors.amazon },
      { key: 'etsy',        name: 'Etsy',       count: 23, color: colors.etsy },
      { key: 'ebay',        name: 'eBay',       count: 11, color: colors.ebay },
      { key: 'manual',      name: 'Manual',     count: 4,  color: colors.manual },
    ],
    countries: [
      { flag: '🇬🇧', name: 'United Kingdom', count: 172 },
      { flag: '🇩🇪', name: 'Germany',        count: 18 },
      { flag: '🇫🇷', name: 'France',         count: 12 },
      { flag: '🇺🇸', name: 'United States',  count: 9 },
    ],
    services: [
      { name: '24hr Tracked', count: 99 },
      { name: 'Next Day',     count: 66 },
      { name: '48hr',         count: 32 },
      { name: 'Saturday',     count: 14 },
    ],
    couriers: [
      { name: 'Royal Mail', count: 98 },
      { name: 'DPD',        count: 71 },
      { name: 'Evri',       count: 34 },
      { name: 'UPS',        count: 8 },
    ],
    collectionAlerts: [
      { orderNo: '#5501', channel: 'shopify', service: 'Next Day', cutoff: '14:30', minsLeft: 18 },
      { orderNo: '#5502', channel: 'tiktok',  service: '24hr',     cutoff: '14:30', minsLeft: 18 },
    ],
    trackingAlerts: [
      { orderNo: '#4873', carrier: 'DPD',        tracking: 'DPD15935742013', issue: 'Address not found' },
      { orderNo: '#4901', carrier: 'Royal Mail', tracking: 'RM551234567GB',  issue: 'Delivery attempted' },
      { orderNo: '#4812', carrier: 'Evri',       tracking: 'H00CC11223344',  issue: 'Held at depot' },
      { orderNo: '#4650', carrier: 'DPD',        tracking: 'DPD29384756201', issue: 'Customer refused' },
      { orderNo: '#4731', carrier: 'Royal Mail', tracking: 'RM443322110GB',  issue: 'Return to sender' },
    ],
  },
  'This Month': {
    revenue: 89450,
    ordersOutstanding: 847,
    toDispatch: 9,
    trackedIssues: 31,
    collectionRisk: 2,
    channels: [
      { key: 'tiktok',      name: 'TikTok',     count: 322, color: colors.tiktok },
      { key: 'shopify',     name: 'Shopify',    count: 203, color: colors.shopify },
      { key: 'amazon',      name: 'Amazon',     count: 152, color: colors.amazon },
      { key: 'etsy',        name: 'Etsy',       count: 93,  color: colors.etsy },
      { key: 'ebay',        name: 'eBay',       count: 51,  color: colors.ebay },
      { key: 'manual',      name: 'Manual',     count: 26,  color: colors.manual },
    ],
    countries: [
      { flag: '🇬🇧', name: 'United Kingdom', count: 688 },
      { flag: '🇩🇪', name: 'Germany',        count: 72 },
      { flag: '🇫🇷', name: 'France',         count: 49 },
      { flag: '🇺🇸', name: 'United States',  count: 38 },
    ],
    services: [
      { name: '24hr Tracked', count: 399 },
      { name: 'Next Day',     count: 264 },
      { name: '48hr',         count: 128 },
      { name: 'Saturday',     count: 56 },
    ],
    couriers: [
      { name: 'Royal Mail', count: 391 },
      { name: 'DPD',        count: 284 },
      { name: 'Evri',       count: 138 },
      { name: 'UPS',        count: 34 },
    ],
    collectionAlerts: [
      { orderNo: '#5501', channel: 'shopify', service: 'Next Day', cutoff: '14:30', minsLeft: 18 },
      { orderNo: '#5502', channel: 'tiktok',  service: '24hr',     cutoff: '14:30', minsLeft: 18 },
    ],
    trackingAlerts: [
      { orderNo: '#4873', carrier: 'DPD',        tracking: 'DPD15935742013', issue: 'Address not found' },
      { orderNo: '#4901', carrier: 'Royal Mail', tracking: 'RM551234567GB',  issue: 'Delivery attempted' },
      { orderNo: '#4812', carrier: 'Evri',       tracking: 'H00CC11223344',  issue: 'Held at depot' },
    ],
  },
}

// ─── Stat chip (top bar) ─────────────────────────────────────────────────────

function StatChip({
  label, value, sub, color, warning,
}: {
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
      boxShadow: warning ? `0 0 12px rgba(255,77,106,0.15)` : shadows.card,
    }}>
      <p style={{ margin: 0, fontSize: font.size.xs, fontWeight: font.weight.semibold, color: colors.textMuted, fontFamily: font.family, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
      <p style={{ margin: '6px 0 0', fontSize: font.size['3xl'], fontWeight: font.weight.extrabold, color: c, fontFamily: font.family, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: '4px 0 0', fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family }}>{sub}</p>}
    </div>
  )
}

// ─── Channel orders panel ─────────────────────────────────────────────────────

function ChannelOrders({ channels }: { channels: typeof DATA['Today']['channels'] }) {
  const max = Math.max(...channels.map(c => c.count))
  const total = channels.reduce((s, c) => s + c.count, 0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {channels.map((ch) => (
        <div key={ch.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Logo */}
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: colors.surfaceBg,
            border: `1px solid ${colors.borderSubtle}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {CHANNEL_LOGOS[ch.key] ?? <LogoManual />}
          </div>
          {/* Name */}
          <span style={{ width: 68, fontSize: font.size.md, color: colors.textPrimary, fontFamily: font.family, flexShrink: 0 }}>{ch.name}</span>
          {/* Bar */}
          <div style={{ flex: 1, height: 8, background: colors.borderSubtle, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              width: `${(ch.count / max) * 100}%`,
              height: '100%',
              background: ch.color,
              borderRadius: 4,
              transition: 'width 0.4s ease',
            }} />
          </div>
          {/* Count + pct */}
          <span style={{ width: 28, fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.textPrimary, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>{ch.count}</span>
          <span style={{ width: 36, fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>{Math.round((ch.count / total) * 100)}%</span>
        </div>
      ))}
    </div>
  )
}

// ─── Breakdown mini-list ──────────────────────────────────────────────────────

function BreakdownList({ items, colorFn }: {
  items: { name: string; count: number; flag?: string }[]
  colorFn?: (i: number) => string
}) {
  const max = Math.max(...items.map(i => i.count))
  const total = items.reduce((s, i) => s + i.count, 0)
  const PALETTE = [colors.mint, colors.statusShipped, colors.statusProcessing, colors.mintDim]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, idx) => {
        const c = colorFn ? colorFn(idx) : PALETTE[idx % PALETTE.length]
        return (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {item.flag && <span style={{ fontSize: 13, flexShrink: 0 }}>{item.flag}</span>}
            <span style={{ flex: 1, fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
            <div style={{ width: 60, height: 5, background: colors.borderSubtle, borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ width: `${(item.count / max) * 100}%`, height: '100%', background: c, borderRadius: 3 }} />
            </div>
            <span style={{ width: 30, fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textPrimary, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>{item.count}</span>
            <span style={{ width: 30, fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, textAlign: 'right', flexShrink: 0 }}>{Math.round((item.count / total) * 100)}%</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Alert rows ───────────────────────────────────────────────────────────────

function CollectionAlert({ a }: { a: typeof DATA['Today']['collectionAlerts'][0] }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px',
      background: 'rgba(245,166,35,0.07)',
      border: `1px solid rgba(245,166,35,0.25)`,
      borderRadius: 10,
      marginBottom: 8,
    }}>
      <div style={{ width: 22, height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {CHANNEL_LOGOS[a.channel] ?? <LogoManual />}
      </div>
      <span style={{ fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.mint, fontFamily: font.family, width: 52, flexShrink: 0 }}>{a.orderNo}</span>
      <span style={{ flex: 1, fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>{a.service}</span>
      <span style={{ fontSize: font.size.sm, color: colors.statusProcessing, fontFamily: font.family, fontWeight: font.weight.bold, flexShrink: 0 }}>
        ⏱ {a.minsLeft}m left
      </span>
      <span style={{ fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family, flexShrink: 0 }}>cutoff {a.cutoff}</span>
    </div>
  )
}

function TrackingAlert({ a }: { a: typeof DATA['Today']['trackingAlerts'][0] }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px',
      background: 'rgba(255,77,106,0.07)',
      border: `1px solid rgba(255,77,106,0.20)`,
      borderRadius: 10,
      marginBottom: 8,
    }}>
      <span style={{ fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.mint, fontFamily: font.family, width: 52, flexShrink: 0 }}>{a.orderNo}</span>
      <span style={{ fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family, width: 70, flexShrink: 0 }}>{a.carrier}</span>
      <span style={{ flex: 1, fontSize: font.size.sm, color: colors.statusIssue, fontFamily: font.family }}>{a.issue}</span>
      <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: font.family, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>{a.tracking}</span>
    </div>
  )
}

// ─── Pill label ───────────────────────────────────────────────────────────────

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
    }}>{text}</p>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [range, setRange] = useState<DateRange>('Today')
  const d = DATA[range]
  const fmt = (n: number) =>
    n >= 1000 ? `£${(n / 1000).toFixed(1)}k` : `£${n.toLocaleString()}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: font.size.xl, fontWeight: font.weight.extrabold, color: colors.textPrimary, fontFamily: font.family }}>Dashboard</h1>
        </div>
        <DateSelector value={range} onChange={setRange} />
      </div>

      {/* Stat strip */}
      <div style={{ display: 'flex', gap: 12 }}>
        <StatChip label="Revenue"           value={fmt(d.revenue)}              sub="gross sales" />
        <StatChip label="Orders Outstanding" value={String(d.ordersOutstanding)} sub="across all channels" color={colors.textPrimary} />
        <StatChip label="Left to Dispatch"  value={String(d.toDispatch)}        sub="need action today" color={d.toDispatch > 0 ? colors.statusProcessing : colors.mint} warning={d.toDispatch > 5} />
        <StatChip label="Tracking Issues"   value={String(d.trackedIssues)}     sub="parcels flagged" color={d.trackedIssues > 0 ? colors.statusIssue : colors.mint} warning={d.trackedIssues > 0} />
        <StatChip label="Collection Risk"   value={String(d.collectionRisk)}    sub="near cutoff time" color={d.collectionRisk > 0 ? colors.statusProcessing : colors.mint} warning={d.collectionRisk > 0} />
      </div>

      {/* Middle row — channel orders + alerts */}
      <div style={{ display: 'flex', gap: 12 }}>

        {/* Channel orders */}
        <NinjaCard style={{ flex: '1.4 1 0', minWidth: 0 }} padding="18px 20px">
          <PanelLabel text="Orders by Channel" />
          <ChannelOrders channels={d.channels} />
        </NinjaCard>

        {/* Collection risk */}
        <NinjaCard style={{ flex: '1 1 0', minWidth: 0 }} padding="18px 20px">
          <PanelLabel text={`Collection Cutoff Risk${d.collectionAlerts.length ? ` — cutoff 14:30` : ''}`} />
          {d.collectionAlerts.length > 0
            ? d.collectionAlerts.map((a, i) => <CollectionAlert key={i} a={a} />)
            : <p style={{ margin: 0, fontSize: font.size.md, color: colors.textMuted, fontFamily: font.family }}>No orders at risk ✓</p>
          }

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${colors.borderSubtle}` }}>
            <PanelLabel text="Tracking Issues" />
            {d.trackingAlerts.slice(0, 3).map((a, i) => <TrackingAlert key={i} a={a} />)}
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

      {/* Bottom row — 3 breakdown panels */}
      <div style={{ display: 'flex', gap: 12 }}>

        <NinjaCard style={{ flex: 1, minWidth: 0 }} padding="18px 20px">
          <PanelLabel text="Shipments by Country" />
          <BreakdownList items={d.countries.map(c => ({ name: c.name, count: c.count, flag: c.flag }))} />
        </NinjaCard>

        <NinjaCard style={{ flex: 1, minWidth: 0 }} padding="18px 20px">
          <PanelLabel text="Shipments by Service" />
          <BreakdownList items={d.services} />
        </NinjaCard>

        <NinjaCard style={{ flex: 1, minWidth: 0 }} padding="18px 20px">
          <PanelLabel text="Shipments by Courier" />
          <BreakdownList
            items={d.couriers}
            colorFn={(i) => ['#FDFFFF', colors.statusShipped, colors.mint, colors.statusProcessing][i % 4]}
          />
        </NinjaCard>

      </div>

    </div>
  )
}
