import { Telegraf } from 'telegraf'
export const telegramBot = new Telegraf(
  // @ts-expect-error
  process.env.TELEGRAM_BOT_TOKEN
)
