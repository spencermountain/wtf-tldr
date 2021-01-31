const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-classify'))
wtf.extend(require('wtf-plugin-summary'))
wtf.extend(require('wtf-plugin-person'))

const toWikiText = require('./01-toWikiText')
const toFacts = require('./toFacts')
const output = require('./03-output')

const parsePage = function (xml, pageviews) {
  // parse xml
  let page = toWikiText(xml)
  // parse wikitext
  if (!page) {
    return {}
  }

  try {
    let doc = wtf(page.wiki)
    doc.title(page.title)
    doc.pageID(page.pageID)
    // parse-out data
    let popularity = pageviews[page.title]
    let facts = toFacts(doc, popularity)
    // write files
    output(facts, page.title)
    return { facts: Object.keys(facts).length, title: doc.title() }
  } catch (e) {
    console.log('\n\n======= Error ======')
    console.log(e)
    console.log('=======\n\n')
    return {}
  }
}
module.exports = parsePage
