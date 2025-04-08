import { Buffer } from 'node:buffer'

import type { AuthSuccessResponse, StkPushErrorResponse, StkPushRequestBody, StkPushSuccessResponse, StkPushUserInput } from './types'

import { env } from '../env'
import { MpesaError } from './errors'
import { TransactionType } from './types'

class MpesaService {
  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && (Date.now() < this.tokenExpiry)) {
      return this.accessToken
    }

    const authToken = Buffer.from(`${env.mpesa.CONSUMER_KEY}:${env.mpesa.CONSUMER_SECRET}`).toString('base64')

    const authResponse = await fetch(`${env.mpesa.SANDBOX}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    })

    if (!authResponse.ok) {
      throw new MpesaError(`M-PESA auth failed: ${authResponse.status} ${authResponse.statusText}`, authResponse.status.toString())
    }

    const responseText = await authResponse.text()
    if (!responseText) {
      throw new MpesaError('M-PESA auth returned empty response', 'EMPTY_RESPONSE')
    }

    try {
      const data = JSON.parse(responseText) as AuthSuccessResponse
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + (Number(data.expires_in) * 1000)
      return data.access_token
    }
    catch (error) {
      console.error('Failed to parse M-PESA auth response:', responseText)
      throw new Error(`Failed to parse M-PESA auth response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async initiateStkPush({ Amount, PhoneNumber, AccountReference, TransactionDesc }: StkPushUserInput) {
    const token = await this.getAccessToken()

    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)

    const passwordString = `${env.mpesa.BUSINESS_SHORTCODE}${env.mpesa.PASSKEY}${timestamp}`
    const password = Buffer.from(passwordString).toString('base64')

    const body: StkPushRequestBody = {
      BusinessShortCode: Number(env.mpesa.BUSINESS_SHORTCODE),
      Password: password,
      Timestamp: timestamp,
      TransactionType: TransactionType.Paybill,
      Amount,
      PartyA: PhoneNumber,
      PartyB: Number(env.mpesa.BUSINESS_SHORTCODE),
      PhoneNumber,
      CallBackURL: env.mpesa.CALLBACK_URL,
      AccountReference,
      TransactionDesc,
    }

    const response = await fetch(`${env.mpesa.SANDBOX}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json() as (StkPushSuccessResponse | StkPushErrorResponse)

    if ('errorCode' in data) {
      // This is an error response
      throw new MpesaError(data.errorMessage, data.errorCode)
    }

    // This is a success response
    if (data.ResponseCode !== '0') {
      throw new MpesaError(data.ResponseDescription, data.ResponseCode)
    }

    return data
  }
}

export const mpesa = new MpesaService()
