const getDump = require('./01-download/dump')
const getPageViews = require('./01-download/pageviews')
const getRedirects = require('./01-download/redirects')
const start = require('./02-run/01-prepare')

// do it all!
;(async () => {
  console.log('\n\n')
  // download these at the same time
  // let dl = Promise.all([getDump(), getPageViews(), getRedirects()])
  let dl = Promise.all([getRedirects()])
  // dl.catch((e) => {
  //   console.log(e)
  //   process.exit(1)
  // })
  // dl.then(() => {
  //   start()
  // })
})()
