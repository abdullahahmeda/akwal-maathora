function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sleep (duration) {
  return new Promise((resolve, reject) => setTimeout(resolve, duration))
}

exports.getRandomInt = getRandomInt
exports.sleep = sleep
