const sheetsClient = require('../sheets-client')

function getRows () {
  return new Promise((resolve, reject) => {
    sheetsClient.spreadsheets.values.get(
      {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'A:A'
      },
      (error, res) => {
        if (error) reject(error)
        else resolve(res.data.values)
      }
    )
  })
}

module.exports = {
  getRows
}
