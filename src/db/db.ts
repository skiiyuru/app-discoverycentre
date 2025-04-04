import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import { env } from '@/lib/env'

import * as schema from './schema'

const client = createClient({
  url: env.db.TURSO_CONNECTION_URL,
  authToken: env.db.TURSO_AUTH_TOKEN!,
})

export const db = drizzle(client, { schema })
