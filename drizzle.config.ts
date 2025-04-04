import type { Config } from 'drizzle-kit'

import { env } from '@/lib/env'

export default {
  schema: 'src/db/schema.ts',
  out: 'src/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: env.db.TURSO_CONNECTION_URL,
    authToken: env.db.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config
