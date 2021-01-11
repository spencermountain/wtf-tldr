// a self-updating command-line
function printCLI(txt) {
  if (process.stdout && process.stdout.clearLine) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(txt)
  }
}

module.exports = { printCLI: printCLI }
