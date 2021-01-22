const getDump = require('./01-download/dump')
const getPageViews = require('./01-download/pageviews')
const getRedirects = require('./01-download/redirects')
const start = require('./02-run/01-prepare')
let begin = new Date()

const timeSince = function () {
  let end = new Date()
  let sec = (end.getTime() - begin.getTime()) / 1000
  return sec / 60 //mins
}

// do it all!
;(async () => {
  console.log('\n\n')
  // download these at the same time
  console.log(
    `\n\n=============\n   Downloading + Unzipping data \n=============\n\n             \n   getting redirects, pageviews, and xml dump\n\n`
  )
  let dl = Promise.all([getDump(), getPageViews(), getRedirects()])
  // let dl = Promise.all([getRedirects()])
  dl.catch((e) => {
    console.log(e)
    process.exit(1)
  })
  dl.then(() => {
    start()
  }).then(() => {
    console.log(`finished in ${timeSince().toLocaleString()} mins`)
  })
})()
