require('dotenv').config()
const { google } = require('googleapis')

const sheetsClient = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY
})

module.exports = sheetsClient
