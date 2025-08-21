import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'

config({ path: '.env' })

const sql = neon(process.env.DATABASE_URL!)

// logger enabled for debugging
const db = drizzle(sql)

export { db }
