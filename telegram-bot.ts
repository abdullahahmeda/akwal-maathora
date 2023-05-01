import TelegramBot from 'node-telegram-bot-api'

export const telegramBot = new TelegramBot(
  // @ts-expect-error
  process.env.TELEGRAM_BOT_TOKEN
)
