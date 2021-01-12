const fs = require('fs')
const os = require('os')
const count = os.cpus().length
const runPool = require('./02.pool')
let { lang } = require('../config')
const file = `./files/${lang}-pages-dump.xml`

// split dump into chunks
let filesize = fs.statSync(file)['size']
let chunkSize = Math.floor(filesize / count)

let workers = []
for (let i = 0; i < count; i += 1) {
  let startByte = chunkSize * i
  workers.push({
    n: i,
    start: startByte,
    end: startByte + chunkSize,
    file: file,
  })
}
runPool(workers)
