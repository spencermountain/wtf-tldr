let str = `<http://af.dbpedia.org/resource/01-10> <http://dbpedia.org/ontology/wikiPageRedirects> <http://af.dbpedia.org/resource/10_Januarie> .`
const reg = /^<https?:\/\/[a-z]+\.dbpedia\.org\/resource\/([^>]+)> <http:\/\/dbpedia.org\/ontology\/wikiPageRedirects> <http:\/\/[a-z]+\.dbpedia\.org\/resource\/([^>]+)>/
console.log(str.match(reg))


sed 's/<http:\/\/(af)\.dbpedia.org\/resource\//\1/g' ./files/af.wikipedia-redirects.ttl

