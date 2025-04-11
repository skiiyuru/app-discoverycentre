import { relations } from 'drizzle-orm'
import { index, numeric, pgTable, smallint, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'

import { CATEGORIES, GENDERS, PAYMENT_STATUSES } from '@/lib/constants'

export const participants = pgTable('participants', {
  id: uuid().defaultRandom().primaryKey(),
  createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),

  firstName: varchar({ length: 25 }).notNull(),
  lastName: varchar({ length: 25 }).notNull(),
  gender: varchar({ length: 6, enum: GENDERS }).notNull(),
  age: smallint().notNull(),
  category: varchar({ length: 2, enum: CATEGORIES }).notNull(),
}, table => ([
  index('name_idx').on(table.lastName, table.firstName),
]))

export const payments = pgTable('payments', {
  id: uuid().defaultRandom().primaryKey(),
  createdAt: timestamp({ mode: 'string' }).defaultNow(),

  participantId: uuid().notNull(),
  checkoutRequestId: varchar({ length: 50 }).notNull(),
  merchantRequestId: varchar({ length: 50 }).notNull(),
  phoneNumber: varchar({ length: 12 }).notNull(),
  amount: numeric().notNull(),

  mpesaReceiptNumber: varchar({ length: 20 }).notNull().default(''),
  transactionDate: timestamp({ mode: 'string' }).notNull().defaultNow(),
  status: varchar({ enum: PAYMENT_STATUSES }).notNull().default('pending'),
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
