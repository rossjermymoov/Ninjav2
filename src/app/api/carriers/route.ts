// GET  /api/carriers  — list all active carriers

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const carriers = await db.carrier.findMany({
      where: { isActive: true },
      orderBy: { displayName: 'asc' },
      select: {
        id: true,
        key: true,
        displayName: true,
        logoUrl: true,
        isActive: true,
      },
    })
    return NextResponse.json(carriers)
  } catch (err) {
    console.error('[GET /api/carriers]', err)
    return NextResponse.json({ error: 'Failed to fetch carriers' }, { status: 500 })
  }
}
