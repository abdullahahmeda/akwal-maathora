import { sheetsClient } from '../sheets-client'

export const getPhrases = async () => {
  const result = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'B2:B'
  })
  return result?.data.values
}
