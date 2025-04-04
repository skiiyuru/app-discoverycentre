import type { participants, payments } from '@/db/schema'

export enum Gender {
  Male = 'male',
  Female = 'female',
}

 type SelectParticipant = typeof participants.$inferSelect
 type InsertParticipant = typeof participants.$inferInsert

 type SelectPayment = typeof payments.$inferSelect
//  type InsertPayment = typeof payments.$inferInsert

type InsertParticipantErrors = {
  [K in keyof InsertParticipant]?: string[]
} & { phoneNumber?: string[] }

export type RegisterParticipantResponse = {
  data?: {
    participant: SelectParticipant
    payment: SelectPayment
  }
  errors?: InsertParticipantErrors
  message?: string
}
