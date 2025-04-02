import { z } from 'zod'

export type Schema = z.infer<typeof schema>

export const schema = z.object({
  firstName: z.string().min(2, 'Should be at least 2 characters').max(50, 'Should be at most 50 characters'),
  lastName: z.string().min(2, 'Should be at least 2 characters').max(50, 'Should be at most 50 characters'),
})
