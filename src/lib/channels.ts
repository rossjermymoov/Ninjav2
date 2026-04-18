// src/lib/channels.ts
// Channel helpers used across the app.
// Fetching is done server-side; this module also provides the hardcoded
// fallback so pages never crash when the DB is not yet connected.

import type { SalesChannel } from '@/types/order'

// What we expose to UI components
export interface ChannelData {
  slug: string
  displayName: string
  colour: string
  logoSvg: string | null
}

// Maps the legacy SalesChannel enum values to DB slugs.
// Add new channels here as they come online.
export const CHANNEL_TO_SLUG: Record<SalesChannel, string> = {
  amazon:      'amazon-uk',
  ebay:        'ebay-uk',
  shopify:     'shopify',
  etsy:        'etsy',
  woocommerce: 'woocommerce',
  tiktok:      'tiktok-shop',
  manual:      'direct',
}

// Hardcoded fallback — used when DATABASE_URL is not set or DB is unreachable.
// Keeps the UI working in local dev before Postgres is wired up.
export const CHANNEL_FALLBACKS: Record<SalesChannel, ChannelData> = {
  amazon:      { slug: 'amazon-uk',   displayName: 'Amazon UK',    colour: '#FF9900', logoSvg: null },
  ebay:        { slug: 'ebay-uk',     displayName: 'eBay UK',      colour: '#E53238', logoSvg: null },
  shopify:     { slug: 'shopify',     displayName: 'Shopify',      colour: '#96BF48', logoSvg: null },
  etsy:        { slug: 'etsy',        displayName: 'Etsy',         colour: '#F1641E', logoSvg: null },
  woocommerce: { slug: 'woocommerce', displayName: 'WooCommerce',  colour: '#7F54B3', logoSvg: null },
  tiktok:      { slug: 'tiktok-shop', displayName: 'TikTok Shop',  colour: '#010101', logoSvg: null },
  manual:      { slug: 'direct',      displayName: 'Direct',       colour: '#1DFB9D', logoSvg: null },
}

// Fetch all channels from the DB and return a slug→data map.
// Returns an empty map on error so callers can fall back gracefully.
export async function fetchChannelMap(): Promise<Record<string, ChannelData>> {
  if (!process.env.DATABASE_URL) return {}

  try {
    const { db } = await import('@/lib/db')
    const rows = await db.channel.findMany({
      where: { isActive: true },
      select: { slug: true, displayName: true, colour: true, logoSvg: true },
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
