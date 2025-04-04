'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

import type { RegisterParticipantResponse } from '@/lib/events/types/types'

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

import { registerParticipant } from '../actions'

const initialState: RegisterParticipantResponse = {
  message: '',
}

export default function RegisterForm() {
  const [state, action, isPending] = useActionState(registerParticipant, initialState)

  useEffect(() => {
    if (state.data) {
      toast.success('Registration successful', {
        description: `${state.data.firstName} ${state.data.lastName} has been registered.`,
      })
    }
    else if (state.errors && !state.data) {
      toast.error('Registration failed', {
        description: state.message,
      })
    }
  }, [state.data, state.message, state.errors])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register for tornament</CardTitle>
        <CardDescription>Enter a participant's details and pay using MPESA.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} autoComplete="on">
          <div className="grid grid-cols-2 gap-4 w-full pb-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Grace"
                required
                minLength={2}
                maxLength={50}
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
                minLength={2}
                maxLength={50}
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
              <Select name="gender">
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
              <Label htmlFor="mobile">MPESA Number</Label>
              <Input
                id="mobile"
                name="mobile"
                placeholder="0721622726"
                required
                minLength={10}
                maxLength={12}
                type="tel"
                autoComplete="tel"
                aria-describedby="mobile-error"
                className={state?.errors?.mobile ? 'border-red-500' : ''}
              />
              {state?.errors?.mobile && (
                <p id="mobile-error" className="text-sm text-red-500">
                  {state.errors.mobile[0]}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Pay With MPESA'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
