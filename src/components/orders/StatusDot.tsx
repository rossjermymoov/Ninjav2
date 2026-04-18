import { OrderStatus } from '@/types/order'

const STATUS_CONFIG: Record<OrderStatus, { color: string; label: string }> = {
  ready:      { color: '#1DFB9D', label: 'Ready' },
  processing: { color: '#FECA00', label: 'Processing' },
  issue:      { color: '#CD1C69', label: 'Issue' },
}

export function StatusDot({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{
        width: 10,
        height: 10,
        background: cfg.color,
        boxShadow: `0 0 6px ${cfg.color}80`,
      }}
      title={cfg.label}
    />
  )
}
