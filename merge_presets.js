const fs = require('fs')

const presets = []

fs.readdirSync('./presets')
  .forEach(function(file) {
    const json = require('./presets/' + file)
    presets.push(json)
  })

fs.writeFileSync('./client/src/presets.json', JSON.stringify(presets, null, 2))


