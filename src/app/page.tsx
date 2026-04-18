// Server component — fetches channel and carrier data from Postgres at request time.
// Falls back to hardcoded data when DB is not connected.

import { DashboardClient } from '@/components/dashboard/DashboardClient'
import type { RangeData, LiveData } from '@/components/dashboard/DashboardClient'
import { fetchChannelMap, CHANNEL_FALLBACKS, CHANNEL_TO_SLUG } from '@/lib/channels'
import { fetchCarrierMap, resolveCarrier } from '@/lib/carriers'
import type { SalesChannel } from '@/types/order'

const DATE_OPTIONS = ['Today', 'Yesterday', 'This Week', 'This Month']

// ─── Date-range-dependent data ────────────────────────────────────────────────
// Revenue and Dispatched totals change per period.
// Channel/country/service/courier breakdowns reflect the same period.

const RANGE_DATA: Record<string, RangeData> = {
  Today: {
    revenue: 3840,
    ordersDispatched: 38,
    channelCounts: [
      { slug: 'tiktokshop', channelKey: 'tiktok',  count: 18 },
      { slug: 'shopify',    channelKey: 'shopify', count: 11 },
      { slug: 'amazonsp',   channelKey: 'amazon',  count: 9  },
      { slug: 'etsy',       channelKey: 'etsy',    count: 5  },
      { slug: 'ebay',       channelKey: 'ebay',    count: 3  },
      { slug: 'manual',     channelKey: 'manual',  count: 1  },
    ],
    countries: [
      { flag: '🇬🇧', name: 'United Kingdom', count: 38 },
      { flag: '🇩🇪', name: 'Germany',        count: 4  },
      { flag: '🇫🇷', name: 'France',         count: 3  },
      { flag: '🇺🇸', name: 'United States',  count: 2  },
    ],
    services: [
      { name: '24hr Tracked', count: 22 },
      { name: 'Next Day',     count: 14 },
      { name: '48hr',         count: 8  },
      { name: 'Saturday',     count: 3  },
    ],
    courierCounts: [
      { key: 'Royal Mail', count: 21 },
      { key: 'DPD',        count: 15 },
      { key: 'Evri',       count: 9  },
      { key: 'UPS',        count: 2  },
    ],
  },
  Yesterday: {
    revenue: 4120,
    ordersDispatched: 39,
    channelCounts: [
      { slug: 'tiktokshop', channelKey: 'tiktok',  count: 15 },
      { slug: 'shopify',    channelKey: 'shopify', count: 10 },
      { slug: 'amazonsp',   channelKey: 'amazon',  count: 8  },
      { slug: 'etsy',       channelKey: 'etsy',    count: 4  },
      { slug: 'ebay',       channelKey: 'ebay',    count: 2  },
    ],
    countries: [
      { flag: '🇬🇧', name: 'United Kingdom', count: 32 },
      { flag: '🇩🇪', name: 'Germany',        count: 4  },
      { flag: '🇫🇷', name: 'France',         count: 2  },
      { flag: '🇺🇸', name: 'United States',  count: 1  },
    ],
    services: [
      { name: '24hr Tracked', count: 19 },
      { name: 'Next Day',     count: 12 },
      { name: '48hr',         count: 6  },
      { name: 'Saturday',     count: 2  },
    ],
    courierCounts: [
      { key: 'Royal Mail', count: 20 },
      { key: 'DPD',        count: 12 },
      { key: 'Evri',       count: 7  },
    ],
  },
  'This Week': {
    revenue: 21300,
    ordersDispatched: 202,
    channelCounts: [
      { slug: 'tiktokshop', channelKey: 'tiktok',  count: 80 },
      { slug: 'shopify',    channelKey: 'shopify', count: 55 },
      { slug: 'amazonsp',   channelKey: 'amazon',  count: 38 },
      { slug: 'etsy',       channelKey: 'etsy',    count: 23 },
      { slug: 'ebay',       channelKey: 'ebay',    count: 11 },
      { slug: 'manual',     channelKey: 'manual',  count: 4  },
    ],
    countries: [
      { flag: '🇬🇧', name: 'United Kingdom', count: 172 },
      { flag: '🇩🇪', name: 'Germany',        count: 18  },
      { flag: '🇫🇷', name: 'France',         count: 12  },
      { flag: '🇺🇸', name: 'United States',  count: 9   },
    ],
    services: [
      { name: '24hr Tracked', count: 99 },
      { name: 'Next Day',     count: 66 },
      { name: '48hr',         count: 32 },
      { name: 'Saturday',     count: 14 },
    ],
    courierCounts: [
      { key: 'Royal Mail', count: 98 },
      { key: 'DPD',        count: 71 },
      { key: 'Evri',       count: 34 },
      { key: 'UPS',        count: 8  },
    ],
  },
  'This Month': {
    revenue: 89450,
    ordersDispatched: 838,
    channelCounts: [
      { slug: 'tiktokshop', channelKey: 'tiktok',  count: 322 },
      { slug: 'shopify',    channelKey: 'shopify', count: 203 },
      { slug: 'amazonsp',   channelKey: 'amazon',  count: 152 },
      { slug: 'etsy',       channelKey: 'etsy',    count: 93  },
      { slug: 'ebay',       channelKey: 'ebay',    count: 51  },
      { slug: 'manual',     channelKey: 'manual',  count: 26  },
    ],
    countries: [
      { flag: '🇬🇧', name: 'United Kingdom', count: 688 },
      { flag: '🇩🇪', name: 'Germany',        count: 72  },
      { flag: '🇫🇷', name: 'France',         count: 49  },
      { flag: '🇺🇸', name: 'United States',  count: 38  },
    ],
    services: [
      { name: '24hr Tracked', count: 399 },
      { name: 'Next Day',     count: 264 },
      { name: '48hr',         count: 128 },
      { name: 'Saturday',     count: 56  },
    ],
    courierCounts: [
      { key: 'Royal Mail', count: 391 },
      { key: 'DPD',        count: 284 },
      { key: 'Evri',       count: 138 },
      { key: 'UPS',        count: 34  },
    ],
  },
}

