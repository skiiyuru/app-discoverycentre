import type { NextRequest } from 'next/server'

import { typedGlobalThis } from '@/lib/payments/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const payment_id = searchParams.get('payment_id')

  if (!payment_id) {
    return new Response('Payment ID is required', { status: 404 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const key = `payment-controller:${payment_id}`
      typedGlobalThis[key] = controller

      const message = encoder.encode(`data: {"status": "connecting"\n\n}`)
      controller.enqueue(message)
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
