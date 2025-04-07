'use client'

import { useEffect, useState } from 'react'

import type { PaymentUpdate } from '@/lib/payments/emit-payment-update'

export function usePaymentStatus(paymentId: string) {
  const [payment, setPayment] = useState<PaymentUpdate | null>(null)

  useEffect(() => {
    const eventSource = new EventSource(`/api/payments/sse?payment_id=${paymentId}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setPayment(data)
    }

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [paymentId])

  return payment
}
