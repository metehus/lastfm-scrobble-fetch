# lastfm-scrobble-fetch
A little project i did to just test the api
It gets all the scrobbles from an user on last.fm, using user.GetRecentTracks and chunking them to not get rate limited.

In case if you want to use it, heres a quick step:

1. Have node.js installed with npm
2. Clone the repo and install packages using `npm install`
3. Create a `.env` file and put your last.fm api key there. Like this: `LASTFM_KEY=fe98d9f8e9df8af989d8ef88d8fa`
4. Make sure to create a `data.json` file in the downloaded repository folder.
5. Make sure the `data.json` has also `[]` as content
6. To fetch scrobbles, use `npm start fetch {LASTFM USER}`
7. To see artist information, use `npm start artist {ARTIST NAME}`
   Note: if your artist has more than one word(or spaces), use in quotes like: `npm start artist "Kali Uchis"`