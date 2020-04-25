const chalk = require('chalk')
const fetch = require('node-fetch')
const fs = require('fs')

const user = 'metye'
const apiKey = '0ae2a02cb6ec0686e560b365074020b3'

fetchData(user)

async function fetchData(user) {
  const start = new Date()
  const scrobbleList = []
  console.log(chalk.blue('[~]') + ' Fetching entire scrobbles from ' + chalk.cyan(user) + '...')
  const { recenttracks: firstReq } = await fetchRecentTracks(user, 1)
  const attr = firstReq['@attr']
  console.log(chalk.green('[✓]') + ' First request done.')
  console.log(chalk.magenta('[!]') + ' Total count: ' + chalk.cyan(attr.total))
  console.log(chalk.magenta('[!]') + ' Total pages: ' + chalk.cyan(attr.totalPages))
  console.log(chalk.magenta('[!]') + ' Total count: ' + chalk.cyan(attr.total))
  console.log(chalk.blue('[~]') + ' Starting to get pages...')

  const pageArray = [...new Array(Number(attr.totalPages)).keys()]

  const functions = []

  pageArray.forEach(p => {
    functions.push(async () => (new Promise(async resolve => {
      const page = p + 1
      // console.log(page)
      const pageStart = new Date().getTime()
      console.log(chalk.blue('[~]') + ' Fetching page ' + chalk.cyan(page) + '...')
      const res = await fetchRecentTracks(user, page)
      const pageRes = res.recenttracks

      if (!pageRes) console.log(res)

      try {
        scrobbleList.push(...pageRes.track.map(t => ({
          name: t.name,
          artist: t.artist['#text'],
          album: t.album['#text'],
          listenedAt: t.date ? t.date.uts * 1000 : 0
        })))

        const time = new Date().getTime() - pageStart
        console.log(chalk.green('[✓]') + ' Request done in ' + chalk.green(time) + 'ms.')
        resolve(true)
      } catch (e) {
        console.error(e)
        console.log(pageRes)
        return
      }
    })))
  })


  // console.log(functions)

  const chunks = functions.chunk(4)

  // await chunks[0]

  for (let i = 0; i < chunks.length; i++) {
    console.log(chalk.magenta('[!]') + ' Starting request for chunk ' + chalk.cyan(i) + ' of '
      + chalk.cyan(chunks.length + 1) + '.')
    await Promise.all(chunks[i].map(f => {
      return new Promise(async res => {
        await f()
        res()
      })
    }))
  }

  // const success = await Promise.all(functions)

  console.log(chalk.green('[✓]') + ' Scrobble list got a length of ' + chalk.green(scrobbleList.length) + '.')
  const data = JSON.stringify(scrobbleList)
  fs.writeFileSync('data.json', data)

  const allTime = new Date().getTime() - start
  console.log(chalk.green('[✓]') + ' Scrobble fetching finished in ' + chalk.green(allTime) + 'ms.')

}

async function fetchRecentTracks(u, page) {
  // console.log('PAGE > ' + page) / OOPS
  return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${u}&api_key=${apiKey}&page=${page}&format=json&limit=1000`)
    .then(r => r.json())
    .catch(e => console.error(e, page))
}

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    var temporal = [];

    for (var i = 0; i < this.length; i += chunkSize) {
      temporal.push(this.slice(i, i + chunkSize));
    }

    return temporal;
  }
});