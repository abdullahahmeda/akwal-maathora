import { telegramBot } from '../telegram-bot'

export async function sendTelegramMessage (telegramId: number, message: string) {
  // messageIndex = messageIndex % phrases.length
  // const message = phrases?.[messageIndex]?.[0] || ''
  if (message !== '') {
    try {
      await telegramBot.telegram.sendMessage(telegramId, message, {
        disable_notification: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: 'جرب حكمة أخرى', callback_data: 'send_another_message' }]
          ]
        }
      })
      console.log(`[Telegram to ${telegramId}]: ${message}`)
    } catch (error) {
      console.log(error)
    }
  }
}
