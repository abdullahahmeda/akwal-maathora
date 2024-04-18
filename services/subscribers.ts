import { db } from "../utils/db";

export const addSubscriber = async (telegramId: number) => {
  return db.execute({
    sql: "INSERT INTO subscribers (telegram_id) VALUES (?)",
    args: [telegramId],
  });
};

export const removeSubscriber = async (telegramId: number) => {
  return db.execute({
    sql: "DELETE FROM subscribers WHERE telegram_id = ?",
    args: [telegramId],
  });
};

export const getSubscribers = async () => {
  return (await db.execute("SELECT * FROM subscribers")).rows;
};
