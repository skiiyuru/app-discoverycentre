/* eslint-disable node/no-process-env */
import 'dotenv/config'

export const config = {
  db: {
    URL: process.env.NEON_DB_URL ?? '',
  },
  mpesa: {
    SANDBOX: process.env.NODE_ENV === 'production' ? process.env.MPESA_SANDBOX : process.env.DEV_MPESA_SANDBOX,
    BUSINESS_SHORTCODE: process.env.NODE_ENV === 'production' ? process.env.MPESA_BUSINESS_SHORT_CODE! : process.env.DEV_MPESA_BUSINESS_SHORT_CODE!,
    PASSKEY: process.env.NODE_ENV === 'production' ? process.env.MPESA_PASSKEY : process.env.DEV_MPESA_PASSKEY,
    CONSUMER_KEY: process.env.NODE_ENV === 'production' ? process.env.MPESA_CONSUMER_KEY : process.env.DEV_MPESA_CONSUMER_KEY,
    CONSUMER_SECRET: process.env.NODE_ENV === 'production' ? process.env.MPESA_CONSUMER_SECRET : process.env.DEV_MPESA_CONSUMER_SECRET,
    CALLBACK_URL: `${process.env.APP_URL}/api/mpesa/callback`,
  },
  ioredis: {
    URL: process.env.KV_URL,
  },
} as const
