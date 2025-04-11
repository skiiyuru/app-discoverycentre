import { Redis } from '@upstash/redis'

const errorMsg = 'Upstash Redis environment variables (URL, TOKEN) are not set. Publisher client will not be initialized.'

// eslint-disable-next-line node/no-process-env
if (!process.env.KV_REST_API_TOKEN || !process.env.KV_REST_API_URL) {
  console.warn(errorMsg)
  throw new Error(errorMsg)
}

export const redisPublisher = Redis.fromEnv()

console.log('Initialized Upstash Redis publisher client.')
