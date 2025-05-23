import type { NextRequest } from 'next/server'

import { NeonDbError } from '@neondatabase/serverless'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import type { PaymentUpdate } from '@/lib/types'

import { db } from '@/db/db'
import { payments } from '@/db/schema'
import { publishPaymentUpdate } from '@/lib/payments/publish-update'
import { redisPublisher } from '@/lib/upstash-redis'
import { callbackSchema } from '@/lib/validation-schemas'

export async function POST(request: NextRequest) {
  if (!redisPublisher) {
    console.error('Redis publisher client is not available. Check environment variables.')
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Failed: Internal Server Configuration Error' }, { status: 500 })
  }

  try {
    const payload = await request.json()
    const result = callbackSchema.safeParse(payload)

    if (!result.success) {
      console.error('Invalid M-PESA callback payload:', {
        errors: result.error.errors,
        payload,
      })

      return Response.json({
        error: 'Invalid callback payload',
      }, { status: 400 })
    }

    const { Body: { stkCallback } } = result.data

    const fieldChecks = [eq(payments.merchantRequestId, stkCallback.MerchantRequestID), eq(payments.checkoutRequestId, stkCallback.CheckoutRequestID)]

    const payment = await db.query.payments.findFirst({
      where: and(...fieldChecks),
    })

    if (!payment) {
      return Response.json({
        error: 'Payment record not found',
      }, { status: 404 })
    }

    if (!stkCallback.CallbackMetadata) {
      await db.update(payments).set({
        status: 'failed',
      }).where(and(...fieldChecks))

      // Publish payment failed
      await publishPaymentUpdate(payment.id, { status: 'failed', errorMessage: stkCallback.ResultDesc })

      return NextResponse.json({ success: 'true' }, { status: 200 })
    }

    const metaData: Record<string, string | number | undefined> = {}
    for (const item of stkCallback.CallbackMetadata.Item) {
      metaData[item.Name] = item.Value
    }

    const updateData: PaymentUpdate = {
      status: 'success',
      mpesaReceiptNumber: (metaData.MpesaReceiptNumber) as string,
      transactionDate: (metaData.TransactionDate) as string,
    }

    const [updatedPaymentRecord] = await db.update(payments).set(updateData).where(and(...fieldChecks)).returning()

    const { amount, status, transactionDate, mpesaReceiptNumber } = updatedPaymentRecord

    // Publish payment success
    await publishPaymentUpdate(payment.id, {
      status,
      amount,
      transactionDate,
      mpesaReceiptNumber,
    })

    return NextResponse.json({ success: 'true' }, { status: 200 })
  }
  catch (error) {
    if (error instanceof NeonDbError) {
      throw new TypeError(`Database error: ${error.message}`)
    }

    console.error('M-PESA callback processing error:', error)

    return Response.json({
      error: 'Something went wrong while processing the mpesa callback',
    }, { status: 500 })
  }
}
