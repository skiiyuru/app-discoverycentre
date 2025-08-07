'use server'

import { NeonDbError } from '@neondatabase/serverless'
import { and, desc, eq } from 'drizzle-orm'

import type { GetParticipantsResponse } from '@/lib/types'

import { db } from '@/db/db'
import { participants, payments } from '@/db/schema'

export default async function getParticipants(): Promise<GetParticipantsResponse> {
  try {
    const results = await db.select({
      id: participants.id,
      firstName: participants.firstName,
      lastName: participants.lastName,
      gender: participants.gender,
      age: participants.age,
      dob: participants.dob,
      category: participants.category,
      // createdAt: participants.createdAt,
      phoneNumber: payments.phoneNumber,
      mpesaReceiptNumber: payments.mpesaReceiptNumber,
      createdAt: payments.createdAt,
      school: participants.school,
    })
      .from(participants)
      .innerJoin(
        payments,
        and(
          eq(participants.id, payments.participantId),
          eq(payments.status, 'success'),
        ),
      )
      .orderBy(desc(participants.createdAt))

    console.log('🚀 ~ getParticipants ~ participantsWithPayments:', results)
    return results
  }
  catch (error) {
    if (error instanceof NeonDbError) {
      console.error('Database error:', {
        message: error.message,
        code: error.code,
        cause: error.cause,
      })
      return {
        errorId: Date.now(),
        errorMessage: `Database Error: ${error.message}\nCode: ${error.code}`,
      }
    }
    else {
      console.error('getParticipants ~ error:', error)

      return {
        errorId: Date.now(),
        errorMessage: 'Something went wrong while retrieving the participants',
      }
    }
  }
}
