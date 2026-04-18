import Link from 'next/link'

// ─── Brand Logos ────────────────────────────────────────────────────────────
const LOGOS: Record<string, { text: string; color: string; bg: string; fontSize?: number }> = {
  Evri:       { text: 'EVRI',    color: '#fff', bg: '#8B2FC9', fontSize: 11 },
  DPD:        { text: 'dpd',     color: '#fff', bg: '#DC0032', fontSize: 12 },
  Yodel:      { text: 'YODEL',   color: '#fff', bg: '#6C1F7C', fontSize: 10 },
  DX:         { text: 'DX',      color: '#fff', bg: '#1C9AD7', fontSize: 12 },
  CitySprint: { text: 'City',    color: '#fff', bg: '#E8651A', fontSize: 10 },
  TikTok:     { text: 'TikTok',  color: '#fff', bg: '#000000', fontSize: 10 },
  Amazon:     { text: 'amazon',  color: '#fff', bg: '#FF9900', fontSize: 10 },
  eBay:       { text: 'eBay',    color: '#E53238', bg: '#f5f5f5', fontSize: 11 },
  Shopify:    { text: 'shopify', color: '#fff', bg: '#95BF47', fontSize: 10 },
  Woo:        { text: 'Woo',     color: '#fff', bg: '#945C87', fontSize: 11 },
}

function BrandLogo({ name }: { name: string }) {
  const logo = LOGOS[name]
  if (!logo) return (
    <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', width: 52, flexShrink: 0, fontFamily: 'Mulish, sans-serif' }}>
      {name}
    </span>
  )
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: logo.bg,
        color: logo.color,
        fontWeight: 800,
        fontSize: logo.fontSize ?? 11,
        borderRadius: 4,
        padding: '2px 6px',
        width: 52,
        flexShrink: 0,
        letterSpacing: '-0.3px',
        fontFamily: 'Mulish, Arial, sans-serif',
      }}
    >
      {logo.text}
    </span>
  )
}

// ─── Chart Data ──────────────────────────────────────────────────────────────
const CHART_CARDS = [
  {
    title: 'Carrier Performance Tracking',
    rows: [
      { name: 'Evri',       good: 266, bad: 32  },
      { name: 'DPD',        good: 179, bad: 49  },
      { name: 'Yodel',      good: 97,  bad: 46  },
      { name: 'DX',         good: 108, bad: 24  },
      { name: 'CitySprint', good: 45,  bad: 12  },
    ],
    colorA: '#1DFB9D',
    colorB: '#CD1C69',
    legendA: 'Delivered on Time',
    legendB: 'Delayed Shipments',
  },
  {
    title: 'Orders Dispatched by Service',
    rows: [
      { name: 'Evri',       good: 266, bad: 125 },
      { name: 'DPD',        good: 146, bad: 125 },
      { name: 'Yodel',      good: 97,  bad: 64  },
      { name: 'DX',         good: 45,  bad: 48  },
      { name: 'CitySprint', good: 45,  bad: 29  },
    ],
    colorA: '#1DFB9D',
    colorB: '#4103CC',
    legendA: 'Packets',
    legendB: 'Parcels',
  },
  {
    title: "Today's Orders",
    rows: [
      { name: 'TikTok',  good: 249, bad: 286 },
      { name: 'Amazon',  good: 168, bad: 221 },
      { name: 'eBay',    good: 129, bad: 168 },
      { name: 'Shopify', good: 81,  bad: 139 },
      { name: 'Woo',     good: 104, bad: 139 },
    ],
    colorA: '#1DFB9D',
    colorB: '#4103CC',
    legendA: 'Completed',
    legendB: 'Not Completed',
  },
]

