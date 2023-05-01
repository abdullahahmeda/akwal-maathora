import { twitterClient } from '../twitter-client'

export function updateTwitterStatus (status: string) {
  return new Promise<void>((resolve, reject) => {
    twitterClient.post('statuses/update', { status }, function (error) {
      if (error) reject(error)
      else resolve()
    })
  })
}
