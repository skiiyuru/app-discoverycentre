import { Redis } from '@upstash/redis'

const errorMsg = 'Upstash Redis environment variables (URL, TOKEN) are not set. Publisher client will not be initialized.'

// eslint-disable-next-line node/no-process-env
const isRedisConfigured = Boolean(process.env.KV_REST_API_TOKEN && process.env.KV_REST_API_URL)
if (!isRedisConfigured) {
  console.warn(errorMsg)
}

export const redisPublisher = isRedisConfigured
  ? Redis.fromEnv()
  : null

if (isRedisConfigured) {
  console.warn('Initialized Upstash Redis publisher client.')
}
