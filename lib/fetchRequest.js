const fetch = require('node-fetch')
const { JOKES_API } = process.env

async function fetchJokes (url) {
  const headers = { Accept: 'application/json' }
  const jokes = await fetch(url, { headers })
    .then(res => res.json())
    .catch(err => console.error(err))
  return jokes
}

const fetchRandomJoke = async () => {
  const res = await fetchJokes(JOKES_API)
  console.log(res.joke)
  return res.joke
}

const fetchSearchTermJoke = async term => {
  const jokeSearch = `${JOKES_API}search?term=${term}`
  const jokes = await fetchJokes(jokeSearch)
    .then(res => res.json())
    .catch(err => console.error(err))
  console.log('Bunch of jokes', jokes)
  return response
}

module.exports = { fetchRandomJoke, fetchSearchTermJoke }
