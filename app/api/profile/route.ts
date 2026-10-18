import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const input = z.object({ username: z.string().regex(/^[A-Za-z0-9._]{3,20}$/), firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80) })
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = input.parse(await request.json())
    const normalized = data.username.toLowerCase()
    const taken = await db.select({ id: profile.id }).from(profile).where(eq(profile.usernameNormalized, normalized))
    if (taken.length) return NextResponse.json({ error: 'Username already exists. Please choose another username.' }, { status: 409 })
    await db.insert(profile).values({ id: crypto.randomUUID(), userId: session.user.id, ...data, usernameNormalized: normalized })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 }) }
}
