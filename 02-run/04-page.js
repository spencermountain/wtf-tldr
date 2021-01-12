const wtf = require('wtf_wikipedia')
wtf.extend(require('wtf-plugin-classify'))
wtf.extend(require('wtf-plugin-summary'))
const wantNamespace = new RegExp('<ns>0</ns>')

//doesn't support fancy things like &copy; to ©, etc
const escapeXML = function (str) {
  return str
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
}

//is it a different namespace?
const shouldSkip = function (page) {
  if (wantNamespace.test(page) === false) {
    return true
  }
  return false
}

//wikipedia xml → json
const parsePage = function (txt) {
  //skip redirects, etc
  if (shouldSkip(txt) === true) {
    return null
  }
  let wiki = ''
  const metadata = {
    title: null,
    pageID: null,
  }
  //get page title
  let m = txt.match(/<title>([\s\S]+?)<\/title>/)
  if (m !== null) {
    metadata.title = m[1]
  } else {
    console.log('--no title found--')
  }
  //get page id
  m = txt.match(/<id>([0-9]*?)<\/id>/)
  if (m !== null) {
    metadata.pageID = m[1]
  } else {
    console.log('--no page id--')
  }
  //get wiki text
  m = txt.match(/<text ([\s\S]*?)<\/text>/)
  if (m !== null) {
    m[1] = m[1].replace(/^.*?>/, '')
    wiki = m[1]
  }
  // improve escaping
  wiki = escapeXML(wiki)
  // parse it into a doc
  return wtf(wiki, metadata)
}
module.exports = parsePage
