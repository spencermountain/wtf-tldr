const { toID } = require('../../_lib/fns')

const toFacts = function (doc) {
  let title = doc.title() || ''
  let id = toID(title)
  let facts = [
    [id, '/common/name', { title: title }],
    [id, '/common/summary', { summary: doc.summary(), cats: doc.categories() }],
    [id, '/common/class', doc.classify()],
  ]
  return facts
}
module.exports = toFacts
