import { db } from '../utils/db'

export const getTelegramIndex = async () => {
  const results = await db.execute(
    'SELECT value FROM settings WHERE name = ?',
    ['telegram_index'],
    { as: 'object' }
  )
  return +(results.rows[0].value as string)
}

export const getTwitterIndex = async () => {
  const results = await db.execute(
    'SELECT value FROM settings WHERE name = ?',
    ['twitter_index'],
    { as: 'object' }
  )
  return +(results.rows[0].value as string)
}

export const updateTelegramIndex = async (telegramIndex: number) => {
  return db.execute('UPDATE settings SET value = ? WHERE name = ?', [
    '' + telegramIndex,
    'telegram_index'
  ])
}

export const updateTwitterIndex = async (twitterIndex: number) => {
  return db.execute('UPDATE settings SET value = ? WHERE name = ?', [
    '' + twitterIndex,
    'twitter_index'
  ])
}
