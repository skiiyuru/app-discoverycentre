/* eslint-disable node/no-process-env */
import 'dotenv/config'

export const env = {
  db: {
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  },
  mpesa: {
    SANDBOX: process.env.MPESA_SANDBOX,
    BUSINESS_SHORTCODE: process.env.MPESA_BUSINESS_SHORT_CODE,
    PASSKEY: process.env.MPESA_PASSKEY,
    CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
    CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
    CALLBACK_URL: `${process.env.APP_URL}/api/mpesa/callback`,
    TRANSACTION_TYPE: process.env.MPESA_TRANSACTION_TYPE,
  },
} as const
