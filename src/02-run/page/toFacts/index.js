const getFacts = require('./getFacts')

// const metaFact = function (doc, facts) {
//   return {
//     title: doc.title(),
//     summary: doc.summary(),
//     facts: Object.keys(facts),
//   }
// }

const toFacts = function (doc, popularity) {
  let facts = {}
  let category = doc.classify().category
  if (category) {
    if (getFacts.hasOwnProperty(category) === true) {
      facts[category] = getFacts[category](doc)
    }
    let root = category.split('/')[0]
    if (getFacts.hasOwnProperty(root) === true) {
      facts[root] = getFacts[root](doc)
    }
  }
  Object.keys(facts).forEach((k) => {
    facts[k].popularity = popularity
  })

  // every page has this fact
  // facts['meta'] = metaFact(doc, facts)

  return facts
}
module.exports = toFacts
