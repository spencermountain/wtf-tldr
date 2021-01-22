const fs = require('fs')

const output = function (facts) {
  facts.forEach((a) => {
    if (a[1] && a[0]) {
      let path = `./results/${a[1]}/${a[0]}`
      fs.writeFileSync(path, JSON.stringify(a[2], null, 2))
    }
  })
}
module.exports = output
