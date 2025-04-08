import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTransactionDate(dateStr?: string) {
  if (!dateStr)
    return 'N/A'

  try {
    // M-PESA sends date in format "YYYYMMDDHHmmss"
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    const hour = dateStr.slice(8, 10)
    const minute = dateStr.slice(10, 12)

    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  catch (error) {
    console.error('Date parsing error:', error, 'for date:', dateStr)
    return 'Invalid date'
  }
}
