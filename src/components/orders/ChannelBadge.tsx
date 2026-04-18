// ChannelBadge — renders a channel logo (if loaded from DB) or
// a colour-coded text pill as a fallback.

import type { ChannelData } from '@/lib/channels'

interface Props {
  storeName: string
  channel: ChannelData
}

export function ChannelBadge({ storeName, channel }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      {channel.logoSvg ? (
        // Logo loaded from DB — render inline SVG capped at 20px tall
        <span
          className="inline-block"
          style={{ height: 20, width: 'auto', maxWidth: 72 }}
          // dangerouslySetInnerHTML is safe here: SVG content comes from our
          // own DB, not user-submitted HTML.
          dangerouslySetInnerHTML={{ __html: channel.logoSvg }}
          aria-label={channel.displayName}
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
