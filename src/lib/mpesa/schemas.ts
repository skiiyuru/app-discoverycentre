import { z } from 'zod'

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
            Value: z.union([z.string(), z.number()]),
          })),
        })
        .optional(),
    }),
  }),
})
