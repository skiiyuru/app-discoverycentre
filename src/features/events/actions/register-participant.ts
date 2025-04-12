'use server'
import { NeonDbError } from '@neondatabase/serverless'
import { and, eq } from 'drizzle-orm'

import type { RegisterParticipantResponse } from '@/lib/types'

import { db } from '@/db/db'
import { participants, payments } from '@/db/schema'
import { MpesaError } from '@/lib/errors'
import { mpesa } from '@/lib/mpesa/service'
import { insertParticipantSchema } from '@/lib/validation-schemas'

export async function registerParticipant(prevState: RegisterParticipantResponse | null, formData: FormData): Promise<RegisterParticipantResponse> {
  const rawData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    gender: formData.get('gender'),
    age: formData.get('age'),
    category: formData.get('category'),
    phoneNumber: formData.get('phoneNumber'),
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
  const paymentFilters = [eq(payments.phoneNumber, phoneNumber), eq(payments.status, 'success')]

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
      console.error('Mpesa error:', {
        message: error.message,
        code: error.code,
        cause: error.cause,
      })
      return {
        errorMessage: `MPESA Error: ${error.message} (Code: ${error.code})`,
      }
    }
    else if (error instanceof NeonDbError) {
      console.error('Database error:', {
        message: error.message,
        code: error.code,
        cause: error.cause,
      })
      return {
        errorMessage: `Database Error: ${error.message}\nCode: ${error.code} )`,
      }
    }
    else {
      console.error('🚀 ~ registerParticipant ~ error:', error)
      return {
        errorMessage: 'Something went wrong while registering the participant',
      }
    }
  }
}
