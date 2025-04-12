import type { Config } from 'drizzle-kit'

import { config } from '@/lib/config'

export default {
  schema: 'src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.db.URL,
  },
  verbose: true,
  strict: true,
  casing: 'snake_case',
} satisfies Config
