import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { randomUUID } from 'node:crypto'

import { CATEGORIES, GENDERS } from '@/lib/events/constants'
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

  firstName: text('first_name', { length: 25 }).notNull(),
  lastName: text('last_name', { length: 25 }).notNull(),
  gender: text('gender', { enum: GENDERS }).notNull(),
  age: integer('age').notNull(),
  category: text('category', { enum: CATEGORIES }).notNull(),
}, table => ([
  index('name_idx').on(table.lastName, table.firstName),
]))

export const payments = sqliteTable('payments', {
  id: generateId(),
  createdAt: createdAt(),

  participantId: text('participant_id').notNull(),
  checkoutRequestId: text('checkout_request_id').notNull(),
  merchantRequestId: text('merchant_request_id').notNull(),
  phoneNumber: text('phone_number', { length: 12 }).notNull(),
  amount: text('amount').notNull(),

  mpesaReceiptNumber: text('mpesa_receipt_number').notNull().default(''),
  transactionDate: text('transaction_date').notNull().default(''),
  status: text('status', { enum: [PaymentStatus.Pending, PaymentStatus.Success, PaymentStatus.Failed] }).notNull().default(PaymentStatus.Pending),
}, table => ([
  index('phone_status_idx').on(table.phoneNumber, table.status),
  uniqueIndex('request_id_idx').on(table.checkoutRequestId, table.merchantRequestId),
]))

export const participantRelations = relations(participants, ({ many }) => ({
  payments: many(payments),
}))

export const paymentRelations = relations(payments, ({ one }) => ({
  participant: one(participants, {
    fields: [payments.participantId],
    references: [participants.id],
  }),
}))
