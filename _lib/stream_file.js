const sundayDriver = require('sunday-driver')

const streamFile = function (path, each) {
  const driver = {
    file: path,
    each: (ttl, resume) => {
      each(ttl)
      resume()
    },
  }
  const p = sundayDriver(driver)
  p.catch((err) => {
    console.log(err)
  })
  return p
}
module.exports = streamFile
