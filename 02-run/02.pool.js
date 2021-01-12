const { Worker } = require('worker_threads')
const util = require('util')
const fs = require('fs')
const { exec, test } = require('shelljs')
const { printCLI } = require('../_lib/fns')

let output = './results/output.ndjson'

// delete existing result
if (test('-e', output)) {
  exec(`rm ${output}`)
}
let writeStream = fs.createWriteStream(output, {
  flags: 'a',
})

const writeData = function (msg) {
  writeStream.write(JSON.stringify(msg) + '\n')
}

function startWorker(data, cb) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__dirname + '/03-worker.js', { workerData: data })
    worker.on('message', writeData)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      cb()
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      } else {
        resolve()
      }
    })
  })
}

const run = function (arr) {
  let workers = []
  let cb = () => {
    let pending = workers.filter((p) => util.inspect(p).includes('pending'))
    console.log(`${pending.length} running`)
  }
  workers = arr.map((obj) => startWorker(obj, cb))
  // poll our workers for their status
  let monitor = setInterval(() => {
    let pending = workers.filter((p) => util.inspect(p).includes('pending'))
    printCLI(`${pending.length} running`)
  }, 1500)

  Promise.all(workers).then(() => {
    console.log('workers done')
    clearInterval(monitor)
  })
}

module.exports = run
