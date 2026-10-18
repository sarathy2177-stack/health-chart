'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const schema = z.object({ username: z.string().regex(/^[A-Za-z0-9._]{3,20}$/), firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80), age: z.number().int().min(1).max(120).nullable(), gender: z.string().nullable(), height: z.number().positive().max(300).nullable(), heightUnit: z.enum(['cm', 'ft']).nullable(), weight: z.number().positive().max(700).nullable(), weightUnit: z.enum(['kg', 'lbs']).nullable() })

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function saveProfile(input: z.infer<typeof schema>) {
  const userId = await getUserId()
  const data = schema.parse(input)
  const usernameNormalized = data.username.toLowerCase()
  const existing = await db.select({ userId: profile.userId }).from(profile).where(eq(profile.usernameNormalized, usernameNormalized))
  if (existing[0] && existing[0].userId !== userId) throw new Error('Username already exists. Please choose another username.')
  await db.update(profile).set({ ...data, usernameNormalized, updatedAt: new Date() }).where(eq(profile.userId, userId))
  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { ok: true }
}
