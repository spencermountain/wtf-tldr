const { blue, green, yellow } = require('colorette')
const { exec, test } = require('shelljs')
const wget = require('node-wget-promise')
const { printCLI } = require('../_lib/fns')
const file = `./files/pageviews.tsv.bz2`
const fs = require('fs')
let { lang } = require('../config')
let project = lang + '.wikipedia'
//' '

const fileName = () => {
  let d = new Date()
  d.setDate(d.getDate() - 10) // do yesterday
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const date = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}${month}${date}`
}

const toJSON = function () {
  let counts = {}
  let arr = fs
    .readFileSync(`./files/${project}-pageviews.tsv`)
    .toString()
    .split(/\n/)
  for (let i = 0; i < arr.length; i += 1) {
    let a = arr[i].split(' ')
    let title = a[1]
    if (title !== undefined && a[4] !== '1') {
      counts[title] = Number(a[4])
    }
  }
  return counts
}

// d/l, unzip, and filter-down the pageviews file
module.exports = async function () {
  try {
    // use an already-downloaded file?
    if (test('-e', `./files/${project}-pageviews.tsv`)) {
      console.log(`using file: '${file}'`)
      console.log(green(' done.'))
      // return
    } else {
      // download dump
      console.log(blue(`  downloading pageview dataset:   (~4 mins)`))
      let date = fileName()
      const url = `https://dumps.wikimedia.org/other/pageview_complete/2021/2021-01/pageviews-${date}-user.bz2`
      // const url = `https://dumps.wikimedia.org/other/pageviews/2021/2021-01/pageviews-${date}-000000.gz`
      await wget(url, {
        onProgress: (n) => printCLI(Math.round(n.percentage * 100) + '%'),
        output: file,
      })
    }

    // unzip
    console.log(yellow(`\n unzipping pageviews data  (~4 mins)`))
    exec(`bzip2 -d  ${file}`)
    // exec(`gunzip  ${file}`)

    //filter-it down to our project only
    let cmd = `grep '^${project} .* desktop ' ./files/pageviews.tsv > ./files/${project}-pageviews.tsv`
    exec(cmd)

    // remove lines with only one pageview
    let counts = JSON.stringify(toJSON(), null, 2)
    fs.writeFileSync(`./files/${project}-counts.json`, counts)

    // cleanup old files
    exec(`rm ./files/pageviews.tsv`)
    exec(`rm ./files/${project}-pageviews.tsv`)
  } catch (e) {
    console.log(e)
  }

  console.log(green(' done.'))
}
