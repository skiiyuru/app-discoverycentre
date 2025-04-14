import type { PaymentUpdate, PaymentUpdateChannel } from '../types'

import { redisPublisher } from '../upstash-redis'

export async function publishPaymentUpdate(paymentId: string, update: PaymentUpdate) {
  const channel: PaymentUpdateChannel = `paymentId:${paymentId}`
  const message = JSON.stringify(update)
  console.log(`Publishing update for payment: "${channel} "\nmessage: ${message}`)
  try {
    await redisPublisher.publish(channel, message)
  } catch (error) {
    console.error(`Failed to publish payment update for ${paymentId}:`, error)
    // Consider implementing a retry mechanism or fallback here
  }
}
