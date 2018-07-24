const fetch = require('node-fetch')
const { JOKES_API } = process.env

async function fetchJokes (url) {
  const headers = { Accept: 'application/json' }
  const res = await fetch(url, { headers })
  const jokes = await res.json()
  return jokes
}

const fetchRandomJoke = async () => {
  const res = await fetchJokes(JOKES_API)
  return res.joke
}

const fetchSearchTermJoke = async term => {
  const jokeSearch = `${JOKES_API}search?term=${term}`
  const response = await fetchJokes(jokeSearch).catch(err => console.error(err))
  return response
}

module.exports = { fetchRandomJoke, fetchSearchTermJoke }
