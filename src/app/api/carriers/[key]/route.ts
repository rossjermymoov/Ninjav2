// GET /api/carriers/:key  — fetch one carrier
// PUT /api/carriers/:key  — update display name, logo URL, active flag

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ key: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { key } = await params
  try {
    const carrier = await db.carrier.findUnique({ where: { key } })
    if (!carrier) {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 })
    }
    return NextResponse.json(carrier)
  } catch (err) {
    console.error(`[GET /api/carriers/${key}]`, err)
    return NextResponse.json({ error: 'Failed to fetch carrier' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { key } = await params
  try {
    const body = await req.json()
    const { displayName, logoUrl, isActive } = body

    const carrier = await db.carrier.update({
      where: { key },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(logoUrl    !== undefined && { logoUrl }),
        ...(isActive   !== undefined && { isActive }),
      },
    })
    return NextResponse.json(carrier)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 })
    }
    console.error(`[PUT /api/carriers/${key}]`, err)
    return NextResponse.json({ error: 'Failed to update carrier' }, { status: 500 })
  }
}
