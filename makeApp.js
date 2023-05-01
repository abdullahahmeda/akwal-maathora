require('dotenv').config()
const scheduleManager = require('node-schedule')
const telegramBot = require('./telegram-bot')
const { getRandomInt, sleep } = require('./utils/common')
const sheetsClientUtils = require('./utils/sheets-client')
const twitterClientUtils = require('./utils/updateTwitterStatus')
const db = require('./db')

const SEND_ANOTHER_MESSAGE = 'send_another_message'

let phrases = []
module.exports = async ({ twitterIndex = 0, telegramIndex = 0 } = {}) => {
  console.log('[Info]: Application has started!')
  console.log(
    `[Info]: telegramIndex: ${telegramIndex}, twitterIndex: ${twitterIndex}`
  )

  await updatePhrases()
  setInterval(async () => await updatePhrases(), 2 * 60 * 60 * 1000) // update phrases every 2 hours

  const botInfo = await telegramBot.getMe()
  const rule = new scheduleManager.RecurrenceRule()
  rule.tz = 'Etc/UTC'
  rule.hour = [8, 8 + 12] // 8 AM and 8 PM (UTC), which is equivalent to 10 AM and 10 PM (cairo time)
  rule.minute = 0

  scheduleManager.scheduleJob(rule, async () => {
    try {
      const stmt = db.prepare('SELECT * FROM subscribers')
      const rows = stmt.all()
      const telegramIds = rows.map(row => row.telegram_id)
      for (const [index, telegramId] of telegramIds.entries()) {
        await sendTelegramMessage(telegramId, telegramIndex)
        if (index > 0 && index % 25 === 0) await sleep(1000)
      }
    } catch (error) {
      console.log(error)
    }
    telegramIndex++
    try {
      db.prepare('UPDATE settings SET value = ? WHERE name = ?').run(
        telegramIndex,
        'telegram_index'
      )
      console.log(`[Info]: telegramIndex is now ${telegramIndex}`)
    } catch (error) {
      console.log(error)
    }
  })
  telegramBot.on('callback_query', async context => {
    console.log(context)
    if (context.data === SEND_ANOTHER_MESSAGE) {
      const sender = await telegramBot.getChatMember(
        context.message.chat.id,
        context.from.id
      )
      if (
        context.message?.chat?.type === 'private' ||
        sender.status === 'creator' ||
        sender.can_send_messages ||
        sender.can_post_messages
      ) {
        await sendTelegramMessage(context.message.chat.id)
        telegramBot.answerCallbackQuery(context.id)
      } else {
        telegramBot.answerCallbackQuery(context.id, {
          url: `t.me/${botInfo.username}?start=123`
        })
      }
    }
  })

  telegramBot.on('my_chat_member', onMyChatMember)

  telegramBot.on('text', context => {
    sendTelegramMessage(context.chat.id)
  })

  scheduleManager.scheduleJob('0 * * * *', async () => {
    if (twitterIndex >= phrases.length) {
      twitterIndex = twitterIndex % phrases.length
    }
    const status = phrases?.[twitterIndex]?.[0] || ''
    if (status !== '') {
      try {
        await twitterClientUtils.updateStatus(status)
        console.log(`[Twitter]: ${status}`)
      } catch (error) {
        console.log(error)
      }
    }
    twitterIndex++
    try {
      db.prepare('UPDATE settings SET value = ? WHERE name = ?').run(
        twitterIndex,
        'twitter_index'
      )
    } catch (error) {
      console.log(error)
    }
  })
}

async function sendTelegramMessage (
  telegramId,
  telegramIndex = getRandomInt(0, phrases.length - 1)
) {
  telegramIndex = telegramIndex % phrases.length
  const message = phrases?.[telegramIndex]?.[0] || ''
  if (message !== '') {
    try {
      await telegramBot.sendMessage(telegramId, message, {
        disable_notification: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: 'جرب حكمة أخرى', callback_data: SEND_ANOTHER_MESSAGE }]
          ]
        }
      })
      console.log(`[Telegram to ${telegramId}]: ${message}`)
    } catch (error) {
      console.log(error)
    }
  }
}

async function updatePhrases () {
  try {
    phrases = await sheetsClientUtils.getRows()
    console.log('[Info]: Phrases has been updated.')
  } catch (error) {
    console.log(error)
  }
}

function onMyChatMember (context) {
  if (['left', 'kicked'].includes(context.new_chat_member.status)) {
    try {
      removeSubscriber(context.chat.id)
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      addSubscriber(context.chat.id)
    } catch (error) {
      console.log(error)
    }
  }
}

function addSubscriber (telegramId) {
  const stmt = db.prepare('INSERT INTO subscribers (telegram_id) VALUES (?)')
  stmt.run(telegramId)
  console.log(`[Telegram]: New subscription with ${telegramId}.`)
}

function removeSubscriber (telegramId) {
  const stmt = db.prepare('DELETE FROM subscribers WHERE telegram_id = ?')
  stmt.run(telegramId)
  console.log(`[Telegram]: Subscription with ${telegramId} has been cancelled.`)
}
