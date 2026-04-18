// src/lib/carriers.ts
// Carrier helpers — mirrors channels.ts pattern.
// Fetches from Postgres Carrier table; falls back to hardcoded data when DB is unavailable.

export interface CarrierData {
  key: string
  displayName: string
  logoUrl: string | null
}

// Hardcoded fallbacks — keeps UI working in local dev before DB is seeded.
// Each carrier is keyed by BOTH its slug ('royal-mail') AND its lowercase
// display name ('royal mail') so resolveCarrier() works whether the mock
// data uses slugs or display names as the lookup key.
export const CARRIER_FALLBACKS: Record<string, CarrierData> = {
  'royal-mail':  { key: 'royal-mail',  displayName: 'Royal Mail', logoUrl: '/carriers/royal-mail.svg' },
  'royal mail':  { key: 'royal-mail',  displayName: 'Royal Mail', logoUrl: '/carriers/royal-mail.svg' },
  'dpd':         { key: 'dpd',         displayName: 'DPD',        logoUrl: '/carriers/dpd.svg' },
  'evri':        { key: 'evri',        displayName: 'Evri',       logoUrl: '/carriers/evri.svg' },
  'ups':         { key: 'ups',         displayName: 'UPS',        logoUrl: '/carriers/ups.svg' },
  'fedex':       { key: 'fedex',       displayName: 'FedEx',      logoUrl: null },
  'dhl':         { key: 'dhl',         displayName: 'DHL',        logoUrl: null },
  'parcelforce': { key: 'parcelforce', displayName: 'Parcelforce',logoUrl: null },
}

// Fetch ALL active carriers from DB — returns a key→data map AND a
// lowercase-displayName→data map so callers can do name-based fallback lookup.
export async function fetchCarrierMap(): Promise<{
  byKey:  Record<string, CarrierData>
  byName: Record<string, CarrierData>  // keyed by displayName.toLowerCase()
}> {
  if (!process.env.DATABASE_URL) return { byKey: {}, byName: {} }

  try {
    const { db } = await import('@/lib/db')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (db as any).carrier.findMany({
      where: { isActive: true },
      select: { key: true, displayName: true, logoUrl: true },
    }) as CarrierData[]
    return {
      byKey:  Object.fromEntries(rows.map(r => [r.key, r])),
      byName: Object.fromEntries(rows.map(r => [r.displayName.toLowerCase(), r])),
    }
  } catch (err) {
    console.warn('[carriers] DB fetch failed, using fallbacks:', err)
    return { byKey: {}, byName: {} }
  }
}

// Resolve a carrier by key first, then by display name (case-insensitive),
// then fall back to hardcoded fallback, then bare shell.
export function resolveCarrier(
  key: string,
  byKey: Record<string, CarrierData>,
  byName: Record<string, CarrierData>,
): CarrierData {
  return (
    byKey[key] ??
    byName[key.toLowerCase()] ??
    CARRIER_FALLBACKS[key.toLowerCase()] ??
    { key, displayName: key, logoUrl: null }
  )
}
