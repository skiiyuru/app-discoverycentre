import { Buffer } from 'node:buffer'

import type { AuthSuccessResponse, StkPushErrorResponse, StkPushRequestBody, StkPushSuccessResponse, StkPushUserInput } from '../types'

import { config } from '../config'
import { MpesaError } from '../errors'
import { TransactionType } from '../types'

class MpesaService {
  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && (Date.now() < this.tokenExpiry)) {
      return this.accessToken
    }

    const authToken = Buffer.from(`${config.mpesa.CONSUMER_KEY}:${config.mpesa.CONSUMER_SECRET}`).toString('base64')

    const authResponse = await fetch(`${config.mpesa.SANDBOX}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    })

    if (!authResponse.ok) {
      throw new MpesaError(`M-PESA auth failed: ${authResponse.status} ${authResponse.statusText}`, authResponse.status.toString())
    }

    const responseText = await authResponse.text()
    if (!responseText || responseText.trim() === '') {
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
      throw new MpesaError(`Failed to parse M-PESA auth response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'PARSE_ERROR')
    }
  }

  async initiateStkPush({ Amount, PhoneNumber, AccountReference, TransactionDesc }: StkPushUserInput) {
    const token = await this.getAccessToken()
    console.warn('🚀 ~ MpesaService ~ initiateStkPush ~ token:', token)

    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)

    const passwordString = `${config.mpesa.BUSINESS_SHORTCODE}${config.mpesa.PASSKEY}${timestamp}`
    const password = Buffer.from(passwordString).toString('base64')
    console.warn('🚀 ~ MpesaService ~ initiateStkPush ~ passwordString:', passwordString)
    console.warn('🚀 ~ MpesaService ~ initiateStkPush ~ password:', password)

    const body: StkPushRequestBody = {
      BusinessShortCode: config.mpesa.BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: TransactionType.Paybill,
      Amount,
      PartyA: PhoneNumber,
      PartyB: config.mpesa.BUSINESS_SHORTCODE,
      PhoneNumber,
      CallBackURL: config.mpesa.CALLBACK_URL,
      AccountReference,
      TransactionDesc,
    }
    console.warn('🚀 ~ MpesaService ~ initiateStkPush ~ body:', body)

    const response = await fetch(`${config.mpesa.SANDBOX}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.warn('🚀 ~ MpesaService ~ initiateStkPush ~ response:', response)

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
