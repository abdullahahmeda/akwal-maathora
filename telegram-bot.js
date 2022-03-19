process.env.NTBA_FIX_319 = 1

const TelegramBotAPI = require('node-telegram-bot-api')
const bot = new TelegramBotAPI(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
})

module.exports = bot
