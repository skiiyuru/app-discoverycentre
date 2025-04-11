import type { Config } from 'drizzle-kit'

import { config } from '@/lib/config'

export default {
  schema: 'src/db/schema.ts',
  out: 'src/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: config.db.TURSO_CONNECTION_URL,
    authToken: config.db.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config
