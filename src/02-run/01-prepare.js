const fs = require('fs')
const os = require('os')
const { exec } = require('shelljs')
const count = os.cpus().length
const runPool = require('./02.pool')
let { lang, project, fresh } = require('../../config')
const file = `./files/${lang}.${project}-dump.xml`

const cleanupDirs = function () {
  if (fresh) {
    exec('rm -rf ./results')
    fs.mkdirSync('./results')
    fs.mkdirSync('./results/common')
  }
  let properties = ['/common/name', '/common/summary', '/common/class']
  properties.forEach((prop) => {
    let dir = './results' + prop
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  })
}

const start = function () {
  // start fresh
  cleanupDirs()
  // split dump into chunks
  let filesize = fs.statSync(file)['size']
  let chunkSize = Math.floor(filesize / count)
  console.log(
    `\n\n=============\n   parsing xml dump \n=============\n\n             \n   creating ${count} workers\n\n`
  )
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
}
module.exports = start
