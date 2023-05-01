import { getDbConnection } from '../utils/getDbConnection'

export const getTelegramIndex = async () => {
  const connection = await getDbConnection()
  const results = await connection.execute(
    'SELECT value FROM settings WHERE name = ?',
    ['telegram_index'],
    { as: 'object' }
  )
  return +(results.rows[0].value as string)
}

export const getTwitterIndex = async () => {
  const connection = await getDbConnection()
  const results = await connection.execute(
    'SELECT value FROM settings WHERE name = ?',
    ['twitter_index'],
    { as: 'object' }
  )
  return +(results.rows[0].value as string)
}

export const updateTelegramIndex = async (telegramIndex: number) => {
  const connection = await getDbConnection()
  return connection.execute('UPDATE settings SET value = ? WHERE name = ?', [
    '' + telegramIndex,
    'telegram_index'
  ])
}

export const updateTwitterIndex = async (twitterIndex: number) => {
  const connection = await getDbConnection()
  return connection.execute('UPDATE settings SET value = ? WHERE name = ?', [
    '' + twitterIndex,
    'twitter_index'
  ])
}
