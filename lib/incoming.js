const fetch = require('node-fetch')
const rp = require('request-promise')
const { JOKES_API } = process.env
const { sendDriftMessage } = require('./outgoing')
const debug = require('debug')('server:incoming:jokes')

// handle incoming request, get joke resource
function handleMessage (data, orgId) {
  const options = {
    uri: JOKES_API,
    headers: {
      'User-Agent': 'Request-Promise',
      Accept: 'application/json'
    },
    json: true
  }

  rp(options)
    .then(response => {
      const { joke } = response
      return sendDriftMessage(joke, data.conversationId, orgId)
    })
    .catch(function (err) {
      throw new Error('something went wrong with rp' + err)
    })
}

module.exports = { handleMessage }

// below are some skeletons, I abandoned my first async attempt at the assignment
async function fetchJokes (url) {
  debug('resolving %s by joke url', url)
  const headers = { Accept: 'application/json' }
  const jokes = await fetch(url, { headers })
    .then(res => res.json())
    .catch(err => console.error(err))
  return jokes
}

const fetchRandomJoke = async () => {
  const res = await fetchJokes(JOKES_API)
  debug(res.joke)
  return res.joke
}

const fetchSearchTermJoke = async term => {
  const jokeSearch = `${JOKES_API}search?term=${term}`
  const jokes = await fetchJokes(jokeSearch)
    .then(res => res.json())
    .catch(err => console.error(err))
  debug('Bunch of %o jokes', jokes)
  return response
}
