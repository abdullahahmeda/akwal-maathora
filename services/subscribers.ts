import { db } from '../utils/db'

export const addSubscriber = async (telegramId: number) => {
  return db.execute('INSERT INTO subscribers (telegram_id) VALUES (?)', [
    telegramId
  ])
}

export const removeSubscriber = async (telegramId: number) => {
  return db.execute('DELETE FROM subscribers WHERE telegram_id = ?', [
    telegramId
  ])
}

export const getSubscribers = async () => {
  return (await db.execute('SELECT * FROM subscribers')).rows
}
