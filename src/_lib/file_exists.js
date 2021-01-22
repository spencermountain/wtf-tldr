const https = require('https')

// use the native nodejs request function
const request = function (url, opts = {}) {
  return new Promise((resolve, reject) => {
    https
      .get(url, opts, (resp) => {
        let status = String(resp.statusCode) || ''
        let bool = /^[23]/.test(status)
        resolve(bool)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

// test if the file url exists or not
const fileExists = function (url) {
  return request(url, {
    method: 'HEAD',
  }).catch((e) => {
    console.error(e)
  })
}
module.exports = fileExists

// ;(async () => {
//   let bool = await fileExists(
//     'https://downloads.dbpedia.org/repo/dbpedia/generic/redirects/2020.12.01/redirects_lang=en.ttl.bz2'
//   )
//   console.log(bool)
// })()
