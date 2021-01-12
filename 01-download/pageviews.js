const { blue, green, yellow } = require('colorette')
const { exec, test } = require('shelljs')
const wget = require('node-wget-promise')
const { printCLI, decode } = require('../_lib/fns')
const file = `./files/pageviews.tsv`
const fs = require('fs')
let { lang } = require('../config')
let project = lang + '.wikipedia'
const tsvOut = `./files/${project}-pageviews.tsv`
const output = `./files/${project}-pageviews.json`

// create the filename for the last dump
const lastDump = () => {
  let d = new Date()
  d.setDate(d.getDate() - 10) // do yesterday
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const date = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}${month}${date}`
}

const toLookupTable = function () {
  let counts = {}
  let arr = fs.readFileSync(tsvOut).toString().split(/\n/)
  for (let i = 0; i < arr.length; i += 1) {
    let a = arr[i].split(' ')
    let title = a[1]
    if (title !== undefined && a[4] !== '1') {
      title = decode(title)
      counts[title] = Number(a[4])
    }
  }
  counts = JSON.stringify(counts, null, 2)
  fs.writeFileSync(output, counts)
  return counts
}

// d/l, unzip, and filter-down the pageviews file
module.exports = async function () {
  try {
    // use an already-downloaded file?
    if (test('-e', output)) {
      console.log(`using file: '${file}'`)
      console.log(green(' done.'))
      return
    } else {
      // download dump
      console.log(blue(`  downloading pageview dataset:   (~5 mins)`))
      let date = lastDump()
      const url = `https://dumps.wikimedia.org/other/pageview_complete/2021/2021-01/pageviews-${date}-user.bz2`
      await wget(url, {
        onProgress: (n) =>
          '  pageviews: ' + printCLI(Math.round(n.percentage * 100) + '%'),
        output: file + '.bz2',
      })
    }

    // unzip
    console.log(yellow(`\n unzipping pageviews data  (~4 mins)`))
    exec(`bzip2 -d  ${file}.bz2`)

    //filter-it down to our project only
    exec(`grep '^${project} .* desktop ' ${file} > ${tsvOut}`)

    // remove lines with only one pageview
    toLookupTable()

    // cleanup old files
    exec(`rm ${file} && rm ${tsvOut}`)
  } catch (e) {
    console.log(e)
  }

  console.log(green(' done.'))
}
