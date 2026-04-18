import Link from 'next/link'

const KPI_CARDS = [
  { label: 'Orders Waiting',    value: '60',   color: '#FFFFFF' },
  { label: 'Orders Dispatched', value: '16',   color: '#7B2FBE' },
  { label: 'Service Alerts',    value: '2',    color: '#E91E8C' },
  { label: 'Tracking Alerts',   value: '0',    color: '#00C853' },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-5 flex flex-col gap-2"
            style={{ background: '#14162A', border: '1px solid #2A2D4A' }}
          >
            <span style={{ fontSize: '13px', color: '#9AA0BC' }}>{card.label}</span>
            <span className="text-4xl font-bold" style={{ color: card.color }}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Sensai strip */}
      <div
        className="rounded-xl px-5 py-4 flex items-center gap-4"
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
        <button
          className="ml-auto px-4 h-8 rounded-full font-semibold shrink-0"
          style={{ background: '#00C853', color: '#000', fontSize: '12px' }}
        >
          Yes, dispatch
        </button>
      </div>

      {/* Quick nav */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { href: '/orders', label: 'View Orders →' },
          { href: '/shipments', label: 'View Shipments →' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-4 h-9 rounded-full flex items-center font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ border: '1px solid #00C853', color: '#00C853', fontSize: '13px' }}
          >
            {label}
          </Link>
        ))}
      </div>

      <p style={{ color: '#5A5F7A', fontSize: '12px' }}>
        Dashboard charts coming next sprint — Orders and Shipments tables are ready.
      </p>
    </div>
  )
}
