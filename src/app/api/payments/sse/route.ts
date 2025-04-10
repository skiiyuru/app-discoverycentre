import type { NextRequest } from 'next/server'

import { eq } from 'drizzle-orm'

import { db } from '@/db/db'
import { payments } from '@/db/schema'
import { PaymentStatus } from '@/lib/mpesa/types'
import { typedGlobalThis } from '@/lib/payments/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const payment_id = searchParams.get('payment_id')

  if (!payment_id) {
    return new Response('Payment ID is required', { status: 404 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start: async (controller) => {
      const key = `payment-controller:${payment_id}`
      typedGlobalThis[key] = controller

      // Check current payment status
      const payment = await db.query.payments.findFirst({
        where: eq(payments.id, payment_id),
        columns: {
          status: true,
          amount: true,
          mpesaReceiptNumber: true,
          transactionDate: true,
        },
      })

      // Only send "connecting" if payment is pending or not found
      if (!payment || payment.status === PaymentStatus.Pending) {
        const message = encoder.encode('data: {"status": "connecting"}\n\n')
        controller.enqueue(message)
      }
      else {
        // Send current payment state
        const message = encoder.encode(`data: ${JSON.stringify(payment)}\n\n`)
        controller.enqueue(message)
      }
    },
    cancel() {
      const key = `payment-controller:${payment_id}`
      delete typedGlobalThis[key]
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
