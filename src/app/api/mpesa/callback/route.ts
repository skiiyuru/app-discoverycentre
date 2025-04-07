import type { NextRequest } from 'next/server'

import { LibsqlError } from '@libsql/client'
import { and, eq } from 'drizzle-orm'

import { db } from '@/db/db'
import { payments } from '@/db/schema'
import { callbackSchema } from '@/lib/mpesa/schemas'
import { PaymentStatus } from '@/lib/mpesa/types'
import { emitPaymentUpdate } from '@/lib/payments/emit-payment-update'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const result = callbackSchema.safeParse(payload)

    if (!result.success) {
      console.error('Invalid M-PESA callback payload:', {
        errors: result.error.errors,
        payload,
      })

      return Response.json({
        success: false,
        message: 'Invalid callback payload',
      }, { status: 400 })
    }

    const { Body: { stkCallback } } = result.data

    const payment = await db.query.payments.findFirst({
      where: and(
        eq(payments.merchantRequestId, stkCallback.MerchantRequestID),
        eq(payments.checkoutRequestId, stkCallback.CheckoutRequestID),
      ),
    })

    if (!payment) {
      return Response.json({
        success: false,
        message: 'Payment record not found',
      }, { status: 404 })
    }

    if (!stkCallback.CallbackMetadata) {
      await db.update(payments).set({
        status: PaymentStatus.Failed,
      }).where(and(eq(payments.merchantRequestId, stkCallback.MerchantRequestID), eq(payments.checkoutRequestId, stkCallback.CheckoutRequestID)))

      // trigger sse
      emitPaymentUpdate(payment.id, { status: PaymentStatus.Failed, errorMessage: stkCallback.ResultDesc })

      return Response.json({ success: true }, { status: 200 })
    }

    const metaData: Record<string, string | number> = {}
    for (const item of stkCallback.CallbackMetadata.Item) {
      metaData[item.Name] = item.Value
    }

    const updateData = {
      mpesaReceiptNumber: (metaData.MpesaReceiptNumber) as string,
      transactionDate: `${metaData.TransactionDate}`,
      status: PaymentStatus.Success,
    }

    await db.update(payments).set(updateData).where(and(eq(payments.merchantRequestId, stkCallback.MerchantRequestID), eq(payments.checkoutRequestId, stkCallback.CheckoutRequestID),
    ))

    // trigger sse
    emitPaymentUpdate(payment.id, updateData)

    return Response.json({ success: true }, { status: 200 })
  }
  catch (error) {
    if (error instanceof LibsqlError) {
      throw new TypeError(`Database error: ${error.message}`)
    }

    // Log unexpected errors
    console.error('M-PESA callback processing error:', error)

    // Always return success to M-PESA to prevent retries
    // But use 500 status to trigger our error monitoring
    return Response.json({
      success: true,
      error: 'Internal processing error',
    }, { status: 500 })
  }
}
