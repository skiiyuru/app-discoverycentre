import type { z } from 'zod'

import type { callbackSchema } from './schemas'

export enum TransactionType {
  Paybill = 'CustomerPayBillOnline',
  BuyGoods = 'CustomerBuyGoodsOnline',
}

export enum PaymentStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

export type AuthSuccessResponse = {
  access_token: string
  expires_in: string
}

export type StkPushRequestBody = {
  BusinessShortCode: number
  Password: string
  Timestamp: string
  TransactionType: TransactionType
  Amount: number
  PartyA: number
  PartyB: number
  PhoneNumber: number
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
