jest.useFakeTimers()

const scheduleManager = require('node-schedule')
const makeApp = require('./makeApp')
const telegramBot = require('./telegram-bot')
const twitterClientUtils = require('./utils/twitter-client')

const sendMessage = jest.spyOn(telegramBot, 'sendMessage')
const updateStatus = jest.spyOn(twitterClientUtils, 'updateStatus')

afterEach(() => {
  sendMessage.mockClear()
  updateStatus.mockClear()
  for (const job of Object.values(scheduleManager.scheduledJobs)) {
    job.cancel()
  }
})

describe('Bot schedule', () => {
  it('sends a telegram message at 8 AM (UTC)', () => {
    jest.setSystemTime(new Date(Date.UTC(2022, 2, 5, 0, 0, 0)))
    makeApp()
    jest.advanceTimersByTime(8 * 60 * 60 * 1000 - 500)
    expect(sendMessage).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(1000)
    expect(sendMessage).toHaveBeenCalledTimes(1)
  })

  it('sends a telegram message at 8 PM (UTC)', () => {
    jest.setSystemTime(new Date(Date.UTC(2022, 2, 5, 12, 0, 0)))
    makeApp()
    jest.advanceTimersByTime(8 * 60 * 60 * 1000 - 500)
    expect(sendMessage).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(1000)
    expect(sendMessage).toHaveBeenCalledTimes(1)
  })
  it('runs daily', () => {
    jest.setSystemTime(new Date(Date.UTC(2022, 2, 5, 7, 59, 59)))
    makeApp()
    jest.advanceTimersByTime(24 * 60 * 60 * 1000 + 1500) // A day and 1.5 seconds have passed
    expect(sendMessage).toHaveBeenCalledTimes(3)
  })
})

describe('Twitter schedule', () => {
  it('updates status every hour', () => {
    jest.setSystemTime(new Date(Date.UTC(2022, 2, 5, 7, 0, 0)))
    makeApp()
    jest.advanceTimersByTime(1 * 60 * 60 * 1000 - 500)
    expect(updateStatus).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(1000)
    expect(updateStatus).toHaveBeenCalledTimes(1)
  })

  it('runs daily', () => {
    jest.setSystemTime(new Date(Date.UTC(2022, 2, 5, 22, 59, 59)))
    makeApp()
    jest.advanceTimersByTime(1 * 60 * 60 * 1000 + 1500) // an hour and 1.5 seconds have passed
    expect(updateStatus).toHaveBeenCalledTimes(2)
  })
})
