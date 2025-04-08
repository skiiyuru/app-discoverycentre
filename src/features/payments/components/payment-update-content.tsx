import { CircleCheck, CircleX, Loader2 } from 'lucide-react'

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaymentEvent } from '@/hooks/use-payment-event'
import { PaymentStatus } from '@/lib/mpesa/types'
import { formatTransactionDate } from '@/lib/utils'

export default function PaymentUpdateContent({ paymentId }: { paymentId: string }) {
  const paymentEvent = usePaymentEvent(paymentId)

  if (paymentEvent && paymentEvent.status === PaymentStatus.Success) {
    return (
      <>
        <CardHeader>
          <CardTitle>
            <span className="flex gap-2 items-center">
              <CircleCheck className="text-green-400" />
              {`Payment ${paymentEvent.status}`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div aria-live="polite">
            <p aria-label="MPESA Receipt Information">
              Amount:
              {' '}
              <span className="font-bold">
                KES
                {paymentEvent.amount?.toLocaleString()}
              </span>
            </p>
            <p aria-label="MPESA Receipt Information">
              MPESA receipt number:
              {' '}
              <span className="font-bold">{paymentEvent.mpesaReceiptNumber}</span>
            </p>
            <p aria-label="Transaction Date Information">
              Transaction date:
              {' '}
              <span className="font-bold">{formatTransactionDate(paymentEvent.transactionDate)}</span>
            </p>
          </div>
        </CardContent>
      </>
    )
  }

  if (paymentEvent && paymentEvent.status === PaymentStatus.Failed) {
    return (
      <>
        <CardHeader>
          <CardTitle>
            <span className="flex gap-2 items-center">
              <CircleX className="text-red-400" />
              {`Payment ${paymentEvent.status}`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p aria-live="assertive">{paymentEvent.errorMessage || 'An error occurred with your payment.'}</p>
        </CardContent>
      </>
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>
          <span className="flex gap-2 items-center">
            <Loader2 className="animate-spin" />
            Processing payment...
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-1/4 h-4 bg-zinc-600 animate-pulse" />
        <div className="w-1/3 h-4 bg-zinc-600 animate-pulse" />
        <div className="w-1/2 h-4 bg-zinc-600 animate-pulse" />
      </CardContent>
    </>
  )
}
