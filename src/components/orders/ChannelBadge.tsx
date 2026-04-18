import { SalesChannel } from '@/types/order'

const CHANNEL_CONFIG: Record<SalesChannel, { label: string; color: string; bg: string }> = {
  tiktok:       { label: 'TikTok',       color: '#FFFFFF', bg: '#111' },
  shopify:      { label: 'Shopify',      color: '#96BF48', bg: 'transparent' },
  amazon:       { label: 'Amazon',       color: '#FF9900', bg: 'transparent' },
  etsy:         { label: 'Etsy',         color: '#F1641E', bg: 'transparent' },
  woocommerce:  { label: 'WooCommerce',  color: '#9B5C8F', bg: 'transparent' },
  ebay:         { label: 'eBay',         color: '#E53238', bg: 'transparent' },
  manual:       { label: 'Manual',       color: '#9AA0BC', bg: 'transparent' },
}

export function ChannelBadge({ channel, storeName }: { channel: SalesChannel; storeName: string }) {
  const cfg = CHANNEL_CONFIG[channel]
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold" style={{ color: cfg.color }}>
        {storeName}
      </span>
    </div>
  )
}
