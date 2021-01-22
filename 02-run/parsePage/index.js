const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-classify'))
wtf.extend(require('wtf-plugin-summary'))

const toWikiText = require('./01-toWikiText')
const toFacts = require('./02-toFacts')
const output = require('./03-output')

const parsePage = function (xml) {
  // parse xml
  let wiki = toWikiText(xml)
  // parse wikitext
  let doc = wtf(wiki)
  // parse-out data
  let facts = toFacts(doc)
  // write files
  output(facts)
  return { facts: facts.length, title: doc.title() }
}
module.exports = parsePage
