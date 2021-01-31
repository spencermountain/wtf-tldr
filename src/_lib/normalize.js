// A positive z-score says the data point is above average.
const threshold = 0

const round = (n) => Math.round(n * 100) / 100

// z-score measures exactly how many standard deviations above or below the mean a data point is.
const normalize = function (obj) {
  let array = Object.values(obj)
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  const stdDev = Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  )
  console.log('mean', mean)
  console.log('stdDev', stdDev)
  let keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i += 1) {
    const num = obj[keys[i]]
    const zScore = (num - mean) / stdDev
    obj[keys[i]] = zScore
  }
  return obj
}

const cutByThreshold = function (obj) {
  obj = normalize(obj)
  let res = {}
  console.log(Object.keys(obj).length)
  Object.keys(obj).forEach((k) => {
    if (obj[k] > threshold) {
      res[k] = round(obj[k])
    }
  })
  console.log(Object.keys(res).length)
  return res
}

module.exports = cutByThreshold

// let tmp = {
//   foo: 12,
//   fooa: 2,
//   foob: 4,
//   foox: 14,
//   fooc: 2,
//   foobar: 1298,
//   foobaz: 2222,
// }
// console.log(normalize(tmp))

// let pageviews = require('../../files/simple.wikipedia-pageviews.json')
// pageviews = normalize(pageviews)
// console.log(cutByThreshold(pageviews))
