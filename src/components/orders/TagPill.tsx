import { OrderTag } from '@/types/order'

const COLOUR_MAP: Record<OrderTag['colour'], string> = {
  green:  '#1DFB9D',
  purple: '#6F4B9F',
  amber:  '#FECA00',
  teal:   '#276E93',
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
