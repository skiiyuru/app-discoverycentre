'use client'

import { useEffect, useState } from 'react'

import type { PaymentUpdate } from '@/lib/payments/emit-payment-update'

export function usePaymentEvent(paymentId: string) {
  const [payment, setPayment] = useState<PaymentUpdate | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    let retryTimeout: ReturnType<typeof setTimeout>
    let eventSource = new EventSource(`/api/payments/sse?payment_id=${paymentId}`)
    let isReconnecting = false
    let delay: NodeJS.Timeout | undefined

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        // Only update if the new status is not "connecting" or if we don't have a payment yet
        if (!payment || data.status !== 'connecting') {
          setPayment(data)
        }
        setRetryCount(0)
      }
      catch (error) {
        console.error('Failed to parse message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error)
      eventSource.close()

      // Only retry if we haven't received a final status yet
      if (retryCount < maxRetries && (!payment || (payment.status !== 'success' && payment.status !== 'failed'))) {
        const retryDelay = 2 ** retryCount * 1000
        console.warn(`Retrying connection in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`)
        retryTimeout = setTimeout(() => {
          setRetryCount(prev => prev + 1)
        }, retryDelay)
      }
    }

    // Handle network status changes
    const handleOnline = () => {
      if (isReconnecting || (payment && (payment.status === 'success' || payment.status === 'failed'))) {
        return
      }

      console.warn('Network reconnected, reestablishing SSE connection')
      eventSource.close()
      isReconnecting = true

      delay = setTimeout(() => {
        eventSource = new EventSource(`/api/payments/sse?payment_id=${paymentId}`)
        isReconnecting = false
      }, 1000)
    }

    window.addEventListener('online', handleOnline)

    return () => {
      eventSource.close()
      clearTimeout(retryTimeout)
      clearTimeout(delay)
      window.removeEventListener('online', handleOnline)
    }
  }, [paymentId, retryCount, payment])

  return payment
}
