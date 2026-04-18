import Link from 'next/link'

// ─── Design tokens (extracted from Figma CSS) ────────────────────────────────
const M = 'Mulish, sans-serif'

// ─── Chart data ───────────────────────────────────────────────────────────────
// good / bad = visible px widths from Figma CSS (volume chart, not %-fill)
// maxTotal = the widest row's total — sets the 100% reference for all rows
const CHART_CARDS = [
  {
    title: 'Carrier Performance Tracking',
    maxTotal: 266,   // Evri row = 234+32 = 266px (widest)
    rows: [
      { name: 'Evri',       good: 234, bad: 32  },
      { name: 'DPD',        good: 134, bad: 49  },
      { name: 'Yodel',      good: 82,  bad: 46  },
      { name: 'DX',         good: 91,  bad: 24  },
      { name: 'CitySprint', good: 43,  bad: 12  },
    ],
    colorA: '#1DFB9D',
    colorB: '#CD1C69',
    legendA: 'Delivered on Time',
    legendB: 'Delayed Shipments',
  },
  {
    title: 'Orders Dispatched by Service',
    maxTotal: 266,   // Evri row = 141+125 = 266px
    rows: [
      { name: 'Evri',       good: 141, bad: 125 },
      { name: 'DPD',        good: 122, bad: 125 },
      { name: 'Yodel',      good: 82,  bad: 64  },
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
    maxTotal: 286,   // TikTok row = 249+37 = 286px
    rows: [
      { name: 'TikTok',  good: 249, bad: 37  },
      { name: 'Amazon',  good: 168, bad: 53  },
      { name: 'eBay',    good: 129, bad: 39  },
      { name: 'Shopify', good: 81,  bad: 58  },
      { name: 'Woo',     good: 104, bad: 35  },
    ],
    colorA: '#1DFB9D',
    colorB: '#4103CC',
    legendA: 'Completed',
    legendB: 'Not Completed',
  },
]

// ─── Brand Logos ─────────────────────────────────────────────────────────────
const LOGOS: Record<string, { text: string; color: string; bg: string; fs?: number }> = {
  Evri:       { text: 'EVRI',    color: '#fff', bg: '#8B2FC9', fs: 10 },
  DPD:        { text: 'dpd',     color: '#fff', bg: '#DC0032', fs: 11 },
  Yodel:      { text: 'YODEL',   color: '#fff', bg: '#6C1F7C', fs: 9  },
  DX:         { text: 'DX',      color: '#fff', bg: '#1C9AD7', fs: 11 },
  CitySprint: { text: 'City',    color: '#fff', bg: '#E8651A', fs: 9  },
  TikTok:     { text: 'TikTok',  color: '#fff', bg: '#000000', fs: 9  },
  Amazon:     { text: 'amazon',  color: '#fff', bg: '#FF9900', fs: 9  },
  eBay:       { text: 'eBay',    color: '#E53238', bg: '#f5f5f5', fs: 10 },
  Shopify:    { text: 'shopify', color: '#fff', bg: '#95BF47', fs: 9  },
  Woo:        { text: 'Woo',     color: '#fff', bg: '#945C87', fs: 10 },
}

function BrandLogo({ name }: { name: string }) {
  const logo = LOGOS[name]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: logo?.bg ?? '#e5e7eb',
      color: logo?.color ?? '#374151',
      fontWeight: 800,
      fontSize: logo?.fs ?? 10,
      borderRadius: 3,
      width: 35,
      height: 20,
      flexShrink: 0,
      letterSpacing: '-0.3px',
      fontFamily: M,
    }}>
      {logo?.text ?? name}
    </span>
  )
}

