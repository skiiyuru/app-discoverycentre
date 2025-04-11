import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from '@/db/schema'
import { config } from '@/lib/config'

const sql = neon(config.db.URL)

export const db = drizzle({ client: sql, casing: 'snake_case', schema })
