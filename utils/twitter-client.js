const twitterClient = require('../twitter-client')

function updateStatus (status) {
  return new Promise((resolve, reject) => {
    twitterClient.post('statuses/update', { status }, function (error) {
      if (error) reject(error)
      else resolve()
    })
  })
}

module.exports = {
  updateStatus
}