function ChartBar({ good, bad, colorA, colorB }: {
  good: number; bad: number; colorA: string; colorB: string
}) {
  const total = good + bad
  const goodPct = (good / total) * 100
  const badPct  = (bad  / total) * 100
  return (
    <div style={{ display: 'flex', gap: 2, width: '100%', height: 33, alignItems: 'center' }}>
      <div style={{ width: `${goodPct}%`, background: colorA, height: 33 }} />
      <div style={{ width: `${badPct}%`,  background: colorB, height: 33 }} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
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
          background: 'radial-gradient(circle, rgba(29,251,157,0.12) 0%, rgba(65,3,204,0.06) 50%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      {/* ── KPI row ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, position: 'relative', zIndex: 1 }}>

        {/* Card 1 — Orders Waiting */}
        <div style={whiteCard}>
          <span style={labelStyle}>Orders Waiting</span>
          <span style={{ ...bigNum, color: '#252733' }}>60</span>
        </div>

        {/* Card 2 — Orders Despatched */}
        <div style={whiteCard}>
          <span style={labelStyle}>Orders Despatched</span>
          <span style={{ ...bigNum, color: '#4103CC' }}>16</span>
        </div>

        {/* Card 3 — Alerts (split: Service | Tracking) */}
        <div style={{ ...whiteCard, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={labelStyle}>Alerts</span>
            <span style={{ ...bigNum, color: '#CD1C69' }}>2</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#252733', fontFamily: 'Mulish, sans-serif' }}>Service</span>
          </div>
          <div style={{ width: 1, height: 60, background: '#DFE0EB' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={labelStyle}>Alerts</span>
            <span style={{ ...bigNum, color: '#1DFB9D' }}>0</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#252733', fontFamily: 'Mulish, sans-serif' }}>Tracking</span>
          </div>
        </div>

        {/* Card 4 — Success Rating (dark card) */}
        <div style={{
          background: '#171B2D',
          border: '1px solid #1DFB9D',
          borderRadius: 8,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <span style={{ ...labelStyle, color: '#9FA2B4' }}>Your Success Rating</span>
          <span style={{ ...bigNum, color: '#1DFB9D' }}>98.2%</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1DFB9D', fontFamily: 'Mulish, sans-serif', letterSpacing: '0.1px' }}>
            Moov Ninja Elite Level
          </span>
        </div>
      </div>

      {/* ── Chart row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1, minHeight: 0, position: 'relative', zIndex: 1 }}>
        {CHART_CARDS.map((chart) => (
          <div
            key={chart.title}
            style={{ ...whiteCard, gap: 0, overflow: 'hidden', flex: 1 }}
          >
            <h3 style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#4103CC',
              marginBottom: 16,
              letterSpacing: '0.4px',
              fontFamily: 'Mulish, sans-serif',
            }}>
              {chart.title}
            </h3>

            {/* Bar rows */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {chart.rows.map((row) => (
                <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BrandLogo name={row.name} />
                  <ChartBar good={row.good} bad={row.bad} colorA={chart.colorA} colorB={chart.colorB} />
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, background: chart.colorA, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#000', fontFamily: 'Mulish, sans-serif', letterSpacing: '0.1px' }}>{chart.legendA}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, background: chart.colorB, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#000', fontFamily: 'Mulish, sans-serif', letterSpacing: '0.1px' }}>{chart.legendB}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sensei strip ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#171B2D',
          border: '1px solid #1DFB9D',
          borderRadius: 8,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {/* Sensei avatar */}
        <div
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#1DFB9D',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 20, flexShrink: 0,
          }}
        >
          🥷
        </div>
        <div>
          <span style={{ fontWeight: 700, color: '#1DFB9D', fontSize: 15, fontFamily: 'Mulish, sans-serif', letterSpacing: '0.4px' }}>
            Sensei Says{' '}
          </span>
          <span style={{ color: '#FFFFFF', fontSize: 14, fontStyle: 'italic', fontWeight: 800, fontFamily: 'Mulish, sans-serif', letterSpacing: '0.2px' }}>
            &ldquo;You have 60 orders waiting. 47 are Royal Mail 24 Hour — shall I dispatch them all now?&rdquo;
          </span>
        </div>
        <Link
          href="/orders"
          style={{
            marginLeft: 'auto', flexShrink: 0,
            background: '#1DFB9D', color: '#16122A',
            padding: '0 20px', height: 35, borderRadius: 999,
            display: 'flex', alignItems: 'center',
            fontWeight: 600, fontSize: 12,
            fontFamily: 'Mulish, sans-serif',
            letterSpacing: '0.1px',
            whiteSpace: 'nowrap',
          }}
        >
          Yes, dispatch
        </Link>
      </div>
    </div>
  )
}

// ─── Shared style tokens ──────────────────────────────────────────────────────
const whiteCard: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #DFE0EB',
  borderRadius: 8,
  padding: '20px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#9FA2B4',
  fontWeight: 700,
  fontFamily: 'Mulish, sans-serif',
  letterSpacing: '0.4px',
}

const bigNum: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 700,
  lineHeight: 1,
  fontFamily: 'Mulish, sans-serif',
  letterSpacing: '1px',
}
