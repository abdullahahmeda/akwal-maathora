function getRandomInt (min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sleep (duration: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, duration))
}

exports.getRandomInt = getRandomInt
exports.sleep = sleep
