const program = require('commander')
const package = require('./package.json')

const fetchData = require('./fetchData.js')
const getArtistInfo = require('./getArtistInfo.js')

program.version(package.version)
program
  .command('fetch [user]')
  .description('Fetches scrobbles from a last.fm user')
  .action(user => {
    fetchData(user)
  })

program
  .command('artist [artist]')
  .description('Fetches scrobbles from a last.fm user')
  .action(artist => {
    getArtistInfo(artist)
  })

program.parse(process.argv)