// ─── Live "right now" data ────────────────────────────────────────────────────
// These values do NOT change with the date selector.
// In production they will come from a real-time query.

const LIVE_DATA: LiveData = {
  ordersWaiting:  9,
  trackingIssues: 3,
  serviceAlerts:  2,
  nearCutoff:     2,
  collectionAlerts: [
    { orderNo: '#5501', channelSlug: 'shopify',    service: 'Next Day', cutoff: '14:30', minsLeft: 18 },
    { orderNo: '#5502', channelSlug: 'tiktokshop', service: '24hr',     cutoff: '14:30', minsLeft: 18 },
  ],
  trackingAlerts: [
    { orderNo: '#4873', carrierKey: 'DPD',        tracking: 'DPD15935742013', issue: 'Address not found'  },
    { orderNo: '#4901', carrierKey: 'Royal Mail', tracking: 'RM551234567GB',  issue: 'Delivery attempted' },
    { orderNo: '#4812', carrierKey: 'Evri',       tracking: 'H00CC11223344',  issue: 'Held at depot'      },
  ],
  serviceAlertList: [
    { message: 'Royal Mail API rate limit at 85% — monitor closely', severity: 'warn' },
    { message: 'DPD label generation queue delayed by ~4 mins',      severity: 'info' },
  ],
}

export default async function DashboardPage() {
  const [dbChannelMap, { byKey: carrierByKey, byName: carrierByName }] = await Promise.all([
    fetchChannelMap(),
    fetchCarrierMap(),
  ])

  // ── Debug: log what the DB actually returned so we can align mock keys ──
  console.log('[dashboard] carriers from DB — keys:', Object.keys(carrierByKey))
  console.log('[dashboard] carriers from DB — byName keys:', Object.keys(carrierByName))
  Object.entries(carrierByKey).forEach(([k, v]) =>
    console.log(`  carrier  key="${k}"  displayName="${v.displayName}"  logoUrl="${v.logoUrl}"`)
  )

  // Channel map: fallbacks overlaid with DB data
  const channelMap = Object.fromEntries(
    (Object.keys(CHANNEL_FALLBACKS) as SalesChannel[]).map((ch) => {
      const slug = CHANNEL_TO_SLUG[ch]
      return [slug, dbChannelMap[slug] ?? CHANNEL_FALLBACKS[ch]]
    })
  )

  // Carrier map: key → resolved CarrierData (DB logo URL, key-then-name lookup)
  // Keys include all mock courierCount keys plus all actual DB keys so the full
  // set is available to the client for alert rows.
  const allMockKeys = Array.from(
    new Set(DATE_OPTIONS.flatMap(r => RANGE_DATA[r].courierCounts.map(c => c.key)))
  )
  const allAlertKeys = [
    ...LIVE_DATA.trackingAlerts.map(a => a.carrierKey),
  ]
  const allKeys = Array.from(new Set([...allMockKeys, ...allAlertKeys, ...Object.keys(carrierByKey)]))
  const carrierMap = Object.fromEntries(
    allKeys.map(key => [key, resolveCarrier(key, carrierByKey, carrierByName)])
  )

  return (
    <DashboardClient
      channelMap={channelMap}
      carrierMap={carrierMap}
      rangeData={RANGE_DATA}
      liveData={LIVE_DATA}
      dateOptions={DATE_OPTIONS}
    />
  )
}
