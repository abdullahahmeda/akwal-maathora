import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
// import { ChatMemberUpdated, Update } from 'node-telegram-bot-api'
import { telegramBot } from '../../telegram-bot'
import { addSubscriber, removeSubscriber } from '../../services/subscribers'
import { getPhrases } from '../../services/phrases'
import { sendTelegramMessage } from '../../utils/sendTelegramMessage'
import {
  ChatMemberAdministrator,
  ChatMemberRestricted,
  Update
} from 'telegraf/typings/core/types/typegram'
import { message } from 'telegraf/filters'
import { getRandomInt } from '../../utils/common'

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const update: Update = JSON.parse(event.body!)
  await telegramBot.handleUpdate(update)

  const phrases = (await getPhrases()) as string[][]

  telegramBot.on('callback_query', async ctx => {
    if ((ctx.callbackQuery as any).data === 'send_another_message') {
      const sender = await ctx.telegram.getChatMember(
        ctx.chat!.id,
        ctx.from!.id
      )
      if (
        ctx.chat?.type === 'private' ||
        sender.status === 'creator' ||
        (sender as ChatMemberRestricted).can_send_messages ||
        (sender as ChatMemberAdministrator).can_post_messages
      ) {
        const message = phrases[getRandomInt(0, phrases.length - 1)]?.[0] || ''
        await sendTelegramMessage(ctx.chat!.id, message)
        await ctx.telegram.answerCbQuery(ctx.callbackQuery.id)
      } else {
        await ctx.telegram.answerCbQuery(ctx.callbackQuery.id, undefined, {
          url: `t.me/${ctx.botInfo.username}?start=123`
        })
      }
    }
  })

  telegramBot.on(
    'my_chat_member',
    async ctx => await onMyChatMember(ctx.update)
  )

  telegramBot.on(message('text'), context => {
    const message = phrases[getRandomInt(0, phrases.length - 1)]?.[0] || ''
    sendTelegramMessage(context.chat.id, message)
  })
  return { statusCode: 200 }
}

async function onMyChatMember (update: Update.MyChatMemberUpdate) {
  if (['left', 'kicked'].includes(update.my_chat_member.new_chat_member.status))
    await removeSubscriber(update.my_chat_member.chat.id)
  else await addSubscriber(update.my_chat_member.chat.id)
}

export { handler }
