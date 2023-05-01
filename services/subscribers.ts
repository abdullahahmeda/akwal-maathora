import { getDbConnection } from '../utils/getDbConnection'

export const addSubscriber = async (telegramId: number) => {
  const connection = await getDbConnection()
  return connection.execute(
    'INSERT INTO subscribers (telegram_id) VALUES (?)',
    [telegramId]
  )
}

export const removeSubscriber = async (telegramId: number) => {
  const connection = await getDbConnection()
  return connection.execute('DELETE FROM subscribers WHERE telegram_id = ?', [
    telegramId
  ])
}

export const getSubscribers = async () => {
  const connection = await getDbConnection()
  return (await connection.execute('SELECT * FROM subscribers')).rows
}
