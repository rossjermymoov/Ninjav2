// GET  /api/channels/:slug  — fetch one channel
// PUT  /api/channels/:slug  — update display name, colour, logoUrl, active flag

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  try {
    const channel = await db.channel.findUnique({ where: { slug } })
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }
    return NextResponse.json(channel)
  } catch (err) {
    console.error(`[GET /api/channels/${slug}]`, err)
    return NextResponse.json({ error: 'Failed to fetch channel' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug } = await params
  try {
    const body = await req.json()
    const { displayName, colour, logoUrl, isActive } = body

    const channel = await db.channel.update({
      where: { slug },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(colour !== undefined && { colour }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    })
    return NextResponse.json(channel)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }
    console.error(`[PUT /api/channels/${slug}]`, err)
    return NextResponse.json({ error: 'Failed to update channel' }, { status: 500 })
  }
}
