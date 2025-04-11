/* eslint-disable node/no-process-env */
import 'dotenv/config'

export const config = {
  db: {
    URL: process.env.NEON_DB_URL ?? '',
  },
  mpesa: {
    SANDBOX: process.env.MPESA_SANDBOX,
    BUSINESS_SHORTCODE: process.env.MPESA_BUSINESS_SHORT_CODE,
    PASSKEY: process.env.MPESA_PASSKEY,
    CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
    CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
    CALLBACK_URL: `${process.env.APP_URL}/api/mpesa/callback`,
  },
  ioredis: {
    URL: process.env.KV_URL,
  },
} as const
