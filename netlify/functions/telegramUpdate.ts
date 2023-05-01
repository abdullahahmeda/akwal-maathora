import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { ChatMemberUpdated, Update } from 'node-telegram-bot-api'
import { telegramBot } from '../../telegram-bot'
import { addSubscriber, removeSubscriber } from '../../services/subscribers'
import { getPhrases } from '../../services/phrases'
import { sendTelegramMessage } from '../../services/telegram'

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const update: Update = JSON.parse(event.body!)
  console.log(update)
  telegramBot.processUpdate(update)

  const botInfo = await telegramBot.getMe()
  const phrases = (await getPhrases()) as string[][]

  telegramBot.on('callback_query', async update => {
    if (update.data === 'send_another_message') {
      const sender = await telegramBot.getChatMember(
        update.message!.chat.id,
        update.message!.from!.id
      )
      if (
        update.message?.chat?.type === 'private' ||
        sender.status === 'creator' ||
        sender.can_send_messages ||
        sender.can_post_messages
      ) {
        const message = phrases[getRandomInt(0, phrases.length - 1)]?.[0] || ''
        await sendTelegramMessage(update.message!.chat.id, message)
        telegramBot.answerCallbackQuery(update.id)
      } else {
        telegramBot.answerCallbackQuery(update.id, {
          url: `t.me/${botInfo.username}?start=123`
        })
      }
    }
  })

  telegramBot.on('my_chat_member', onMyChatMember)

  telegramBot.on('text', context => {
    console.log('message-text')
    const message = phrases[getRandomInt(0, phrases.length - 1)]?.[0] || ''
    sendTelegramMessage(context.chat.id, message)
  })
  return { statusCode: 200 }
}

function onMyChatMember (update: ChatMemberUpdated) {
  if (['left', 'kicked'].includes(update.new_chat_member.status))
    removeSubscriber(update.chat.id)
  else addSubscriber(update.chat.id)
}

export { handler }
