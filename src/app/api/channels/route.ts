// GET  /api/channels       — list all active channels
// POST /api/channels       — create a new channel

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const channels = await db.channel.findMany({
      where: { isActive: true },
      orderBy: { displayName: 'asc' },
      select: {
        id: true,
        slug: true,
        displayName: true,
        colour: true,
        logoSvg: true,
        isActive: true,
      },
    })
    return NextResponse.json(channels)
  } catch (err) {
    console.error('[GET /api/channels]', err)
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, displayName, colour } = body

    if (!slug || !displayName) {
      return NextResponse.json({ error: 'slug and displayName are required' }, { status: 400 })
    }

    const channel = await db.channel.create({
      data: {
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        displayName,
        colour: colour ?? '#6B7280',
        isActive: true,
      },
    })
    return NextResponse.json(channel, { status: 201 })
  } catch (err: unknown) {
    // Unique constraint violation — slug already exists
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'A channel with that slug already exists' }, { status: 409 })
    }
    console.error('[POST /api/channels]', err)
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 })
  }
}
