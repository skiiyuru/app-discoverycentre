import { drizzle } from 'drizzle-orm/neon-serverless'
import ws from 'ws'

import * as schema from '@/db/schema'
import { config } from '@/lib/config'

export const db = drizzle({ connection: config.db.URL, ws, casing: 'snake_case', schema })
