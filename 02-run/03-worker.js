const { workerData, parentPort } = require('worker_threads')
const { yellow, red, magenta } = require('colorette')
const sundayDriver = require('sunday-driver')
const parsePage = require('./04-page')
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

let pages = 0

const driver = {
  file: workerData.file,
  start: workerData.start,
  end: workerData.end,
  splitter: '</page>',
  each: (xml, resume) => {
    pages += 1
    let doc = parsePage(xml)
    if (doc !== null) {
      let classify = doc.classify()
      let title = doc.title()
      let json = {
        worker: workerData.n,
        title: title,
        popularity: pageViews[title],
        summary: doc.summary(),
        category: classify.category,
        confidence: classify.score,
      }
      parentPort.postMessage(json)
    }
    resume()
  },
}

// logger
// console.log(
//   magenta(` worker #${workerData.n} @ ${pages.toLocaleString()} pages`)
// )

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
  console.log(yellow(`\n=-=-=- worker #${workerData.n} done =-=-=-`))
})
