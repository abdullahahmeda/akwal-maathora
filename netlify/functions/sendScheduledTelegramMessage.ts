import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { getTelegramIndex, updateTelegramIndex } from '../../services/settings'
import { getSubscribers } from '../../services/subscribers'
import { sendTelegramMessage } from '../../utils/sendTelegramMessage'
import { getPhrases } from '../../services/phrases'
import { getRandomInt, sleep } from '../../utils/common'

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // let telegramIndex = await getTelegramIndex()
  // console.log('telegramIndex', telegramIndex)
  // const subscribers = await getSubscribers()
  // console.log('subscribers', subscribers)
  // const phrases = (await getPhrases()) as string[][]
  // console.log('phrases', phrases)
  // if (telegramIndex >= phrases.length) {
  //   telegramIndex = telegramIndex % phrases.length
  // }
  // const message = phrases[getRandomInt(0, phrases.length - 1)]?.[0] || ''
  // for (const [index, subscriber] of subscribers.entries()) {
  //   console.log(subscriber)
  //   await sendTelegramMessage(subscriber.telegramId, message)
  //   if (index > 0 && index % 25 === 0) await sleep(1000)
  // }
  // await updateTelegramIndex(telegramIndex + 1)

  return { statusCode: 200 }
}

// const handler = schedule('0 8,20 * * *', myHandler)
// const handler = schedule('* * * * *', myHandler)

export { handler }
