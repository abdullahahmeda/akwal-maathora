import TelegramBotAPI from 'node-telegram-bot-api'
process.env.NTBA_FIX_319 = '1'
export const telegramBot = new TelegramBotAPI(
  // @ts-expect-error
  process.env.TELEGRAM_BOT_TOKEN
)
