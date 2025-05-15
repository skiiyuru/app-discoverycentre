'use server'

import * as XLSX from 'xlsx'

import getParticipants from './get-participants'

export async function exportParticipants() {
  try {
    const response = await getParticipants()

    if ('errorMessage' in response) {
      return response
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(response.map(p => ({
      'Name': `${p.firstName} ${p.lastName}`,
      'Gender': p.gender,
      'Age': p.age,
      'Date of Birth': p.dob,
      'Category': p.category,
    })))

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants')

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return buffer
  }
  catch (error) {
    console.error('Export error:', error)
    return { errorId: Date.now(), errorMessage: 'Failed to export participants data' }
  }
}
