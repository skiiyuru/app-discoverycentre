import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { participants } from '@/db/schema'

import { CATEGORIES, GENDERS } from './constants'

export const insertParticipantSchema = createInsertSchema(participants).omit({ id: true, createdAt: true, age: true }).extend({
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
  dob: z.string()
    .transform(str => new Date(str))
    .pipe(
      z.date()
        .min(new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000), 'Participant must be under 18 years')
        .max(new Date(Date.now() - 6 * 365.25 * 24 * 60 * 60 * 1000), 'Participant must be at least 6 years old'),
    ),
  category: z.enum(CATEGORIES),
  gender: z.enum(GENDERS),
  school: z.string()
    .min(3, 'School must be at least 3 characters')
    .max(255, 'School must not exceed 255 characters')
    .transform(val => val.toLowerCase().trim()),
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
