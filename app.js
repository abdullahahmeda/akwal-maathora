const fs = require('fs')
const makeApp = require('./makeApp')
const db = require('./db')

let telegramIndex = 0
let twitterIndex = 0

db.prepare(
  'CREATE TABLE IF NOT EXISTS subscribers (telegram_id INTEGER PRIMARY KEY)'
).run()
db.prepare(
  'CREATE TABLE IF NOT EXISTS settings (name TEXT PRIMARY KEY, value TEXT)'
).run()

console.log('[Info]: Database has been setup.')

if (fs.existsSync('lastIndex.txt')) {
  const lastIndex = parseInt(fs.readFileSync('lastIndex.txt', 'utf8'))
  fs.rmSync('lastIndex.txt')
  telegramIndex = lastIndex
  twitterIndex = lastIndex
}
try {
  let row = db
    .prepare('SELECT value FROM settings WHERE name = ?')
    .get('telegram_index')
  if (row === undefined) {
    db.prepare('INSERT INTO settings (name, value) VALUES (?, ?)').run(
      'telegram_index',
      telegramIndex
    )
  } else telegramIndex = +row?.value || telegramIndex

  row = db
    .prepare('SELECT value FROM settings WHERE name = ?')
    .get('twitter_index')
  if (row === undefined) {
    db.prepare('INSERT INTO settings (name, value) VALUES (?, ?)').run(
      'twitter_index',
      twitterIndex
    )
  } else twitterIndex = +row?.value || twitterIndex
} catch (error) {}

makeApp({ telegramIndex, twitterIndex })
