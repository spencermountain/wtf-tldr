const toFacts = function (doc) {
  // let title = doc.title()
  // let category = doc.classify().category

  let facts = {}
  facts['meta/summary'] = {
    text: doc.summary(),
  }
  facts['meta/facts'] = {
    facts: Object.keys(facts),
  }

  return facts
}
module.exports = toFacts
