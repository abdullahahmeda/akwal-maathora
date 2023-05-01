import { google } from 'googleapis'

export const sheetsClient = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY
})
