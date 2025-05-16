import type { z } from 'zod'

import type { participants, payments } from '@/db/schema'

import type { CATEGORIES, GENDERS, PAYMENT_STATUSES } from './constants'
import type { callbackSchema } from './validation-schemas'

export enum TransactionType {
  Paybill = 'CustomerPayBillOnline',
  BuyGoods = 'CustomerBuyGoodsOnline',
}

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export type AuthSuccessResponse = {
  access_token: string
  expires_in: string
}

export type StkPushRequestBody = {
  BusinessShortCode: string
  Password: string
  Timestamp: string
  TransactionType: TransactionType
  Amount: string
  PartyA: string
  PartyB: string
  PhoneNumber: string
  CallBackURL: string
  AccountReference: string
  TransactionDesc: string
}

export type StkPushUserInput = Pick<StkPushRequestBody, 'PhoneNumber' | 'Amount' | 'AccountReference' | 'TransactionDesc'>

export type StkPushSuccessResponse = {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export type StkPushErrorResponse = {
  requestId: string
  errorCode: string
  errorMessage: string
}

export type StkCallbackResponse = z.infer<typeof callbackSchema>

export type ConnectionStatus = 'closed' | 'open' | 'failed' | 'pending'

export type ConnectionMessage = {
  status: ConnectionStatus
}

export type Gender = (typeof GENDERS)[number]

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
  errorMessage?: string
  errorId?: number
}
export type GetParticipantsResponse = (Omit<SelectParticipant, 'createdAt'> & Pick<SelectPayment, 'createdAt' | 'mpesaReceiptNumber' | 'phoneNumber'>)[] | ErrorResponse

export type Category = (typeof CATEGORIES)[number]

export type PaymentUpdateChannel = `paymentId:${string}`

export type PaymentUpdate = {
  status: PaymentStatus
  amount?: string
  mpesaReceiptNumber?: string
  transactionDate?: string
  errorMessage?: string
}

export type ErrorResponse = {
  errorMessage: string
  errorId: number
}
