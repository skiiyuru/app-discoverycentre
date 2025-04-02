import { randomUUID } from 'node:crypto'
import { sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

function generateId() {
  return text('id').primaryKey().$default(() => randomUUID())
}

function createdAt() {
  return text('createdAt').default(sql`CURRENT_TIMESTAMP`).notNull()
}

export const participantsTable = sqliteTable('participants', {
  id: generateId(),
  createdAt: createdAt(),
  firstName: text().notNull(),
  lastName: text().notNull(),
})
