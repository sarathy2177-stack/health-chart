import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

export const pool = new Pool({
  connectionString,
  ssl:
    connectionString &&
    (connectionString.includes('sslmode=require') ||
      connectionString.includes('neon.tech') ||
      connectionString.includes('supabase.co') ||
      connectionString.includes('render.com') ||
      connectionString.includes('railway.app'))
      ? { rejectUnauthorized: false }
      : undefined,
})

export const db = drizzle(pool, { schema })

