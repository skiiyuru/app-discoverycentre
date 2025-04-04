'use server'

import { LibsqlError } from '@libsql/client'
import { createInsertSchema } from 'drizzle-zod'

import type { RegisterParticipantResponse } from '@/lib/events/types/types'

import { db } from '@/db/db'
import { participants } from '@/db/schema'

export async function registerParticipant(prevState: RegisterParticipantResponse | null, formData: FormData): Promise<RegisterParticipantResponse> {
  const insertParticipantSchema = createInsertSchema(participants).omit({ id: true, createdAt: true })
  const rawData = {
    firstName: formData.get('firstName')?.toString(),
    lastName: formData.get('lastName')?.toString(),
    gender: formData.get('gender')?.toString(),
    age: formData.get('age')?.toString(),
    mobile: formData.get('mobile')?.toString(),
  }

  const result = insertParticipantSchema.safeParse(rawData)

  if (!result.success) {
    return {
      message: 'Please fix the errors in the form',
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const results = await db.insert(participants).values(result.data).returning()
    return {
      data: results[0],
      message: 'Participant added successfully',
    }
  }
  catch (error: unknown) {
    if (error instanceof LibsqlError) {
      // Handle specific database errors
      throw new TypeError(`Database error: ${error.message}`)
    }
    // Handle other unknown errors
    throw new Error('Something went wrong while trying to insert the participant')
  }
}
