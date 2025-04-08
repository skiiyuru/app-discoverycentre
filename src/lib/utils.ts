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
    // Validate format first
    if (!/^\d{14}$/.test(dateStr)) {
      throw new Error('Invalid date format. Expected YYYYMMDDHHmmss')
    }
    
    const formattedStr = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${dateStr.slice(8, 10)}:${dateStr.slice(10, 12)}:00`
    const date = new Date(formattedStr)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date values')
    }
    
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
