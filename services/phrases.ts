import { sheetsClient } from '../sheets-client'

export const getPhrases = async () => {
  const result = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'A:A'
  })
  return result?.data.values
}
