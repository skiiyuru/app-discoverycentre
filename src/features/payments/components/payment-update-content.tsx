import { CircleCheck, CircleX, Loader2, RefreshCwOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import usePaymentChannel from '@/hooks/use-payment-channel'
import { formatTransactionDate } from '@/lib/utils'

export default function PaymentUpdateContent({ paymentId }: { paymentId: string }) {
  const [update, connectionStatus, error] = usePaymentChannel(paymentId)
  const router = useRouter()

  if (error || connectionStatus === 'failed') {
    return (
      <>
        <CardHeader>
          <CardTitle>
            <span className="flex gap-2 items-center">
              <RefreshCwOff className="text-red-400" />
              Something went wrong while attempting to get an update.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p aria-live="assertive">{error}</p>
        </CardContent>
      </>
    )
  }

  if (update && update.status === 'success') {
    return (
      <>
        <CardHeader>
          <CardTitle>
            <span className="flex gap-2 items-center">
              <CircleCheck className="text-green-400" />
              {`Payment ${update.status}`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div aria-live="polite">
            <p aria-label="MPESA Receipt Information">
              Amount:
              {' '}
              <span className="font-bold">
                KES.
                {' '}
                {update.amount?.toLocaleString()}
              </span>
            </p>
            <p aria-label="MPESA Receipt Information">
              MPESA receipt number:
              {' '}
              <span className="font-bold">{update.mpesaReceiptNumber}</span>
            </p>
            <p aria-label="Transaction Date Information">
              Transaction date:
              {' '}
              <span className="font-bold">{formatTransactionDate(update.transactionDate)}</span>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full py-4" onClick={() => router.refresh()}>Make another payment</Button>
        </CardFooter>
      </>
    )
  }

  if (update && update.status === 'failed') {
    return (
      <>
        <CardHeader>
          <CardTitle>
            <span className="flex gap-2 items-center">
              <CircleX className="text-red-400" />
              {`Payment ${update.status}`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p aria-live="assertive">{update.errorMessage || 'An error occurred with your payment.'}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full py-4" onClick={() => router.refresh()}>Try again</Button>
        </CardFooter>
      </>
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>
          <span className="flex gap-2 items-center">
            <Loader2 className="animate-spin" />
            {connectionStatus === 'pending' ? 'Connecting...' : `Confirming payment...`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-1/2 md:w-1/4 h-4 bg-zinc-600 animate-pulse" />
        <div className="w-1/3 md:w-1/3 h-4 bg-zinc-600 animate-pulse" />
        <div className="w-4/5 md:w-1/2 h-4 bg-zinc-600 animate-pulse" />
      </CardContent>
    </>
  )
}
