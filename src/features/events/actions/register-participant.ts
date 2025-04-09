'use server'

import { LibsqlError } from '@libsql/client'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import type { RegisterParticipantResponse } from '@/lib/events/types/types'

import { db } from '@/db/db'
import { participants, payments } from '@/db/schema'
import { MpesaError } from '@/lib/mpesa/errors'
import { mpesa } from '@/lib/mpesa/service'
import { PaymentStatus } from '@/lib/mpesa/types'

export async function registerParticipant(prevState: RegisterParticipantResponse | null, formData: FormData): Promise<RegisterParticipantResponse> {
  const insertParticipantSchema = createInsertSchema(participants).omit({ id: true, createdAt: true }).extend({
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(12, 'Phone number must not exceed 12 digits').regex(/^254\d{9}$/, 'Phone number must start with 254 followed by 9 digits'),
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

  const { phoneNumber, ...participantInput } = result.data

  const participantFilters = [eq(participants.firstName, participantInput.firstName), eq(participants.lastName, participantInput.lastName)]
  const paymentFilters = [eq(payments.phoneNumber, phoneNumber), eq(payments.status, PaymentStatus.Success)]

  try {
    // check for existing registration
    const existingParticipant = await db.query.participants.findFirst({
      where: and(...participantFilters),
      columns: {
        id: true,
      },
      with: {
        payments: {
          where: and(...paymentFilters),
          columns: {
            id: true,
          },
        },
      },
    })

    if (existingParticipant?.payments.length) {
      return {
        errorMessage: 'A participant with these details is already registered',
      }
    }

    // TODO: Replace with real values
    const amount = '1'
    const accountReference = 'Chess tournament'
    const transactionDesc = 'Tournament registration'

    const response = await mpesa.initiateStkPush({
      Amount: Number(amount),
      PhoneNumber: Number(phoneNumber),
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    })

    if (response.ResponseCode !== '0') {
      return {
        errorMessage: `Unable to initiate payment (code: ${response.ResponseCode}) - ${response.ResponseDescription}`,
      }
    }

    const [savedParticipant, savedPayment] = await db.transaction(async (tx) => {
      const [participant] = await tx.insert(participants)
        .values(participantInput)
        .returning()

      const [payment] = await tx.insert(payments)
        .values({
          participantId: participant.id,
          checkoutRequestId: response.CheckoutRequestID,
          merchantRequestId: response.MerchantRequestID,
          phoneNumber,
          amount,
        })
        .returning()

      return [participant, payment]
    })

    return {
      data: {
        participant: savedParticipant,
        payment: savedPayment,
      },
    }
  }
  catch (error) {
    if (error instanceof MpesaError) {
      return {
        errorMessage: `MPESA Error: ${error.message} (Code: ${error.code})`,
      }
    }

    if (error instanceof LibsqlError) {
      throw new TypeError(`Database error: ${error.message}`)
    }

    console.error('🚀 ~ registerParticipant ~ error:', error)
    throw new Error('Something went wrong while registering participant')
  }
}

// TODO: fix losing form state when field errors occur
