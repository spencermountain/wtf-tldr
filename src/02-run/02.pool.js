const { Worker } = require('worker_threads')
const util = require('util')
const { printCLI } = require('../_lib/fns')
let pages = 0

const eachPage = function () {
  pages += 1
}

function startWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__dirname + '/03-worker.js', { workerData: data })
    worker.on('message', eachPage)
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
  let workers = []
  workers = arr.map((obj) => startWorker(obj))
  // poll our workers for their status
  let monitor = setInterval(() => {
    let pending = workers.filter((p) => util.inspect(p).includes('pending'))
    printCLI(
      `${pages.toLocaleString()} pages processed, ${
        pending.length
      } workers running\n\n`
    )
  }, 1500)

  Promise.all(workers).then(() => {
    console.log('\n\n all workers done.')
    clearInterval(monitor)
    console.log(`======== finished ${pages.toLocaleString()} pages ======`)
  })
}

module.exports = run
