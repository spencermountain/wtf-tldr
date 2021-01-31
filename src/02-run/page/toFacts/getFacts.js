const buildFacts = {
  // Person: (doc) => {
  //   return {
  //     title: doc.title(),
  //     birthDate: doc.birthDate(),
  //     birthPlace: doc.birthPlace(),
  //     isAlive: doc.isAlive(),
  //     deathDate: doc.deathDate(),
  //     deathPlace: doc.deathPlace(),
  //   }
  // },
  // 'Person/Athlete': () => {},
  'Person/Actor': (doc) => {
    return {
      title: doc.title(),
      birthDate: doc.birthDate(),
      birthPlace: doc.birthPlace(),
      isAlive: doc.isAlive(),
      deathDate: doc.deathDate(),
      deathPlace: doc.deathPlace(),
    }
  },
  // 'Person/Artist': () => {},
  // 'Person/Politician': () => {},
  // 'Place/City': () => {},
  // 'CreativeWork/Album': () => {},
  // 'CreativeWork/TVShow': () => {},
  // 'Person/Academic': () => {},
  // Organization: () => {},
  // 'Organization/PoliticalParty': () => {},
}

module.exports = buildFacts
