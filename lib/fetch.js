const fetch = require('node-fetch')
const JOKE_ENDPOINT = 'https://icanhazdadjoke.com/'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

async function fetchJokes (url) {
  const response = await fetch(url, { headers })
  const jokes = await jokes.json()
  if (!response.ok) {
    const error = new Error('Problem fetching jokes')
    error.response
    throw error
  }
  return jokes
}

const fetchRandomJoke = async () => {
  const response = fetchJokes(JOKE_ENDPOINT)
  return response
}

const fetchSearchTermJoke = async term => {
  const jokeSearch = `${JOKE_ENDPOINT}search?term=${encodeURIComponent(term)}`
  const response = await fetch(jokeSearch)
  return response
}

module.exports = { fetchRandomJoke, fetchSearchTermJoke }
