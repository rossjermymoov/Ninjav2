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
    <div className="flex flex-col gap-5 relative">

      {/* Gradient orb — top right */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: -80,
          right: -60,
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,83,0.18) 0%, rgba(123,47,190,0.10) 50%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* KPI cards — white surface like V1 */}
      <div className="grid grid-cols-4 gap-4 relative z-10">
        {KPI_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: '#FFFFFF', boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}
          >
            <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>{card.label}</span>
            <span style={{ fontSize: '48px', fontWeight: 800, color: card.numColor, lineHeight: 1 }}>
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* Chart cards row */}
      <div className="grid grid-cols-3 gap-4 relative z-10">
        {CHART_CARDS.map((chart) => (
          <div
            key={chart.title}
            className="rounded-xl p-5 flex flex-col gap-4"
            style={{ background: '#FFFFFF', boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}
          >
            <h3 className="font-bold text-sm" style={{ color: chart.titleColor }}>{chart.title}</h3>
            <div className="flex flex-col gap-3">
              {chart.rows.map((row) => (
                <div key={row.name} className="flex items-center gap-3">
                  <span style={{ width: 64, fontSize: '11px', color: '#374151', fontWeight: 600, flexShrink: 0 }}>
                    {row.name}
                  </span>
                  <ChartBar good={row.good} bad={row.bad} />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 10, borderRadius: 2, background: chart.legendA.color }} />
                <span style={{ fontSize: '10px', color: '#6B7280' }}>{chart.legendA.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 10, borderRadius: 2, background: chart.legendB.color }} />
                <span style={{ fontSize: '10px', color: '#6B7280' }}>{chart.legendB.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sensai strip */}
      <div
        className="rounded-xl px-5 py-4 flex items-center gap-4 relative z-10"
        style={{ background: '#14162A', border: '1px solid #2A2D4A' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-lg"
          style={{ background: 'linear-gradient(135deg, #00C853, #7B2FBE)', color: '#fff' }}
        >
          S
        </div>
        <div>
          <span className="font-semibold" style={{ color: '#00BCD4', fontSize: '13px' }}>
            Sensai Says{' '}
          </span>
          <span style={{ color: '#9AA0BC', fontSize: '13px', fontStyle: 'italic' }}>
            &ldquo;You have 60 orders waiting. 47 are Royal Mail 24 Hour — shall I dispatch them all now?&rdquo;
          </span>
        </div>
        <Link
          href="/orders"
          className="ml-auto px-4 h-8 rounded-full font-semibold shrink-0 flex items-center"
          style={{ background: '#00C853', color: '#000', fontSize: '12px' }}
        >
          Yes, dispatch
        </Link>
      </div>
    </div>
  )
}
