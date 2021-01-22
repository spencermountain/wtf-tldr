const fs = require('fs')
const wget = require('node-wget-promise')
const fileExists = require('../_lib/file_exists')
const streamFile = require('../_lib/stream_file')
const { blue, yellow } = require('colorette')
const { exec, test } = require('shelljs')
const { lang, project } = require('../../config')
const { printCLI } = require('../_lib/fns')
const file = `./files/${lang}.${project}-redirects.ttl.bz2`
const out = `./files/${lang}.${project}-redirects.json`
const tmpFile = file.replace(/\.bz2$/, '')

// create the filename for the last dump
const lastMonth = () => {
  let d = new Date()
  d.setDate(d.getMonth() - 1) // do last month
  const month = `${d.getMonth()}`.padStart(2, '0')
  return `${d.getFullYear()}.${month}.01`
}

const toLookupTable = async function () {
  const reg = /^<https?:\/\/[a-z]+\.dbpedia\.org\/resource\/([^>]+)> <http:\/\/dbpedia.org\/ontology\/wikiPageRedirects> <http:\/\/[a-z]+\.dbpedia\.org\/resource\/([^>]+)>/i
  let final = {}
  await streamFile(tmpFile, (ttl) => {
    let m = ttl.match(reg)
    if (m !== null) {
      let to = m[2].replace(/_/g, ' ')
      let from = m[1].replace(/_/g, ' ')
      // remove case-only redirects
      if (to.toLowerCase() === from.toLowerCase()) {
        return
      }
      final[to] = final[to] || []
      final[to].push(from)
    }
  })
  final = JSON.stringify(final)
  fs.writeFileSync(out, final)
  return
}

module.exports = async function () {
  // use an already-downloaded file?
  if (test('-e', out)) {
    console.log(yellow(`using redirect file: '${file}'`))
    return
  }
  // download dump
  console.log(blue(`.. downloading ${lang} redirects from dbpedia`))
  let url = `https://downloads.dbpedia.org/repo/dbpedia/generic/redirects/${lastMonth()}/redirects_lang%3d${lang}.ttl.bz2`
  let exists = await fileExists(url)
  if (!exists) {
    console.log('Using an older redirect file from dbpedia')
    url = `https://downloads.dbpedia.org/repo/dbpedia/generic/redirects/2020.12.01/redirects_lang%3d${lang}.ttl.bz2` //use a backup file
  }
  await wget(url, {
    onProgress: (n) => {
      printCLI('   dump: ' + Math.round(n.percentage * 100) + '%')
    },
    output: file,
  })
  // unzip
  console.log(yellow(`\n unzipping ${lang} redirects`))
  exec(`bzip2 -d ${file}`)
  console.log(yellow(`\n finished unzipping ${lang} redirects`))

  // remove lines with only one pageview
  await toLookupTable()

  // cleanup old files
  exec(`rm ${tmpFile}`)
}
