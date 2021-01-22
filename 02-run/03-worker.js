const { workerData, parentPort } = require('worker_threads')
const { yellow, red } = require('colorette')
const sundayDriver = require('sunday-driver')
const parsePage = require('./parsePage')
let { lang, project } = require('../config')
const fs = require('fs')
let pageViews = {}

// load these
const getPageViews = function () {
  let str = fs
    .readFileSync(`./files/${lang}.${project}-pageviews.json`)
    .toString()
  return JSON.parse(str)
}

const driver = {
  file: workerData.file,
  start: workerData.start,
  end: workerData.end,
  splitter: '</page>',
  each: (xml, resume) => {
    let meta = parsePage(xml)
    parentPort.postMessage(meta)
    resume()
  },
}
pageViews = getPageViews()

const p = sundayDriver(driver)
p.catch((err) => {
  console.log(red('\n\n========== Worker error!  ====='))
  console.log('🚨       worker #' + workerData.n + '           🚨')
  console.log(err)
  console.log('\n\n')
})
p.then(() => {
  // clearInterval(monitor)
  console.log(yellow(`\n\n 👍 worker #${workerData.n} done.`))
})
