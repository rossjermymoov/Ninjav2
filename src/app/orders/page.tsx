// Server component — fetches channel data from Postgres at request time.
// Falls back to hardcoded colours when DB is not yet connected.

import { OrdersTable } from '@/components/orders/OrdersTable'
import { MOCK_ORDERS, MOCK_TOTAL_ORDERS } from '@/lib/mock/orders'
import { fetchChannelMap, resolveChannel, CHANNEL_FALLBACKS } from '@/lib/channels'
import type { SalesChannel } from '@/types/order'

export default async function OrdersPage() {
  // Fetch DB channel data; gracefully returns {} if DB isn't wired up yet
  const dbMap = await fetchChannelMap()

  // Build a per-order channel data map used by the table
  const channelMap = Object.fromEntries(
    (Object.keys(CHANNEL_FALLBACKS) as SalesChannel[]).map((ch) => [
      ch,
      resolveChannel(ch, dbMap),
    ])
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <OrdersTable orders={MOCK_ORDERS} total={MOCK_TOTAL_ORDERS} channelMap={channelMap} />
    </div>
  )
}
