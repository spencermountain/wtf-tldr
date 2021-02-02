// a self-updating command-line
const printCLI = function (txt) {
  if (process.stdout && process.stdout.clearLine) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(txt)
  }
}

//wikipedia title escaping
const encode = function (title = '') {
  title = title.replace(/ /g, '_')
  title = title.trim()
  title = encodeURIComponent(title)
  return title
}

//wikipedia title escaping
const decode = function (title = '') {
  title = title.replace(/_/g, ' ')
  title = title.trim()
  title = decodeURIComponent(title)
  return title
}

//tot to internal id/file path
const toID = function (title = '') {
  title = title.replace(/ /g, '_')
  title = title.trim()
  return title
}

//tot to internal id
const toName = function (title = '') {
  title = title.replace(/_/g, ' ')
  title = title.trim()
  return title
}

// wait a second
const sleep = function (ms = 1500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = {
  printCLI: printCLI,
  encode: encode,
  decode: decode,
  toID: toID,
  toName: toName,
  sleep: sleep,
}
