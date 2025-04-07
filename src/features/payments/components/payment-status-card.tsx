import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { usePaymentStatus } from '@/hooks/use-payment-status'
import { PaymentStatus } from '@/lib/mpesa/types'

export default function PaymentStatusCard({ paymentId }: { paymentId: string }) {
  const payment = usePaymentStatus(paymentId)

  return (
    <Card>
      <CardTitle>{!paymentId ? 'Processing payment...' : `Payment ${payment?.status}`}</CardTitle>
      <CardContent>
        {payment && payment.status === PaymentStatus.Success
          && (
            <div aria-live="polite">
              <p aria-label="Mpesa Receipt Information">
                Mpesa receipt number:
                {payment.mpesaReceiptNumber}
              </p>
              <p aria-label="Transaction Date Information">
                Transaction date:
                {payment.transactionDate}
              </p>
            </div>
          )}
        {payment && payment.status === PaymentStatus.Failed
          && <p aria-live="assertive">{payment.errorMessage || 'An error occurred with your payment.'}</p>}
      </CardContent>
    </Card>
  )
}
