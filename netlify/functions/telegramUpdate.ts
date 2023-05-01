import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
// import { ChatMemberUpdated, Update } from 'node-telegram-bot-api'
import { telegramBot } from '../../telegram-bot'
import { addSubscriber, removeSubscriber } from '../../services/subscribers'
import { getPhrases } from '../../services/phrases'
import { sendTelegramMessage } from '../../utils/sendTelegramMessage'
import { Update } from 'node-telegram-bot-api'
import { getRandomInt } from '../../utils/common'

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const update: Update = JSON.parse(event.body!)
  const me = await telegramBot.getMe()
  const phrases = (await getPhrases()) as string[][]

  if (update.callback_query) {
    if (update.callback_query.data === 'send_another_message') {
      const sender = await telegramBot.getChatMember(
        update.callback_query!.message!.chat!.id,
        update.callback_query.from!.id
      )
      if (
        update.callback_query.message!.chat!.type === 'private' ||
        sender.status === 'creator' ||
        sender.can_send_messages ||
        sender.can_post_messages
      ) {
        const message = phrases[getRandomInt(0, phrases.length - 1)]?.[0] || ''
        await sendTelegramMessage(update.message!.chat!.id, message)
        await telegramBot.answerCallbackQuery(update.callback_query.id)
      } else {
        await telegramBot.answerCallbackQuery(update.callback_query.id, {
          url: `t.me/${me.username}?start=123`
        })
      }
    }
    return { statusCode: 200 }
  }

  if (update.my_chat_member) {
    await onMyChatMember(update)
    return { statusCode: 200 }
  }

  if (update.message?.text) {
    const message = phrases[getRandomInt(0, phrases.length - 1)]?.[0] || ''
    sendTelegramMessage(update.message!.chat.id, message)
  }

  // telegramBot.on(message('text'), context => {
  //   const message = phrases[getRandomInt(0, phrases.length - 1)]?.[0] || ''
  //   sendTelegramMessage(context.chat.id, message)
  // })
  return { statusCode: 200 }
}

async function onMyChatMember (update: Update) {
  if (
    ['left', 'kicked'].includes(update.my_chat_member!.new_chat_member.status)
  )
    await removeSubscriber(update.my_chat_member!.chat.id)
  else await addSubscriber(update.my_chat_member!.chat.id)
}

export { handler }
