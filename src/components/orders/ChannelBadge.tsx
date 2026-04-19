// ChannelBadge — renders a channel logo (PNG from Neuro CDN) or
// a colour-coded text pill as a fallback.

import type { ChannelData } from '@/lib/channels'

interface Props {
  storeName: string
  channel: ChannelData
}

export function ChannelBadge({ storeName, channel }: Props) {
  return (
    <div className="flex flex-col gap-0.5 items-center">
      {channel.logoUrl ? (
        // Logo loaded from DB — PNG from Neuro CDN
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={channel.logoUrl}
          alt={channel.displayName}
          style={{ height: 20, width: 'auto', maxWidth: 72, objectFit: 'contain' }}
        />
      ) : (
        // Fallback: channel display name as secondary (purple)
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: '#6F4B9F' }}
        >
          {channel.displayName}
        </span>
      )}
      {/* Store name — primary */}
      <span
        className="text-xs font-semibold"
        style={{ color: '#171B2D', fontSize: 13 }}
      >
        {storeName}
      </span>
    </div>
  )
}
