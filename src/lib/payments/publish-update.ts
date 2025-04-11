import type { PaymentStatus } from '../mpesa/types'
import type { PaymentUpdateChannel } from './types'

import { redisPublisher } from '../upstash-redis'

export type PaymentUpdate = {
  status: PaymentStatus
  amount?: number
  mpesaReceiptNumber?: string
  transactionDate?: string
  errorMessage?: string
}

export async function publishPaymentUpdate(paymentId: string, update: PaymentUpdate) {
  const channel: PaymentUpdateChannel = `paymentId:${paymentId}`
  const message = JSON.stringify(update)
  console.log(`Publishing update for payment: "${channel} "\nmessage: ${message}`)
  await redisPublisher.publish(channel, message)
}