// ─── Chart bar — volume bar (Figma design) ───────────────────────────────────
// The filled portion = (good+bad)/maxTotal of the container width.
// Within the filled portion: colorA = good fraction, colorB = bad fraction.
// Remaining space is empty (matches Figma where shorter rows don't fill full width).
function ChartBar({ good, bad, maxTotal, colorA, colorB }: {
  good: number; bad: number; maxTotal: number; colorA: string; colorB: string
}) {
  const filledPct = ((good + bad) / maxTotal) * 100
  const goodFrac  = (good / (good + bad)) * 100
  return (
    <div style={{ display: 'flex', flex: 1, height: 33, alignItems: 'stretch' }}>
      {/* Filled portion — scales against maxTotal */}
      <div style={{ width: `${filledPct}%`, display: 'flex', flexShrink: 0, height: 33 }}>
        <div style={{ width: `${goodFrac}%`, background: colorA, height: 33 }} />
        <div style={{ flex: 1,              background: colorB, height: 33 }} />
      </div>
      {/* Empty remainder */}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', minHeight: 0 }}>

      {/* Gradient orb */}
      <div style={{
        pointerEvents: 'none', position: 'absolute', top: -80, right: -60,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,251,157,0.10) 0%, rgba(65,3,204,0.05) 50%, transparent 70%)',
        filter: 'blur(50px)', zIndex: 0,
      }} />

      {/* ── KPI row ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, zIndex: 1 }}>

        {/* Card 1 — Orders Waiting */}
        <div style={kpiCard}>
          <span style={kpiLabel('#9FA2B4')}>Orders Waiting</span>
          <span style={kpiNum('#252733')}>60</span>
        </div>

        {/* Card 2 — Orders Despatched */}
        <div style={kpiCard}>
          <span style={kpiLabel('#4103CC')}>Orders Despatched</span>
          <span style={kpiNum('#4103CC')}>16</span>
        </div>

        {/* Card 3 — Alerts (split: Service | Tracking) */}
        <div style={{ ...kpiCard, padding: 0, overflow: 'hidden' }}>
          {/* "Alerts" title */}
          <span style={{
            display: 'block',
            textAlign: 'center',
            fontFamily: M, fontWeight: 700, fontSize: 19, lineHeight: '24px',
            letterSpacing: '0.4px', color: '#4103CC',
            paddingTop: 16,
          }}>
            Alerts
          </span>
          {/* Two-column numbers */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            {/* Service */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={kpiNum('#CD1C69')}>2</span>
            </div>
            {/* Divider */}
            <div style={{ width: 1, height: 50, background: '#DFE0EB' }} />
            {/* Tracking */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={kpiNum('#1DFB9D')}>0</span>
            </div>
          </div>
          {/* Bottom labels */}
          <div style={{ display: 'flex', borderTop: '1px solid #DFE0EB' }}>
            <span style={{
              flex: 1, textAlign: 'center',
              fontFamily: M, fontWeight: 600, fontSize: 14, color: '#252733',
              letterSpacing: '0.3px', padding: '6px 0',
            }}>Service</span>
            <div style={{ width: 1, background: '#DFE0EB' }} />
            <span style={{
              flex: 1, textAlign: 'center',
              fontFamily: M, fontWeight: 600, fontSize: 14, color: '#252733',
              letterSpacing: '0.3px', padding: '6px 0',
            }}>Tracking</span>
          </div>
        </div>

        {/* Card 4 — Success Rating (dark card with icon) */}
        <div style={{
          background: '#171B2D', border: '1px solid #1DFB9D', borderRadius: 8,
          height: 135, display: 'flex', flexDirection: 'row', alignItems: 'center',
          overflow: 'hidden', boxSizing: 'border-box',
        }}>
          {/* Icon area */}
          <div style={{
            width: 106, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
            borderRight: '1px solid rgba(29,251,157,0.2)',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(29,251,157,0.12)', border: '1.5px solid #1DFB9D',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>🥷</div>
          </div>
          {/* Text */}
          <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
            <span style={{ fontFamily: M, fontWeight: 700, fontSize: 14, color: '#9FA2B4', letterSpacing: '0.2px', lineHeight: '18px' }}>
              Your Success Rating
            </span>
            <span style={{ fontFamily: M, fontWeight: 700, fontSize: 40, color: '#1DFB9D', letterSpacing: '1px', lineHeight: '50px' }}>
              98.2%
            </span>
            <span style={{ fontFamily: M, fontWeight: 600, fontSize: 12, color: '#1DFB9D', letterSpacing: '0.1px' }}>
              Moov Ninja Elite Level
            </span>
          </div>
        </div>
      </div>

      {/* ── Chart row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1, minHeight: 0, zIndex: 1 }}>
        {CHART_CARDS.map((chart) => (
          <div key={chart.title} style={{
            background: '#FFFFFF', border: '1px solid #DFE0EB', borderRadius: 8,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxSizing: 'border-box', padding: '12px 20px 14px',
          }}>
            {/* Title — Figma: left:23px top:12px, font-size:19px */}
            <h3 style={{
              fontFamily: M, fontWeight: 700, fontSize: 19, lineHeight: '24px',
              letterSpacing: '0.4px', color: '#4103CC',
              margin: 0, marginBottom: 16, flexShrink: 0,
            }}>
              {chart.title}
            </h3>

            {/* Bar rows — fixed 12px gap (Figma: 45px pitch − 33px bar = 12px gap) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              {chart.rows.map((row) => (
                <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BrandLogo name={row.name} />
                  <ChartBar good={row.good} bad={row.bad} maxTotal={chart.maxTotal} colorA={chart.colorA} colorB={chart.colorB} />
                </div>
              ))}
            </div>

            {/* Push legend to bottom */}
            <div style={{ flex: 1 }} />

            {/* Legend — Figma: item1 left:73, item2 left:209 → ~136px apart */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 24 }}>
                <div style={{ width: 17, height: 17, background: chart.colorA, flexShrink: 0 }} />
                <span style={{ fontFamily: M, fontWeight: 400, fontSize: 10, color: '#000000', letterSpacing: '0.1px' }}>
                  {chart.legendA}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 17, height: 17, background: chart.colorB, flexShrink: 0 }} />
                <span style={{ fontFamily: M, fontWeight: 400, fontSize: 10, color: '#000000', letterSpacing: '0.1px' }}>
                  {chart.legendB}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sensei strip — height:83px, icon 50px at left:19px ─────────────── */}
      <div style={{
        background: '#171B2D', border: '1px solid #1DFB9D', borderRadius: 8,
        height: 83, display: 'flex', alignItems: 'center',
        gap: 0, zIndex: 1, flexShrink: 0, overflow: 'hidden',
      }}>
        {/* Icon 50x50 at left:19 */}
        <div style={{ paddingLeft: 19, paddingRight: 15, flexShrink: 0 }}>
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            background: '#1DFB9D',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0,
          }}>🥷</div>
        </div>
        {/* Text block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
          <span style={{
            fontFamily: M, fontWeight: 700, fontSize: 19, lineHeight: '24px',
            letterSpacing: '0.4px', color: '#1DFB9D',
          }}>
            Sensei Says
          </span>
          <span style={{
            fontFamily: M, fontWeight: 800, fontSize: 16, lineHeight: '20px',
            letterSpacing: '0.2px', color: '#FFFFFF', fontStyle: 'italic',
          }}>
            &ldquo;You have 60 orders waiting. 47 are Royal Mail 24 Hour — shall I dispatch them all now?&rdquo;
          </span>
        </div>
        {/* CTA button */}
        <div style={{ paddingRight: 20, flexShrink: 0 }}>
          <Link href="/orders" style={{
            background: '#1DFB9D', color: '#16122A',
            padding: '0 20px', height: 35, borderRadius: 999,
            display: 'flex', alignItems: 'center',
            fontFamily: M, fontWeight: 600, fontSize: 12, letterSpacing: '0.1px',
            whiteSpace: 'nowrap', textDecoration: 'none',
          }}>
            Yes, dispatch
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Shared style helpers ─────────────────────────────────────────────────────
const kpiCard: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #DFE0EB',
  borderRadius: 8,
  height: 135,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  boxSizing: 'border-box',
  padding: '0 16px',
}

function kpiLabel(color: string): React.CSSProperties {
  return {
    fontFamily: M, fontWeight: 700, fontSize: 19, lineHeight: '24px',
    letterSpacing: '0.4px', color, textAlign: 'center',
  }
}

function kpiNum(color: string): React.CSSProperties {
  return {
    fontFamily: M, fontWeight: 700, fontSize: 40, lineHeight: '50px',
    letterSpacing: '1px', color, textAlign: 'center',
  }
}
