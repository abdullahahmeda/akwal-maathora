// TODO:
export function addSubscriber (telegramId) {
  const stmt = db.prepare('INSERT INTO subscribers (telegram_id) VALUES (?)')
  stmt.run(telegramId)
  console.log(`[Telegram]: New subscription with ${telegramId}.`)
}

export function removeSubscriber (telegramId) {
  const stmt = db.prepare('DELETE FROM subscribers WHERE telegram_id = ?')
  stmt.run(telegramId)
  console.log(`[Telegram]: Subscription with ${telegramId} has been cancelled.`)
}
