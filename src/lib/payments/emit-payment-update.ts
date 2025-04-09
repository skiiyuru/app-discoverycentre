import type { PaymentStatus } from '../mpesa/types'

import { typedGlobalThis } from './types'

export type PaymentUpdate = {
  status: PaymentStatus
  amount?: number
  mpesaReceiptNumber?: string
  transactionDate?: string
  errorMessage?: string
}

const encoder = new TextEncoder()

export function emitPaymentUpdate(paymentId: string, update: PaymentUpdate) {
  const key = `payment-controller:${paymentId}`
  const controller = typedGlobalThis[key]

  if (controller) {
    try {
      const message = encoder.encode(`data: ${JSON.stringify(update)}\n\n`)
      controller.enqueue(message)
    }
    catch (error) {
      console.error(`Failed to emit update for payment ${paymentId}:`, error)
    }
  }
  else {
    console.warn(`No controller found for payment ${paymentId}`)
  }
}
