import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { randomUUID } from 'node:crypto'

import { Gender } from '@/lib/events/types/types'
import { PaymentStatus } from '@/lib/mpesa/types'

function generateId() {
  return text('id').primaryKey().$default(() => randomUUID())
}

function createdAt() {
  return text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull()
}

export const participants = sqliteTable('participants', {
  id: generateId(),
  createdAt: createdAt(),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  gender: text({ enum: [Gender.Male, Gender.Female] }).notNull(),
  age: text('age').notNull(),
})

export const payments = sqliteTable('payments', {
  id: generateId(),
  createdAt: createdAt(),

  participantId: text('participant_id').notNull(),
  checkoutRequestId: text('checkout_request_id').notNull().unique(),
  merchantRequestId: text('merchant_request_id').notNull(),
  phoneNumber: text('phone_number').notNull(),
  amount: text('amount').notNull(),

  mpesaReceiptNumber: text('mpesa_receipt_number').notNull().default(''),
  transactionDate: text().notNull().default(''),
  status: text({ enum: [PaymentStatus.Pending, PaymentStatus.Success, PaymentStatus.Failed] }).notNull().default(PaymentStatus.Pending),
})

export const participantRelations = relations(participants, ({ many }) => ({
  payments: many(payments),
}))

export const paymentRelations = relations(payments, ({ one }) => ({
  participant: one(participants, {
    fields: [payments.participantId],
    references: [participants.id],
  }),
}))
