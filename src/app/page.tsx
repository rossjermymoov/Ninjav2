// Server component — fetches channel and carrier data from Postgres at request time.
// Falls back to hardcoded data when DB is not connected.

import { DashboardClient } from '@/components/dashboard/DashboardClient'
import type { DashboardData } from '@/components/dashboard/DashboardClient'
import { fetchChannelMap, CHANNEL_FALLBACKS, CHANNEL_TO_SLUG } from '@/lib/channels'
import { fetchCarrierMap } from '@/lib/carriers'
import type { SalesChannel } from '@/types/order'

// ─── Mock data keyed by date range ───────────────────────────────────────────
// In production these numbers will come from the DB query layer.
// channelCounts.slug must match Channel.slug (Neuro API id, e.g. "tiktokshop").
// courierCounts.key must match Carrier.key (Voila API key, e.g. "Evri").

const DATE_OPTIONS = ['Today', 'Yesterday', 'This Week', 'This Month']

const MOCK_DATA: Record<string, DashboardData> = {
  Today: {
    revenue: 3840,
    ordersOutstanding: 47,
    toDispatch: 9,
    trackedIssues: 3,
    collectionRisk: 2,
    channelCounts: [
      { slug: 'tiktokshop',  channelKey: 'tiktok',      count: 18 },
      { slug: 'shopify',     channelKey: 'shopify',     count: 11 },
      { slug: 'amazonsp',    channelKey: 'amazon',      count: 9  },
      { slug: 'etsy',        channelKey: 'etsy',        count: 5  },
      { slug: 'ebay',        channelKey: 'ebay',        count: 3  },
      { slug: 'manual',      channelKey: 'manual',      count: 1  },
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
    collectionAlerts: [
      { orderNo: '#5501', channelSlug: 'shopify',    service: 'Next Day', cutoff: '14:30', minsLeft: 18 },
      { orderNo: '#5502', channelSlug: 'tiktokshop', service: '24hr',     cutoff: '14:30', minsLeft: 18 },
    ],
    trackingAlerts: [
      { orderNo: '#4873', carrierKey: 'DPD',        tracking: 'DPD15935742013', issue: 'Address not found'   },
      { orderNo: '#4901', carrierKey: 'Royal Mail', tracking: 'RM551234567GB',  issue: 'Delivery attempted'  },
      { orderNo: '#4812', carrierKey: 'Evri',       tracking: 'H00CC11223344',  issue: 'Held at depot'       },
    ],
  },
  Yesterday: {
    revenue: 4120,
    ordersOutstanding: 39,
    toDispatch: 0,
    trackedIssues: 1,
    collectionRisk: 0,
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
    collectionAlerts: [],
    trackingAlerts: [
      { orderNo: '#4812', carrierKey: 'Evri', tracking: 'H00CC11223344', issue: 'Held at depot' },
    ],
  },
  'This Week': {
    revenue: 21300,
    ordersOutstanding: 211,
    toDispatch: 9,
    trackedIssues: 8,
    collectionRisk: 2,
    channelCounts: [
      { slug: 'tiktokshop',  channelKey: 'tiktok',      count: 80 },
      { slug: 'shopify',     channelKey: 'shopify',     count: 55 },
      { slug: 'amazonsp',    channelKey: 'amazon',      count: 38 },
      { slug: 'etsy',        channelKey: 'etsy',        count: 23 },
      { slug: 'ebay',        channelKey: 'ebay',        count: 11 },
      { slug: 'manual',      channelKey: 'manual',      count: 4  },
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
    collectionAlerts: [
      { orderNo: '#5501', channelSlug: 'shopify',    service: 'Next Day', cutoff: '14:30', minsLeft: 18 },
      { orderNo: '#5502', channelSlug: 'tiktokshop', service: '24hr',     cutoff: '14:30', minsLeft: 18 },
    ],
    trackingAlerts: [
      { orderNo: '#4873', carrierKey: 'DPD',        tracking: 'DPD15935742013', issue: 'Address not found'  },
      { orderNo: '#4901', carrierKey: 'Royal Mail', tracking: 'RM551234567GB',  issue: 'Delivery attempted' },
      { orderNo: '#4812', carrierKey: 'Evri',       tracking: 'H00CC11223344',  issue: 'Held at depot'      },
      { orderNo: '#4650', carrierKey: 'DPD',        tracking: 'DPD29384756201', issue: 'Customer refused'   },
      { orderNo: '#4731', carrierKey: 'Royal Mail', tracking: 'RM443322110GB',  issue: 'Return to sender'   },
    ],
  },
  'This Month': {
    revenue: 89450,
    ordersOutstanding: 847,
    toDispatch: 9,
    trackedIssues: 31,
    collectionRisk: 2,
    channelCounts: [
      { slug: 'tiktokshop',  channelKey: 'tiktok',      count: 322 },
      { slug: 'shopify',     channelKey: 'shopify',     count: 203 },
      { slug: 'amazonsp',    channelKey: 'amazon',      count: 152 },
      { slug: 'etsy',        channelKey: 'etsy',        count: 93  },
      { slug: 'ebay',        channelKey: 'ebay',        count: 51  },
      { slug: 'manual',      channelKey: 'manual',      count: 26  },
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
    collectionAlerts: [
      { orderNo: '#5501', channelSlug: 'shopify',    service: 'Next Day', cutoff: '14:30', minsLeft: 18 },
      { orderNo: '#5502', channelSlug: 'tiktokshop', service: '24hr',     cutoff: '14:30', minsLeft: 18 },
    ],
    trackingAlerts: [
      { orderNo: '#4873', carrierKey: 'DPD',        tracking: 'DPD15935742013', issue: 'Address not found'  },
      { orderNo: '#4901', carrierKey: 'Royal Mail', tracking: 'RM551234567GB',  issue: 'Delivery attempted' },
      { orderNo: '#4812', carrierKey: 'Evri',       tracking: 'H00CC11223344',  issue: 'Held at depot'      },
    ],
  },
}

export default async function DashboardPage() {
  // Fetch channel and carrier maps from DB (falls back to empty {} if DB is unavailable)
  const [dbChannelMap, dbCarrierMap] = await Promise.all([
    fetchChannelMap(),
    fetchCarrierMap(),
  ])

  // Build a complete channelMap: start with fallbacks for all known channels,
  // then overlay any DB rows that exist
  const channelMap = Object.fromEntries(
    (Object.keys(CHANNEL_FALLBACKS) as SalesChannel[]).map((ch) => {
      const slug = CHANNEL_TO_SLUG[ch]
      return [slug, dbChannelMap[slug] ?? CHANNEL_FALLBACKS[ch]]
    })
  )

  // Build carrierMap: DB rows take priority, fallback for anything not yet seeded
  const allCarrierKeys = Array.from(
    new Set(DATE_OPTIONS.flatMap(r => MOCK_DATA[r].courierCounts.map(c => c.key)))
  )
  const carrierMap = Object.fromEntries(
    allCarrierKeys.map(key => [key, dbCarrierMap[key] ?? { key, displayName: key, logoUrl: null }])
  )

  return (
    <DashboardClient
      channelMap={channelMap}
      carrierMap={carrierMap}
      data={MOCK_DATA}
      dateOptions={DATE_OPTIONS}
    />
  )
}
