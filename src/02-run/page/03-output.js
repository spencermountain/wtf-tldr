const fs = require('fs')

const encode = require('../../_lib/fns').encode

const output = function (facts, title) {
  if (!title) {
    console.log('missing doc title')
    return
  }
  title = encode(title)
  Object.keys(facts).forEach((k) => {
    let path = `./results/${k}/${title}.json`
    fs.writeFileSync(path, JSON.stringify(facts[k], null, 2))
  })
}
module.exports = output
