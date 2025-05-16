'use server'

import { NeonDbError } from '@neondatabase/serverless'
import { and, desc, eq, exists } from 'drizzle-orm'

import type { GetParticipantsResponse } from '@/lib/types'

import { db } from '@/db/db'
import { participants, payments } from '@/db/schema'

export default async function getParticipants(): Promise<GetParticipantsResponse> {
  try {
    const results = await db.query.participants.findMany({
      where: exists(
        db.select().from(payments).where(
          and(
            eq(payments.participantId, participants.id),
            eq(payments.status, 'success'),
          ),
        ),
      ),
      orderBy: desc(participants.createdAt),
    })

    console.warn('🚀 ~ getParticipants ~ participantsWithPayments:', results)
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
