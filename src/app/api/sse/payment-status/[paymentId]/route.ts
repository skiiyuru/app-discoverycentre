import type { NextRequest } from 'next/server'

import Redis from 'ioredis'
import { NextResponse } from 'next/server'

import type { ConnectionMessage, PaymentUpdateChannel } from '@/lib/types'

import { config } from '@/lib/config'

export async function GET(req: NextRequest, { params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment Id must be included' }, { status: 400 })
  }

  if (!config.ioredis.URL) {
    return NextResponse.json({ error: 'Missing url configuration for ioredis' }, { status: 500 })
  }

  const subscriber = new Redis(config.ioredis.URL, {
    tls: { rejectUnauthorized: false },
    lazyConnect: true,
    maxRetriesPerRequest: null,
    connectTimeout: 30 * 1000,
  })

  const channel: PaymentUpdateChannel = `paymentId:${paymentId}`

  const stream = new ReadableStream({
    start: async (controller) => {
      // try to connect client
      try {
        await subscriber.connect()
        // console.warn(`✅ Client "${paymentId}" connected to channel "${channel}"`)
        // console.warn(`Redis connected for subscription on channel: ${channel}`)
      }
      catch (error) {
        console.error(`❌ Failed to connect client "${paymentId}"\n`, error)
        controller.error(new Error('Failed to connect to event source'))

        // Attempt cleanup
        try {
          subscriber.disconnect()
        }
        catch {}
        return
      }

      // Subscribe to the specific Redis channel
      await subscriber.subscribe(channel, (error) => {
        if (error) {
          console.error(`❌ Failed to subscribe to channel "${channel}":\n`, error)
          controller.error(new Error('Subscription failed'))
          // Attempt cleanup
          try {
            subscriber.disconnect()
          }
          catch {}
          return
        }

        // console.warn(`✅ Subscribed successfully to channel "${channel}". Count: ${count}`)
        // Send a confirmation event (optional)
        const connectionMessage: ConnectionMessage = { status: 'open' }
        controller.enqueue(`event: connected\ndata: ${JSON.stringify(connectionMessage)}\n\n`)
      })

      // Listen for messages on the subscribed channel
      subscriber.on('message', (receivedChannel, message) => {
        // console.warn(`Received message from Redis channel "${receivedChannel}":`, message)
        if (receivedChannel === channel) {
          // Format as SSE message: data: <json string>\n\n
          // You can also add 'event: <event_name>\n' if you want named events
          try {
            controller.enqueue(`event: paymentUpdate\ndata: ${message}\n\n`)
            subscriber.unsubscribe(channel)
              .then(() => subscriber.disconnect())
              .catch(console.error)
          }
          catch (err) {
            console.error(`Error handling message for ${paymentId}:`, err)
          }
        }
      })

      // Handle Redis errors during subscription
      subscriber.on('error', (error) => {
        console.error(`Redis subscriber error on channel ${channel}:\n`, error)
        // Close the stream on Redis error
        controller.error(error)
        // Attempt cleanup
        try {
          subscriber.disconnect()
        }
        catch {}
      })
    },
    cancel: () => {
      // Clean up the 'subscriber' instance specific to this request
      // console.warn(`SSE Client disconnected: ${paymentId}. Cleaning up Redis.`)
      subscriber.unsubscribe(channel)
      subscriber.disconnect()
    },
  })

  // Return the stream response with appropriate headers for SSE
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform', // Ensure no caching or buffering by proxies
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Nginx: Prevent buffering
    },
  })
}
