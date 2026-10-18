import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import Link from 'next/link'
import { ProfileForm } from '@/components/profile-form'
export default async function ProfilePage() { const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) redirect('/login'); const rows = await db.select().from(profile).where(eq(profile.userId, session.user.id)); const data = rows[0]; if (!data) redirect('/signup'); return <main className="app-shell"><header className="topbar"><Link className="brand-mark small" href="/dashboard">BEN<span>.</span></Link><nav><Link href="/dashboard">Dashboard</Link><form action="/api/logout" method="post"><button className="text-button">Log out</button></form></nav></header><div className="profile-heading"><div className="avatar">{data.firstName[0]}{data.lastName[0]}</div><div><p className="eyebrow">YOUR PROFILE</p><h1>{data.firstName} {data.lastName}</h1><p className="subtitle">@{data.username}</p></div></div><ProfileForm data={{ ...data, email: session.user.email }} /></main> }
