const { Worker } = require('worker_threads')
const util = require('util')
const fs = require('fs')
let writeStream = fs.createWriteStream('./output', { flags: 'a' })

function startWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__dirname + '/worker.js', { workerData: data })
    worker.on('message', (msg) => {
      console.log(msg)
      writeStream.write(msg)
    })
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      } else {
        resolve()
      }
    })
  })
}

const run = function (arr) {
  let workers = arr.map((obj) => startWorker(obj))
  // poll our workers for their status
  let monitor = setInterval(() => {
    let pending = workers.filter((p) => util.inspect(p).includes('pending'))
    console.log(`${pending.length} running`)
  }, 500)

  Promise.all(workers).then((values) => {
    console.log(values)
    console.log('workers done')
    clearInterval(monitor)
  })
}

module.exports = run
