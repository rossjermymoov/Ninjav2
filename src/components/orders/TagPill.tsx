import { OrderTag } from '@/types/order'

const COLOUR_MAP: Record<OrderTag['colour'], string> = {
  green:  '#00C853',
  purple: '#7B2FBE',
  amber:  '#FFC107',
  teal:   '#00BCD4',
}

export function TagPill({ tag }: { tag: OrderTag }) {
  const bg = COLOUR_MAP[tag.colour]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-white font-semibold"
      style={{ fontSize: '10px', background: bg, lineHeight: 1.4 }}
    >
      {tag.label}
    </span>
  )
}
