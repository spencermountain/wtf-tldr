const getDump = require('./01-download/dump')
const getPageViews = require('./01-download/pageviews')

// do it all!
;(async () => {
  console.log('\n\n')
  await getDump()
  await getPageViews()
})()
