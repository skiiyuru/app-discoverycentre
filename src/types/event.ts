import type { participants } from '../../db/schema'

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export type NewParticipant = Omit<typeof participants.$inferInsert, 'id' | 'createdAt'>

export type RegisterParticipantResponse = {
  data?: NewParticipant
  message: string
  errors?: {
    [K in keyof NewParticipant]?: string[];
  }
}
