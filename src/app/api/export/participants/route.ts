import { NextResponse } from 'next/server'

import { exportParticipants } from '@/features/events/actions/export-participants'

export async function GET() {
  const response = await exportParticipants()

  if (response && 'errorMessage' in response) {
    return NextResponse.json(response, { status: 500 })
  }

  // Set headers for file download
  return new NextResponse(response, {
    headers: {
      'Content-Disposition': 'attachment; filename="participants.xlsx"',
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  })
}
