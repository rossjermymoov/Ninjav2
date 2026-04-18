// prisma/seed.ts
// Seeds the Channel table from the Neuro API and the Carrier table from the Voila API.
// Safe to re-run — uses upsert so existing rows are updated, not duplicated.
//
// Required env vars:
//   NEURO_BEARER_TOKEN  — Neuro bearer token
//   VOILA_API_USER      — Voila API username, e.g. "Create API"
//   VOILA_API_TOKEN     — Voila API token

import { PrismaClient } from '@prisma/client'

const NEURO_API_URL  = 'https://app.heyneuro.io/api/v1/channels/available'
const VOILA_API_URL  = 'https://app.heyvoila.io/api/couriers/v1/list-couriers'

interface NeuroChannel {
  id: string
  name: string
  channel_group: string | null
  type: string | null
  logo: string
}

interface VoilaCourier {
  key: string
  name: string
  logo: string
  thumbnail: string
  status: string
}

async function fetchNeuroChannels(): Promise<NeuroChannel[]> {
  const token = process.env.NEURO_BEARER_TOKEN
  if (!token) throw new Error('NEURO_BEARER_TOKEN env var is not set. Add it in Railway → Variables.')

  const res = await fetch(NEURO_API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Neuro API returned ${res.status} ${res.statusText}`)

  const json = (await res.json()) as { data: NeuroChannel[] }
  return json.data
}

async function fetchVoilaCarriers(): Promise<VoilaCourier[]> {
  const user  = process.env.VOILA_API_USER
  const token = process.env.VOILA_API_TOKEN
  if (!user || !token) throw new Error('VOILA_API_USER and VOILA_API_TOKEN env vars are not set. Add them in Railway → Variables.')

  const res = await fetch(VOILA_API_URL, {
    headers: { 'api-user': user, 'api-token': token, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Voila API returned ${res.status} ${res.statusText}`)

  const json = (await res.json()) as { couriers: VoilaCourier[] }
  return json.couriers
}

async function main() {
  const db = new PrismaClient()

  // ── Seed channels ─────────────────────────────────────────────────────────
  console.log('Fetching channels from Neuro API…')
  const channels = await fetchNeuroChannels()
  console.log(`  → ${channels.length} channels received`)

  let chCreated = 0, chUpdated = 0
  for (const ch of channels) {
    const existing = await db.channel.findUnique({ where: { slug: ch.id } })
    await db.channel.upsert({
      where:  { slug: ch.id },
      update: { displayName: ch.name, logoUrl: ch.logo, isActive: true },
      create: { slug: ch.id, displayName: ch.name, logoUrl: ch.logo, isActive: true },
    })
    if (existing) { chUpdated++ } else { chCreated++; console.log(`  + ${ch.name} (${ch.id})`) }
  }
  console.log(`Channels done — ${chCreated} created, ${chUpdated} updated.\n`)

  // ── Seed carriers ─────────────────────────────────────────────────────────
  console.log('Fetching carriers from Voila API…')
  const carriers = await fetchVoilaCarriers()
  console.log(`  → ${carriers.length} carriers received`)

  let caCreated = 0, caUpdated = 0
  for (const ca of carriers) {
    const existing = await db.carrier.findUnique({ where: { key: ca.key } })
    await db.carrier.upsert({
      where:  { key: ca.key },
      update: { displayName: ca.name, logoUrl: ca.logo, isActive: true },
      create: { key: ca.key, displayName: ca.name, logoUrl: ca.logo, isActive: true },
    })
    if (existing) { caUpdated++ } else { caCreated++; console.log(`  + ${ca.name} (${ca.key})`) }
  }
  console.log(`Carriers done — ${caCreated} created, ${caUpdated} updated.\n`)

  await db.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
