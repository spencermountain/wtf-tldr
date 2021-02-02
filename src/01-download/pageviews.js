const fs = require('fs')
const wget = require('node-wget-promise')
const { blue, green, yellow } = require('colorette')
const { exec, test } = require('shelljs')
const { toName } = require('../_lib/fns')
let { lang, project } = require('../../config')
const file = `./files/pageviews.tsv`
const tsvOut = `./files/${lang}.${project}-pageviews.tsv`
const output = `./files/${lang}.${project}-pageviews.json`
const userPage = /^User:./
const userTalk = /^User talk:./
const catPage = /^Category:./

// create the filename for the last dump
const lastDump = () => {
  let d = new Date()
  d.setDate(d.getDate() - 10) // do yesterday
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const date = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}${month}${date}`
}

const ignorePage = function (title) {
  if (title === 'Main Page') {
    return true
  }
  if (userPage.test(title) || userTalk.test(title) || catPage.test(title)) {
    return true
  }
  return false
}

const toLookupTable = function () {
  let counts = {}
  let arr = fs.readFileSync(tsvOut).toString().split(/\n/)
  console.log(arr.length, ' tsv list')
  for (let i = 0; i < arr.length; i += 1) {
    let a = arr[i].split(' ')
    let title = a[1]
    if (title !== undefined && a[4] !== '1') {
      title = toName(title)
      let num = Number(a[4])
      // another filter
      if (ignorePage(title) === true) {
        continue
      }
      if (num <= 2) {
        continue
      }
      // mean += num
      counts[title] = num
    }
  }
  console.log('writing pageviews json')
  counts = JSON.stringify(counts, null, 2)
  fs.writeFileSync(output, counts)
  console.log('wrote pageviews json')
  // console.log('max', max)
  // console.log('mean', mean / Object.keys(counts).length)
  return counts
}

// d/l, unzip, and filter-down the pageviews file
module.exports = async function () {
  try {
    // use an already-downloaded file?
    if (test('-e', output)) {
      console.log(`using pagefiew file: '${file}'`)
      console.log(green(' done.'))
      return
    } else {
      // download dump
      console.log(blue(`.. downloading pageview dataset:   (~5 mins)`))
      let date = lastDump()
      const url = `https://dumps.wikimedia.org/other/pageview_complete/2021/2021-01/pageviews-${date}-user.bz2`
      await wget(url, {
        output: file + '.bz2',
      })
    }

    // unzip
    console.log(yellow(`\n unzipping pageviews data  (~4 mins)`))
    exec(`bzip2 -d  ${file}.bz2`)
    console.log(yellow(`\n finished unzipping pageviews`))

    //filter-it down to our project only
    exec(`grep '^${lang}.${project} .* desktop ' ${file} > ${tsvOut}`)

    // remove lines with only one pageview
    toLookupTable()

    // cleanup old files
    exec(`rm ${file}`)
    exec(`rm ${tsvOut}`)
  } catch (e) {
    console.log(e)
  }
}
module.exports()
