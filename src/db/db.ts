import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import { config } from '@/lib/config'

import * as schema from './schema'

const client = createClient({
  url: config.db.TURSO_CONNECTION_URL,
  authToken: config.db.TURSO_AUTH_TOKEN!,
})

export const db = drizzle(client, { schema })
