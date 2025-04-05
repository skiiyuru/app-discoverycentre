import type { z } from 'zod'

import type { callbackSchema } from '@/app/api/mpesa/callback/route'

export enum TransactionType {
  Paybill = 'CustomerPayBillOnline',
  BuyGoods = 'CustomerBuyGoodsOnline',
}

export enum PaymentStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

export type MpesaAuthResponse = {
  access_token: string
  expires_in: string
}

export type StkPushRequest = {
  // BusinessShortCode: string
  // Password: string
  // Timestamp: string
  // TransactionType: TransactionType.Paybill
  Amount: string
  // PartyA: string
  // PartyB: string
  PhoneNumber: string
  // CallBackURL: string
  AccountReference: string
  TransactionDesc: string
}

export type StkPushResponse = {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export type StkCallbackResponse = z.infer<typeof callbackSchema>
