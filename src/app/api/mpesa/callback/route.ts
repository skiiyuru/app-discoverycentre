import type { NextRequest } from 'next/server'

import { LibsqlError } from '@libsql/client'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db/db'
import { payments } from '@/db/schema'
import { PaymentStatus } from '@/lib/mpesa/types'

export const callbackSchema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: z
        .object({
          Item: z.array(z.object({
            Name: z.string(),
            Value: z.union([z.string(), z.number()]),
          })),
        })
        .optional(),
    }),
  }),
})

export default async function POST(request: NextRequest) {
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

    if (!stkCallback.CallbackMetadata) {
      await db.update(payments).set({
        status: PaymentStatus.Failed,
      }).where(and(eq(payments.merchantRequestId, stkCallback.MerchantRequestID), eq(payments.checkoutRequestId, stkCallback.CheckoutRequestID)))

      return Response.json({ success: true }, { status: 200 })
    }

    const metaData = stkCallback.CallbackMetadata.Item.reduce((acc, item) => ({
      ...acc,
      [item.Name]: item.Value,
    }), {} as Record<string, string | number>)

    await db.update(payments).set({
      mpesaReceiptNumber: (metaData.MpesaReceiptNumber) as string,
      transactionDate: `${metaData.TransactionDate}`,
      status: PaymentStatus.Success,
    }).where(and(eq(payments.merchantRequestId, stkCallback.MerchantRequestID), eq(payments.checkoutRequestId, stkCallback.CheckoutRequestID),
    ))

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
