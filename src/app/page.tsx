import Link from 'next/link'

const KPI_CARDS = [
  { label: 'Orders Waiting',    value: '60', numColor: '#111827' },
  { label: 'Orders Dispatched', value: '16', numColor: '#7B2FBE' },
  { label: 'Service Alerts',    value: '2',  numColor: '#E91E8C',  sub: 'Service' },
  { label: 'Tracking Alerts',   value: '0',  numColor: '#00C853',  sub: 'Tracking' },
]

const CHART_CARDS = [
  {
    title: 'Carrier Performance Tracking',
    titleColor: '#7B2FBE',
    rows: [
      { name: 'Evri',      good: 78, bad: 12 },
      { name: 'DPD',       good: 65, bad: 18 },
      { name: 'Yodel',     good: 45, bad: 22 },
      { name: 'DX',        good: 55, bad: 14 },
      { name: 'CitySprint',good: 20, bad: 8  },
    ],
    legendA: { color: '#00C853', label: 'Delivered on Time' },
    legendB: { color: '#E91E8C', label: 'Delayed Shipments' },
  },
  {
    title: 'Orders Dispatched by Service',
    titleColor: '#7B2FBE',
    rows: [
      { name: 'Evri',      good: 60, bad: 40 },
      { name: 'DPD',       good: 55, bad: 35 },
      { name: 'Yodel',     good: 40, bad: 30 },
      { name: 'DX',        good: 35, bad: 25 },
      { name: 'CitySprint',good: 22, bad: 18 },
    ],
    legendA: { color: '#00C853', label: 'Packets' },
    legendB: { color: '#7B2FBE', label: 'Parcels' },
  },
  {
    title: "Today's Orders",
    titleColor: '#7B2FBE',
    rows: [
      { name: 'TikTok',  good: 80, bad: 20 },
      { name: 'Amazon',  good: 65, bad: 25 },
      { name: 'eBay',    good: 55, bad: 20 },
      { name: 'Shopify', good: 45, bad: 30 },
      { name: 'Woo',     good: 40, bad: 22 },
    ],
    legendA: { color: '#00C853', label: 'Completed' },
    legendB: { color: '#7B2FBE', label: 'Not Completed' },
  },
]

function ChartBar({ good, bad, total = 100 }: { good: number; bad: number; total?: number }) {
  return (
    <div className="flex gap-1 w-full" style={{ height: 16 }}>
      <div style={{ width: `${(good / total) * 100}%`, background: '#00C853', borderRadius: 3 }} />
      <div style={{ width: `${(bad / total) * 100}%`, background: '#E91E8C', borderRadius: 3 }} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        minHeight: 0,
      }}
    >
      {/* Gradient orb */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: -80, right: -60,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,83,0.15) 0%, rgba(123,47,190,0.08) 50%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      {/* KPI row — fixed height */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, position: 'relative', zIndex: 1 }}>
        {KPI_CARDS.map((card) => (
          <div
            key={card.label}
            style={{ background: '#FFFFFF', borderRadius: 14, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
          >
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{card.label}</span>
            <span style={{ fontSize: 52, fontWeight: 800, color: card.numColor, lineHeight: 1 }}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Chart row — grows to fill remaining space */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1, minHeight: 0, position: 'relative', zIndex: 1 }}>
        {CHART_CARDS.map((chart) => (
          <div
            key={chart.title}
            style={{ background: '#FFFFFF', borderRadius: 14, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.3)', overflow: 'hidden' }}
          >
            <h3 style={{ fontSize: 13, fontWeight: 700, color: chart.titleColor, marginBottom: 20 }}>{chart.title}</h3>
            {/* Bars — flex-1 so they spread evenly */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {chart.rows.map((row) => (
                <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 68, fontSize: 11, color: '#374151', fontWeight: 600, flexShrink: 0 }}>
                    {row.name}
                  </span>
                  <ChartBar good={row.good} bad={row.bad} />
                </div>
              ))}
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: chart.legendA.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#6B7280' }}>{chart.legendA.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: chart.legendB.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#6B7280' }}>{chart.legendB.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sensai strip — pinned to bottom */}
      <div
        style={{
          background: '#14162A',
          border: '1px solid #2A2D4A',
          borderRadius: 14,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00C853, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 16, color: '#fff', flexShrink: 0,
          }}
        >
          S
        </div>
        <div>
          <span style={{ fontWeight: 600, color: '#00BCD4', fontSize: 13 }}>Sensei Says </span>
          <span style={{ color: '#9AA0BC', fontSize: 13, fontStyle: 'italic' }}>
            &ldquo;You have 60 orders waiting. 47 are Royal Mail 24 Hour — shall I dispatch them all now?&rdquo;
          </span>
        </div>
        <Link
          href="/orders"
          style={{
            marginLeft: 'auto', flexShrink: 0,
            background: '#00C853', color: '#000',
            padding: '0 16px', height: 32, borderRadius: 999,
            display: 'flex', alignItems: 'center',
            fontWeight: 700, fontSize: 12,
          }}
        >
          Yes, dispatch
        </Link>
      </div>
    </div>
  )
}
