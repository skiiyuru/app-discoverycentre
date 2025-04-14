import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { participants } from '@/db/schema'

import { CATEGORIES, GENDERS } from './constants'

export const insertParticipantSchema = createInsertSchema(participants).omit({ id: true, createdAt: true }).extend({
  phoneNumber: z.string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(12, 'Phone number must not exceed 12 digits')
    .regex(/^254\d{9}$/, 'Phone number must start with 254 followed by 9 digits'),
  firstName: z.string()
    .min(3, 'First name must be at least 3 characters')
    .max(25, 'First name must not exceed 25 characters')
    .transform(val =>
      val
        .toLowerCase()
        .replace(/[^a-z\s-]/g, '')
        .trim(),
    ),
  lastName: z.string()
    .min(3, 'Last name must be at least 3 characters')
    .max(25, 'Last name must not exceed 25 characters')
    .transform(val =>
      val
        .toLowerCase()
        .replace(/[^a-z\s-]/g, '')
        .trim(),
    ),
  age: z.string()
    .transform(val => Number(val))
    .pipe(
      z.number()
        .min(1, 'Age must be at least 1 year')
        .max(18, 'Age must not exceed 18 years'),
    ),
  category: z.enum(CATEGORIES),
  gender: z.enum(GENDERS),
})

export const callbackSchema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: z
        .object({
          Item: z.array(z.object({
            Name: z.string(),
            Value: z.union([z.string(), z.number()]).optional(),
          })),
        })
        .optional(),
    }),
  }),
})
