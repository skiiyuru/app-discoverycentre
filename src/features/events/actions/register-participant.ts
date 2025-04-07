'use server'

import { LibsqlError } from '@libsql/client'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import type { RegisterParticipantResponse } from '@/lib/events/types/types'

import { db } from '@/db/db'
import { participants, payments } from '@/db/schema'
import { mpesa } from '@/lib/mpesa/service'

export async function registerParticipant(prevState: RegisterParticipantResponse | null, formData: FormData): Promise<RegisterParticipantResponse> {
  const insertParticipantSchema = createInsertSchema(participants).omit({ id: true, createdAt: true }).extend({
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(12, 'Phone number must not exceed 12 digits'),
  })
  const rawData = {
    firstName: formData.get('firstName')?.toString(),
    lastName: formData.get('lastName')?.toString(),
    gender: formData.get('gender')?.toString(),
    age: formData.get('age')?.toString(),
    phoneNumber: formData.get('phoneNumber')?.toString(),
  }

  const result = insertParticipantSchema.safeParse(rawData)

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      errorMessage: 'Some fields have errors',
    }
  }

  const { phoneNumber, ...insertParticipantValues } = result.data

  try {
    // TODO: Replace with real values
    const amount = '1'
    const accountReference = 'Test'
    const transactionDesc = 'Test'

    const response = await mpesa.initiateStkPush({
      Amount: amount,
      PhoneNumber: phoneNumber,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    })

    if (response.ResponseCode !== '0') {
      return {
        errorMessage: `Unable to initiate payment (code: ${response.ResponseCode}) - ${response.ResponseDescription}`,
      }
    }

    const insertParticipantResults = await db.insert(participants).values(insertParticipantValues).returning()
    const savedParticipant = insertParticipantResults[0]

    const insertPaymentResults = await db.insert(payments).values({
      participantId: savedParticipant.id,
      checkoutRequestId: response.CheckoutRequestID,
      merchantRequestId: response.MerchantRequestID,
      phoneNumber,
      amount,
    }).returning()
    const savedPayment = insertPaymentResults[0]

    return {
      data: {
        participant: savedParticipant,
        payment: savedPayment,
      },
    }
  }
  catch (error) {
    if (error instanceof LibsqlError) {
      throw new TypeError(`Database error: ${error.message}`)
    }

    console.error('🚀 ~ registerParticipant ~ error:', error)
    throw new Error('Something went wrong while registering participant')
  }
}

// TODO: fix double registration
// TODO: fix losing form state when field errors occur
// TODO: verify incoming callback data (MerchantRequestID & CheckoutRequestID) against what's in the db
