const { blue, yellow } = require('colorette')
const { exec, test } = require('shelljs')
const wget = require('node-wget-promise')
const { lang, project } = require('../../config')
const { printCLI } = require('../_lib/fns')
const file = `./files/${lang}.${project}-dump.xml.bz2`

module.exports = async function () {
  // use an already-downloaded file?
  if (test('-e', file.replace(/\.bz2$/, ''))) {
    console.log(yellow(`using dump file: '${file}'`))
    return
  }
  // download dump
  console.log(blue(`.. downloading ${lang} dump`))
  const url = `https://dumps.wikimedia.org/${lang}wiki/latest/${lang}wiki-latest-pages-articles.xml.bz2`
  await wget(url, {
    onProgress: (n) =>
      printCLI('   dump: ' + Math.round(n.percentage * 100) + '%'),
    output: file,
  })
  // unzip
  console.log(yellow(`\n\n unzipping ${lang} dump`))
  exec(`bzip2 -d ${file}`)
  console.log(yellow(`\n finished unzipping ${lang} dump`))
}
