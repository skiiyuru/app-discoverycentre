export enum TransactionType {
  Paybill = 'CustomerPayBillOnline',
  BuyGoods = 'CustomerBuyGoodsOnline',
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

export type StkCallbackItem = {
  Name: string
  Value: number | string
}

export type StkCallbackResponse = {
  Body: {
    stkCallback: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item: StkCallbackItem[]
      }
    }
  }
}
