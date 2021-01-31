const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-classify'))
wtf.extend(require('wtf-plugin-summary'))

const toWikiText = require('./01-toWikiText')
const toFacts = require('./toFacts')
const output = require('./03-output')

const parsePage = function (xml) {
  // parse xml
  let page = toWikiText(xml)
  // parse wikitext
  if (!page) {
    return {}
  }
  let doc = wtf(page.wiki)
  doc.title(page.title)
  doc.pageID(page.pageID)
  // parse-out data
  let facts = toFacts(doc)
  // write files
  output(facts, page.title)
  return { facts: Object.keys(facts).length, title: doc.title() }
}
module.exports = parsePage
