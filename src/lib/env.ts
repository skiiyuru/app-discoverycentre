/* eslint-disable node/no-process-env */
import 'dotenv/config'

export const env = {
  TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL ?? '',
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ?? '',
} as const
