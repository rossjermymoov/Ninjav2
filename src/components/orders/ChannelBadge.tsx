// ChannelBadge — renders a channel logo (PNG from Neuro CDN) or
// a colour-coded text pill as a fallback.

import type { ChannelData } from '@/lib/channels'

interface Props {
  storeName: string
  channel: ChannelData
}

export function ChannelBadge({ storeName, channel }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      {channel.logoUrl ? (
        // Logo loaded from DB — PNG from Neuro CDN
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={channel.logoUrl}
          alt={channel.displayName}
          style={{ height: 20, width: 'auto', maxWidth: 72, objectFit: 'contain' }}
        />
      ) : (
        // Fallback: channel name in brand colour
        <span
          className="text-xs font-bold tracking-wide"
          style={{ color: channel.colour }}
        >
          {channel.displayName}
        </span>
      )}
      <span className="text-xs" style={{ color: '#9FA2B4' }}>
        {storeName}
      </span>
    </div>
  )
}
