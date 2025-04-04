import { Buffer } from 'node:buffer'

import type { MpesaAuthResponse, StkPushRequest, StkPushResponse } from './types'

import { env } from '../env'
import { MpesaError } from './errors'

class MpesaService {
  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && (Date.now() < this.tokenExpiry)) {
      return this.accessToken
    }

    const authToken = Buffer.from(`
        ${env.mpesa.CONSUMER_KEY}:${env.mpesa.CONSUMER_SECRET}
      `).toString('base64')

    const authResponse = await fetch(`${env.mpesa.SANDBOX}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    })

    const data = await authResponse.json() as MpesaAuthResponse

    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (Number(data.expires_in) * 1000)

    return data.access_token
  }

  async initiateStkPush({ Amount, PhoneNumber, AccountReference, TransactionDesc }: StkPushRequest): Promise<StkPushResponse> {
    const token = await this.getAccessToken()

    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)

    const password = Buffer.from(`
        ${env.mpesa.BUSINESS_SHORTCODE}${env.mpesa.PASSKEY}${timestamp}
      `).toString('base64')

    const response = await fetch(`${env.mpesa.SANDBOX}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: env.mpesa.BUSINESS_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: env.mpesa.TRANSACTION_TYPE,
        Amount,
        PartyA: PhoneNumber,
        PartyB: env.mpesa.BUSINESS_SHORTCODE,
        PhoneNumber,
        CallBackURL: env.mpesa.CALLBACK_URL,
        AccountReference,
        TransactionDesc,
      }),
    })

    const data = await response.json() as StkPushResponse

    if (data.ResponseCode !== '0') {
      throw new MpesaError(data.ResponseDescription, data.ResponseCode)
    }

    return data
  }
}

export const mpesaService = new MpesaService()
