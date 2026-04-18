// src/lib/carriers.ts
// Carrier helpers — mirrors channels.ts pattern.
// Fetches from Postgres Carrier table; falls back to hardcoded data when DB is unavailable.

export interface CarrierData {
  key: string
  displayName: string
  logoUrl: string | null
}

// Hardcoded fallbacks — keeps UI working in local dev before DB is seeded.
// Keys match Voila API courier key values.
export const CARRIER_FALLBACKS: Record<string, CarrierData> = {
  'royal-mail':  { key: 'royal-mail',  displayName: 'Royal Mail', logoUrl: null },
  'dpd':         { key: 'dpd',         displayName: 'DPD',        logoUrl: null },
  'evri':        { key: 'evri',        displayName: 'Evri',       logoUrl: null },
  'ups':         { key: 'ups',         displayName: 'UPS',        logoUrl: null },
  'fedex':       { key: 'fedex',       displayName: 'FedEx',      logoUrl: null },
  'dhl':         { key: 'dhl',         displayName: 'DHL',        logoUrl: null },
  'parcelforce': { key: 'parcelforce', displayName: 'Parcelforce',logoUrl: null },
}

// Fetch all active carriers from DB and return a key→data map.
// Returns an empty map on error so callers fall back gracefully.
export async function fetchCarrierMap(): Promise<Record<string, CarrierData>> {
  if (!process.env.DATABASE_URL) return {}

  try {
    const { db } = await import('@/lib/db')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (db as any).carrier.findMany({
      where: { isActive: true },
      select: { key: true, displayName: true, logoUrl: true },
    }) as CarrierData[]
    return Object.fromEntries(rows.map((r) => [r.key, r]))
  } catch (err) {
    console.warn('[carriers] DB fetch failed, using fallbacks:', err)
    return {}
  }
}

// Resolve carrier data for a given key, preferring DB over fallback.
export function resolveCarrier(key: string, dbMap: Record<string, CarrierData>): CarrierData {
  return dbMap[key] ?? CARRIER_FALLBACKS[key] ?? { key, displayName: key, logoUrl: null }
}
