const { workerData, parentPort } = require('worker_threads')

const { name } = workerData

const sleep = async function () {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.floor(Math.random() * 5000))
  })
}

// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"

;(async () => {
  console.log(workerData)
  // parentPort.postMessage({ init: name })
  console.log('started', name)
  await sleep()
  parentPort.postMessage({ hello: name })
  await sleep()
  // parentPort.postMessage({ bye: name })
})()
