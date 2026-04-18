// prisma/seed.ts
// Seeds the Channel table from the Neuro API.
// Safe to re-run — uses upsert so existing rows are updated, not duplicated.
//
// Required env var: NEURO_BEARER_TOKEN
// Optional env var: DATABASE_URL (read automatically by Prisma)

import { PrismaClient } from '@prisma/client'

const NEURO_API_URL = 'https://app.heyneuro.io/api/v1/channels/available'

interface NeuroChannel {
  id: string
  name: string
  channel_group: string | null
  type: string | null
  logo: string
}

async function fetchNeuroChannels(): Promise<NeuroChannel[]> {
  const token = process.env.NEURO_BEARER_TOKEN
  if (!token) {
    throw new Error(
      'NEURO_BEARER_TOKEN env var is not set. Add it in Railway → Variables.',
    )
  }

  const res = await fetch(NEURO_API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    throw new Error(`Neuro API returned ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as { data: NeuroChannel[] }
  return json.data
}

async function main() {
  const db = new PrismaClient()

  console.log('Fetching channels from Neuro API…')
  const channels = await fetchNeuroChannels()
  console.log(`  → ${channels.length} channels received`)

  let created = 0
  let updated = 0

  for (const ch of channels) {
    const existing = await db.channel.findUnique({ where: { slug: ch.id } })

    await db.channel.upsert({
      where: { slug: ch.id },
      update: {
        displayName: ch.name,
        logoUrl: ch.logo,
        isActive: true,
      },
      create: {
        slug: ch.id,
        displayName: ch.name,
        logoUrl: ch.logo,
        isActive: true,
      },
    })

    if (existing) {
      updated++
    } else {
      created++
      console.log(`  + ${ch.name} (${ch.id})`)
    }
  }

  console.log(`\nDone — ${created} created, ${updated} updated.`)
  await db.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
