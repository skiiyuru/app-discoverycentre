'use client'

import { useEffect, useState } from 'react'

import type { PaymentUpdate } from '@/lib/payments/emit-payment-update'

export function usePaymentStatus(paymentId: string) {
  const [payment, setPayment] = useState<PaymentUpdate | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    let retryTimeout: ReturnType<typeof setTimeout>
    const eventSource = new EventSource(`/api/payments/sse?payment_id=${paymentId}`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setPayment(data)
        setRetryCount(0) // Reset retry count on successful message
      }
      catch (error) {
        console.error('Failed to parse message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error)
      eventSource.close()

      if (retryCount < maxRetries) {
        const delay = 2 ** retryCount * 1000 // Exponential backoff
        console.warn(`Retrying connection in ${delay}ms... (${retryCount + 1}/${maxRetries})`)
        retryTimeout = setTimeout(() => {
          setRetryCount(prev => prev + 1)
        }, delay)
      }
    }

    return () => {
      eventSource.close()
      clearTimeout(retryTimeout)
    }
  }, [paymentId, retryCount])

  return payment
}
