import type { PaymentStatus } from '../mpesa/types'

export type PaymentUpdate = {
  status: PaymentStatus
  mpesaReceiptNumber?: string
  transactionDate?: string
  message?: string
}

export function emitPaymentUpdate(paymentId: string, update: PaymentUpdate) {
  const key = `payment-controller:${paymentId}`
  const controller = (globalThis as any)[key] as ReadableStreamDefaultController | undefined

  if (controller) {
    const encoder = new TextEncoder()
    try {
      const message = encoder.encode(`data: ${JSON.stringify(update)}\n\n`)
      controller.enqueue(message)
    } catch (error) {
      console.error(`Failed to emit update for payment ${paymentId}:`, error)
    }
  } else {
    console.warn(`No controller found for payment ${paymentId}`)
  }
}
