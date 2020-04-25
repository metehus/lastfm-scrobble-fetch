const chalk = require('chalk')
const fetch = require('node-fetch')
const fs = require('fs')


const apiKey = '0ae2a02cb6ec0686e560b365074020b3'
  
getArtistStats('Tame Impala')

async function getArtistStats(artist) {
  const start = new Date()
  console.log(chalk.blue('[~]') + ' Getting scrobbling status from ' + chalk.cyan(artist) + '...')
  const scrobbles = require('./data.json')
  // console.log(scrobbles[0], artist)
  const filtered = flatten(scrobbles).filter(t => t.artist.toLowerCase() === artist.toLowerCase())
  
  // console.log(filtered, filtered.length)
  console.log(chalk.magenta('[!]') + ' Total scrobbles: ' + chalk.cyan(filtered.length + 1))
  console.log(chalk.magenta('[!]') + ' First scrobble at: ' + chalk.cyan(getDate(filtered[filtered.length - 1].listenedAt)))
  console.log(chalk.magenta('[!]') + ' Last scrobble at: ' + chalk.cyan(getDate(filtered[0].listenedAt)))
  
  const allTime = new Date().getTime() - start
  console.log(chalk.green('[✓]') + ' Fetched information in ' + chalk.green(allTime) + 'ms.')
  
}

function getDate(date) {
  return new Date(date).toISOString().
  replace(/T/, ' ').      // replace T with a space
  replace(/\..+/, '')
}


function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}