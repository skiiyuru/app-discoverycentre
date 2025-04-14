'use client'

import { Loader2, Wallet } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

import type { RegisterParticipantResponse } from '@/lib/types'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PaymentUpdateContent from '@/features/payments/components/payment-update-content'
import { CATEGORIES } from '@/lib/constants'

import { registerParticipant } from '../actions/register-participant'

const initialState: RegisterParticipantResponse = {
  errorMessage: '',
}

export default function RegisterForm() {
  const [state, action, loading] = useActionState(registerParticipant, initialState)

  useEffect(() => {
    if (state.data?.payment) {
      toast.info(`Payment request sent to: ${state.data.payment.phoneNumber}`, {
        description: 'Enter you MPESA PIN to authorize the payment',
      })
    }

    if (state.errorId) {
      toast.error(state.errorMessage)
    }
  }, [state.errorId, state.errorMessage, state.data?.payment])

  if (state.data?.payment) {
    return (
      <Card>
        <PaymentUpdateContent paymentId={state.data.payment.id} />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register for tournament</CardTitle>
        <CardDescription>Enter a participant's details and pay using MPESA.</CardDescription>
        <CardDescription>Registation closes on 12th May 2025.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} autoComplete="on">
          <div className="grid sm:grid-cols-2 gap-4 w-full pb-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Grace"
                required
                minLength={3}
                maxLength={25}
                autoComplete="given-name"
                aria-describedby="firstName-error"
                className={state?.errors?.firstName ? 'border-red-500' : ''}
              />
              {state?.errors?.firstName && (
                <p id="firstName-error" className="text-sm text-red-500">
                  {state.errors.firstName[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Brooks"
                required
                minLength={3}
                maxLength={25}
                autoComplete="family-name"
                aria-describedby="lastName-error"
                className={state?.errors?.lastName ? 'border-red-500' : ''}
              />
              {state?.errors?.lastName && (
                <p id="lastName-error" className="text-sm text-red-500">
                  {state.errors.lastName[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" required>
                <SelectTrigger
                  id="gender"
                  className={`w-full ${state?.errors?.gender ? 'border-red-500' : ''}`}
                  aria-describedby="gender-error"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.gender && (
                <p id="gender-error" className="text-sm text-red-500">
                  {state.errors.gender[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                placeholder="6"
                required
                type="number"
                min="1"
                max="100"
                aria-describedby="age-error"
                className={state?.errors?.age ? 'border-red-500' : ''}
              />
              {state?.errors?.age && (
                <p id="age-error" className="text-sm text-red-500">
                  {state.errors.age[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger
                  id="category"
                  className={`w-full ${state?.errors?.category ? 'border-red-500' : ''}`}
                  aria-describedby="category-error"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {CATEGORIES.map(category => (
                    <SelectItem key={`u${category}`} value={category}>
                      Under
                      {' '}
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.category && (
                <p id="category-error" className="text-sm text-red-500">
                  {state.errors.category[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phoneNumber">MPESA Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="254729625387"
                required
                pattern="254[0-9]{9}"
                minLength={12}
                maxLength={12}
                type="tel"
                autoComplete="tel"
                aria-describedby="phoneNumber-error"
                className={state?.errors?.phoneNumber ? 'border-red-500' : ''}
              />
              {state?.errors?.phoneNumber
                ? (
                    <p id="phoneNumber-error" className="text-sm text-red-500">
                      {state.errors.phoneNumber[0]}
                    </p>
                  )
                : <p className="text-xs text-muted-foreground">Enter your Phone Number in the format: 254XXXXXXXXX</p>}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4"
            disabled={loading}
          >
            {loading
              ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Initiating request...
                  </>
                )
              : (
                  <>
                    <Wallet />
                    Pay With MPESA
                  </>
                )}

          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
