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
const parsePage = function (xml) {
  //skip redirects, etc
  if (shouldSkip(xml) === true) {
    return null
  }
  let wiki = ''
  const metadata = {
    title: null,
    pageID: null,
  }
  //get page title
  let m = xml.match(/<title>([\s\S]+?)<\/title>/)
  if (m !== null) {
    metadata.title = m[1]
  } else {
    console.log('--no title found--')
  }
  //get page id
  m = xml.match(/<id>([0-9]*?)<\/id>/)
  if (m !== null) {
    metadata.pageID = m[1]
  } else {
    console.log('--no page id--')
  }
  //get wiki text
  m = xml.match(/<text ([\s\S]*?)<\/text>/)
  if (m !== null) {
    m[1] = m[1].replace(/^.*?>/, '')
    wiki = m[1]
  }
  // improve escaping
  wiki = escapeXML(wiki)
  metadata.wiki = wiki
  return metadata
}
module.exports = parsePage
