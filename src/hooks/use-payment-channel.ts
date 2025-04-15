import { useEffect, useState } from 'react'

import type { ConnectionMessage, ConnectionStatus, PaymentUpdate } from '@/lib/types'

export default function usePaymentChannel(paymentId: string): [update: PaymentUpdate | null, connectionStatus: ConnectionStatus, error: string | null] {
  const [update, setUpdate] = useState<PaymentUpdate | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('pending')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!paymentId) {
      console.error('Missing payment id. Cannot start client-side channel connection')
      return
    }

    const eventSourceUrl = `/api/sse/payment-status/${paymentId}`
    const eventSource = new EventSource(eventSourceUrl)

    eventSource.onopen = () => {
      console.warn('✅ Client side SSE connection established.')
      setError(null)
    }

    eventSource.addEventListener('connected', (event) => {
      try {
        const data = JSON.parse(event.data) as ConnectionMessage
        setConnectionStatus(data.status)
      }
      catch (error) {
        console.error('🚀 ~ eventSource.addEventListener ~ connected:', error)
      }
    })

    // Handler for named 'paymentUpdate' events
    eventSource.addEventListener('paymentUpdate', (event) => {
      console.warn('✅ Received paymentUpdate event:', event.data)
      try {
        const data = JSON.parse(event.data) as PaymentUpdate
        setUpdate(data)
        if (data.status === 'failed' || data.status === 'success') {
          eventSource.close()
          setConnectionStatus('closed')
        }
      }
      catch (error) {
        console.error('Failed to parse payment update data:', error)
        setError('Received invalid update data.')
        setConnectionStatus('failed')
      }
    })

    eventSource.onerror = (error) => {
      console.error('Client side SSE connection error:', error)
      setError('Connection error. Closing connection...')
      setConnectionStatus('failed')
      eventSource.close()
    }

    return () => {
      console.warn('Clean up: Closing client side SSE connection.')
      eventSource.close()
      setConnectionStatus('closed')
    }
  }, [paymentId])

  return [update, connectionStatus, error]
}
