'use client'

import { NinjaCard } from '@/components/ui/NinjaCard'
import { MetricCard } from '@/components/ui/MetricCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MOCK_ORDERS } from '@/lib/mock/orders'
import { colors, font, radii } from '@/lib/tokens'

// ─── Icons ──────────────────────────────────────────────────────────────────

function IconBox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  )
}

function IconTruck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
      <rect width="7" height="7" x="14" y="12" rx="1"/>
      <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/><path d="M17 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
    </svg>
  )
}

function IconCoin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M8 12h8"/>
    </svg>
  )
}

function IconAlertTriangle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  )
}

// ─── Channel bar ─────────────────────────────────────────────────────────────

const CHANNEL_DATA = [
  { name: 'TikTok',  pct: 38, color: colors.tiktok },
  { name: 'Shopify', pct: 24, color: colors.shopify },
  { name: 'Amazon',  pct: 18, color: colors.amazon },
  { name: 'Etsy',    pct: 11, color: colors.etsy },
  { name: 'eBay',    pct: 6,  color: colors.ebay },
  { name: 'Manual',  pct: 3,  color: colors.manual },
]

function ChannelBar() {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 2, marginBottom: 16 }}>
        {CHANNEL_DATA.map((ch) => (
          <div key={ch.name} style={{ width: `${ch.pct}%`, background: ch.color, borderRadius: 3 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
        {CHANNEL_DATA.map((ch) => (
          <div key={ch.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: ch.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family }}>{ch.name}</span>
            <span style={{ fontSize: font.size.sm, color: colors.textMuted, fontFamily: font.family }}>{ch.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

const ALERTS = [
  { id: 'a1', type: 'issue', msg: '3 orders have address issues — action needed',  action: 'Review' },
  { id: 'a2', type: 'warn',  msg: 'Royal Mail API rate limit at 85% — monitor',    action: 'View' },
  { id: 'a3', type: 'info',  msg: '12 orders awaiting carrier label generation',   action: 'Generate' },
]

const ALERT_COLORS: Record<string, string> = {
  issue: colors.statusIssue,
  warn:  colors.statusProcessing,
  info:  colors.mint,
}

function AlertRow({ type, msg, action }: { type: string; msg: string; action: string }) {
  const c = ALERT_COLORS[type] ?? colors.mint
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '12px 0',
      borderBottom: `1px solid ${colors.borderSubtle}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
        <span style={{ fontSize: font.size.md, color: colors.textPrimary, fontFamily: font.family }}>{msg}</span>
      </div>
      <button style={{
        background: 'transparent',
        border: `1px solid ${c}`,
        borderRadius: radii.badge,
        padding: '4px 12px',
        fontSize: font.size.sm,
        fontWeight: font.weight.semibold,
        color: c,
        fontFamily: font.family,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}>
        {action}
      </button>
    </div>
  )
}

// ─── Recent Orders row ────────────────────────────────────────────────────────

function OrderRow({ order }: { order: typeof MOCK_ORDERS[0] }) {
  const status = order.status === 'ready' ? 'ready' : order.status === 'issue' ? 'issue' : 'processing'
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: `1px solid ${colors.borderSubtle}`,
    }}>
      <span style={{ fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.mint, fontFamily: font.family, width: 56, flexShrink: 0 }}>
        {order.orderNumber}
      </span>
      <span style={{ fontSize: font.size.md, color: colors.textPrimary, fontFamily: font.family, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {order.customerName}
      </span>
      <span style={{ fontSize: font.size.sm, color: colors.textSecondary, fontFamily: font.family, width: 80, textAlign: 'right', flexShrink: 0 }}>
        {order.createdAt.split(' ')[0]}
      </span>
      <div style={{ width: 90, display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
        <StatusBadge status={status} />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const recentOrders = MOCK_ORDERS.slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page title */}
      <div>
        <h1 style={{ margin: 0, fontSize: font.size['2xl'], fontWeight: font.weight.extrabold, color: colors.textPrimary, fontFamily: font.family }}>
          Dashboard
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: font.size.md, color: colors.textSecondary, fontFamily: font.family }}>
          Today, 15 March 2024
        </p>
      </div>

      {/* Metric cards row */}
      <div style={{ display: 'flex', gap: 16 }}>
        <MetricCard
          label="Today's Orders"
          value="47"
          sub="vs 39 yesterday"
          trend={{ value: '+20.5%', positive: true }}
          icon={<IconBox />}
        />
        <MetricCard
          label="Revenue"
          value="£3,840"
          sub="avg £81.70 / order"
          trend={{ value: '+8.2%', positive: true }}
          icon={<IconCoin />}
        />
        <MetricCard
          label="Dispatched"
          value="38"
          sub="9 still to dispatch"
          icon={<IconTruck />}
          accent
        />
        <MetricCard
          label="Issues"
          value="3"
          sub="require action"
          trend={{ value: '+2 vs yesterday', positive: false }}
          icon={<IconAlertTriangle />}
        />
      </div>

      {/* Middle row — Recent orders + Channel breakdown */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Recent orders */}
        <NinjaCard style={{ flex: '1.6 1 0', minWidth: 0 }}>
          <SectionHeader title="Recent Orders" count={47} action="View all →" />
          <div>
            {recentOrders.map((o) => <OrderRow key={o.id} order={o} />)}
          </div>
        </NinjaCard>

        {/* Channel breakdown */}
        <NinjaCard style={{ flex: '1 1 0', minWidth: 0 }}>
          <SectionHeader title="Channel Breakdown" />
          <ChannelBar />
          <div style={{ marginTop: 20 }}>
            {CHANNEL_DATA.map((ch) => (
              <div key={ch.name} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: `1px solid ${colors.borderSubtle}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: ch.color, display: 'inline-block' }} />
                  <span style={{ fontSize: font.size.md, color: colors.textPrimary, fontFamily: font.family }}>{ch.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 70, height: 4, borderRadius: 2, background: colors.borderSubtle, overflow: 'hidden' }}>
                    <div style={{ width: `${ch.pct}%`, height: '100%', background: ch.color, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary, fontFamily: font.family, width: 30, textAlign: 'right' }}>
                    {ch.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </NinjaCard>
      </div>

      {/* Bottom — Alerts */}
      <NinjaCard>
        <SectionHeader title="Alerts & Actions" count={3} />
        <div>
          {ALERTS.map((a) => <AlertRow key={a.id} type={a.type} msg={a.msg} action={a.action} />)}
        </div>
      </NinjaCard>

    </div>
  )
}
