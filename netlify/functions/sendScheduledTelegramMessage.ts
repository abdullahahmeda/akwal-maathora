import {
  Handler,
  HandlerEvent,
  HandlerContext,
  schedule
} from '@netlify/functions'
import { getTelegramIndex, updateTelegramIndex } from '../../services/settings'
import { getSubscribers } from '../../services/subscribers'
import { sendTelegramMessage } from '../../utils/sendTelegramMessage'
import { getPhrases } from '../../services/phrases'
import { getRandomInt, sleep } from '../../utils/common'

const myHandler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  let telegramIndex = await getTelegramIndex()
  const subscribers = await getSubscribers()
  const phrases = (await getPhrases()) as string[][]
  if (telegramIndex >= phrases.length) {
    telegramIndex = telegramIndex % phrases.length
  }
  const message = phrases[telegramIndex]?.[0] || ''
  for (const [index, subscriber] of subscribers.entries()) {
    await sendTelegramMessage((subscriber as any).telegram_id, message)
    if (index > 0 && index % 25 === 0) await sleep(1000)
  }
  await updateTelegramIndex(telegramIndex + 1)

  return { statusCode: 200 }
}

// const handler = schedule('0 8,20 * * *', myHandler)
const handler = schedule('* * * * *', myHandler)

export { handler }
