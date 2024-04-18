import { db } from "../utils/db";

export const getTelegramIndex = async () => {
  const results = await db.execute({
    sql: "SELECT value FROM settings WHERE name = ?",
    args: ["telegram_index"],
  });
  return +(results.rows[0].value as string);
};

export const getTwitterIndex = async () => {
  const results = await db.execute({
    sql: "SELECT value FROM settings WHERE name = ?",
    args: ["twitter_index"],
  });
  return +(results.rows[0].value as string);
};

export const updateTelegramIndex = async (telegramIndex: number) => {
  return db.execute({
    sql: "UPDATE settings SET value = ? WHERE name = ?",
    args: ["" + telegramIndex, "telegram_index"],
  });
};

export const updateTwitterIndex = async (twitterIndex: number) => {
  return db.execute({
    sql: "UPDATE settings SET value = ? WHERE name = ?",
    args: ["" + twitterIndex, "twitter_index"],
  });
};
