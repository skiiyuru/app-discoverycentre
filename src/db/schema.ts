import { sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { randomUUID } from 'node:crypto'

import { Gender } from '@/lib/events/types/types'

function generateId() {
  return text('id').primaryKey().$default(() => randomUUID())
}

function createdAt() {
  return text('createdAt').default(sql`CURRENT_TIMESTAMP`).notNull()
}

export const participants = sqliteTable('participants', {
  id: generateId(),
  createdAt: createdAt(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  gender: text({ enum: [Gender.Male, Gender.Female] }).notNull(),
  age: text().notNull(),
  mobile: text().notNull(),
})
