// src/lib/channels.ts
// Channel helpers used across the app.
// Fetching is done server-side; this module also provides hardcoded
// fallbacks so pages never crash when the DB is not yet connected.
//
// slugs match the Neuro API channel ids (e.g. "amazonsp", "ebay", "tiktokshop").

import type { SalesChannel } from '@/types/order'

// What we expose to UI components
export interface ChannelData {
  slug: string
  displayName: string
  colour: string
  logoUrl: string | null
}

// Maps the SalesChannel enum values to Neuro API channel ids (used as DB slugs).
export const CHANNEL_TO_SLUG: Record<SalesChannel, string> = {
  amazon:      'amazonsp',
  ebay:        'ebay',
  shopify:     'shopify',
  etsy:        'etsy',
  woocommerce: 'woocommerce',
  tiktok:      'tiktokshop',
  manual:      'manual',
}

// Hardcoded fallback — used when DATABASE_URL is not set or DB is unreachable.
// Keeps the UI working in local dev before Postgres is wired up.
const NEURO_CDN = 'https://app.heyneuro.io/images/channel_logos'

export const CHANNEL_FALLBACKS: Record<SalesChannel, ChannelData> = {
  amazon:      { slug: 'amazonsp',    displayName: 'Amazon',       colour: '#FF9900', logoUrl: `${NEURO_CDN}/amazonsp-logo.png` },
  ebay:        { slug: 'ebay',        displayName: 'eBay',         colour: '#E53238', logoUrl: `${NEURO_CDN}/ebay-logo.png` },
  shopify:     { slug: 'shopify',     displayName: 'Shopify',      colour: '#96BF48', logoUrl: `${NEURO_CDN}/shopify-logo.png` },
  etsy:        { slug: 'etsy',        displayName: 'Etsy',         colour: '#F1641E', logoUrl: `${NEURO_CDN}/etsy-logo.png` },
  woocommerce: { slug: 'woocommerce', displayName: 'WooCommerce',  colour: '#7F54B3', logoUrl: `${NEURO_CDN}/woocommerce-logo.png` },
  tiktok:      { slug: 'tiktokshop',  displayName: 'TikTok Shop',  colour: '#010101', logoUrl: `${NEURO_CDN}/tiktokshop-logo.png` },
  manual:      { slug: 'manual',      displayName: 'Manual',       colour: '#1DFB9D', logoUrl: null },
}

// Fetch all active channels from the DB and return a slug→data map.
// Returns an empty map on error so callers can fall back gracefully.
export async function fetchChannelMap(): Promise<Record<string, ChannelData>> {
  if (!process.env.DATABASE_URL) return {}

  try {
    const { db } = await import('@/lib/db')
    const rows = await db.channel.findMany({
      where: { isActive: true },
      select: { slug: true, displayName: true, colour: true, logoUrl: true },
    })
    return Object.fromEntries(rows.map((r) => [r.slug, r]))
  } catch (err) {
    console.warn('[channels] DB fetch failed, using fallbacks:', err)
    return {}
  }
}

// Resolve channel data for a given SalesChannel, preferring DB over fallback.
export function resolveChannel(
  channel: SalesChannel,
  dbMap: Record<string, ChannelData>,
): ChannelData {
  const slug = CHANNEL_TO_SLUG[channel]
  return dbMap[slug] ?? CHANNEL_FALLBACKS[channel]
}
