const { createServer } = require('http')
const fetch = require('node-fetch')
const rp = require('request-promise')
const express = require('express')
const app = express()
const server = createServer(app)
const bodyParser = require('body-parser')
const debug = require('debug')('joke-bot:server')
const Raven = require('raven')
DRIFT_ACCESS_TOKEN = 'lpFa0YKPLkBcdItuLcyAqruvUjaTFyCm'
DRIFT_CONVO_API = 'https://driftapi.com/v1/conversations'
DRIFT_VERIFICATION_TOKEN = 'yGgnhjsJSd8YTValWO4w0KUxZXWMxmwW'
JOKES_API = 'https://icanhazdadjoke.com/'

Raven.config(
  'https://ef897a7e139c44b6a597c6b6a65147bc@sentry.io/1249642'
).install()

app.use(Raven.requestHandler())

app.get('/', function mainHandler (req, res) {
  throw new Error('Broke!')
})

app.use(Raven.errorHandler())
app.use(bodyParser.json())

app.use(function onError (err, req, res, next) {
  console.error(err.message)
  res.status(500)
  res.end(`${res.sentry} ${err.message}` + '\n')
})

app.get('/joke', (_, response) => {
  response.send(`<style>body {display: flex;justify-content: center;
    align-items: center;} span {font-size: 45px;font-family: Arial;}</style>
    <span>🧚‍ We Are Live!, keep calm and code on 🧚</span>`)
})

app.post('/joke', ({ body }, response) => {
  const { token, type, orgId, data } = body

  debug('DATA_BODY', data.body)
  if (token === DRIFT_VERIFICATION_TOKEN) {
    if (
      type === 'new_message' &&
      data.body !== '<p>Okay, getting a joke asap!</p>'
    ) {
      handleMessage(data, orgId)
    }
  } else {
    debug('DRIFT_VERIFICATION_TOKEN mismatch')
    response.sendStatus(403)
  }
  return response.send('ok')
})

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

function sendDriftMessage (message, conversationId, orgId) {
  const driftMessage = {
    orgId: `${orgId}`,
    body: JSON.stringify(message),
    type: 'chat'
  }
  postResponse(driftMessage, conversationId)
}

function postResponse (message, conversationId) {
  const URL = `${DRIFT_CONVO_API}/${conversationId}/messages`

  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DRIFT_ACCESS_TOKEN}`
    },
    body: JSON.stringify(message)
  })
    .then(response => {
      response.text
    })
    .catch(err => console.error(err))
}

server.listen((PORT = 3000), () => {
  console.log(`> We're live on http://localhost:${PORT}`)
})

// const fetch = require('node-fetch')
// const rp = require('request-promise')
// ≈
// // const sendDriftMessage = require('./lib/fetchResponse')
// // const { fetchRandomJoke } = require('./lib/fetchRequest')

// const { DRIFT_VERIFICATION_TOKEN } = process.env
// const debug = require('debug')('joke-bot:server')
// const express = require('express')
// const app = express()
// const server = createServer(app)

// debug('booting ', app)
// const bodyParser = require('body-parser')

// // app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// app.get('/joke', (request, response) => {
//   response.send(`<style>body {display: flex;justify-content: center;
//     align-items: center;} span {font-size: 45px;font-family: Arial;}</style>
//     <span>🧚‍ We Are Live!, keep calm and code on 🧚</span>`)
// })

// app.post('/joke', ({ body }, response) => {
//   const { token, type, orgId, data } = body

//   debug('DATA_BODY', data.body)
//   if (token === DRIFT_VERIFICATION_TOKEN) {
//     if (
//       type === 'new_message' &&
//       data.body !== '<p>Okay, getting a joke asap!</p>'
//     ) {
//       handleMessage(data, orgId)
//       return
//     }
//   } else {
//     debug('DRIFT_VERIFICATION_TOKEN mismatch', response)
//     response.sendStatus(403)
//   }
// })

// server.listen((PORT = 3000), () => {
//   console.log(`> We're live on http://localhost:${PORT}`)
// })
// function fetchJokes(url) {
//   const headers = { Accept: 'application/json' }

//   // console.log('====================================')
//   // console.log('FETCH_JOKE_CALL', jokes)
//   // console.log('====================================')
//   return fetch(url, { headers })
//     .then(res => {
//       res.json()
//     })
//     .then(joke => console.log(joke))
//     .catch(err => console.error(err))
// }

// // function fetchJokes(url) {
// //   return fetch(url, {
// //     headers: {
// //       Accept: 'application/json',
// //     },
// //   })
// //     .then(res => res.json())
// //     .catch(err => err)
// // }

// // const fetchRandomJoke = function() {
// //   return fetchJokes(JOKES_API)
// // }

// // console.log('====================================')
// // console.log('RANDOM_JOKE_RESPONSE', res)
// // console.log('====================================')
// // debug('RESPONSE_JOKE', res.joke)https://icanhazdadjoke.com/
// const fetchRandomJoke = () => {
//   const res = fetchJokes('https://icanhazdadjoke.com/')
//   console.debug('hey ho lets go', res.joke)
//   return res.joke
// }

// const fetchSearchTermJoke = async term => {
//   const jokeSearch = `${JOKES_API}search?term=${term}`
//   const jokes = await fetchJokes(jokeSearch)
//     .then(res => res.json())
//     .catch(err => console.error(err))
//   debug('Bunch of %o jokes', jokes)
//   return response
// }

/// //////////////////////////////////////////////////////
// const fetch = require('node-fetch')
// const { DRIFT_ACCESS_TOKEN, DRIFT_CONVO_API } = process.env
// // const debug = require('debug')('server:fetchRESPONSE:joke')

// function sendDriftMessage(message, conversationId, orgId) {
//   const driftMessage = {
//     orgId: `${orgId}`,
//     body: JSON.stringify(message),
//     type: 'chat',
//   }
//   const resText = postResponse(driftMessage, conversationId)
//     .then(res => res.text())
//     .catch(err => console.error(err))
//   console.log('====================================')
//   debug('resText:', resText)
//   console.log('====================================')
//   return resText
// }

// function postResponse(message, conversationId) {
//   const URL = `${DRIFT_CONVO_API}/${conversationId}/messages`

//   console.log('====================================')
//   console.log('message', message)
//   console.log('====================================')
//   console.log('JSON.stringify(message)', JSON.stringify(message))

//   return fetch(URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${DRIFT_ACCESS_TOKEN}`,
//     },
//     body: JSON.stringify(driftMessage),
//   })
//     .then(response => {
//       response.text
//     })
//     .catch(err => console.error(err))
// }

// // const { fetchRandomJoke } = require('./lib/fetchRequest')
// // const sendDriftMessage = require('./lib/fetchResponse')

// const fetch = require('node-fetch')
// const {
//   DRIFT_ACCESS_TOKEN,
//   DRIFT_CONVO_API,
//   DRIFT_VERIFICATION_TOKEN,
//   JOKES_API,
// } = process.env
// const request = require('superagent')
// // const { DRIFT_VERIFICATION_TOKEN } = process.env
// const { createServer } = require('http')
// const debug = require('debug')('joke-bot:server')
// const express = require('express')
// const bodyParser = require('body-parser')
// const cors = require('cors')

// const app = express()
// const server = createServer(app)

// debug('booting ', app)
// app.use(cors({ origin: true, credentials: true }))
// app.options(cors({ origin: true, credentials: true }))
// // app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// app.get('/joke', async (_, response) => {
//   response.send(`<style>body {display: flex;justify-content: center;
//     align-items: center;} span {font-size: 45px;font-family: Arial;}</style>
//     <span>🧚‍ We Are Live!, keep calm and code on 🧚</span>`)
// })

// app.post('/joke', async ({ body }, response) => {
//   const { token, type, orgId, data } = body
//   console.log(data)
//   debug('data.conversationId', data.conversationId)
//   if (token === DRIFT_VERIFICATION_TOKEN) {
//     if (type === 'new_message') {
//       const randomJoke = fetchRandomJoke().catch(err => console.error(err))

//       postResponse(randomJoke, data.conversationId, orgId).catch(err => {
//         console.error(err)
//         process.exit(1)
//       })
//     }
//   } else {
//     debug('DRIFT_VERIFICATION_TOKEN mismatch', response)
//     response.sendStatus(403)
//   }
// })

// ////////--------  fetchRequests
// async function fetchJokes(url) {
//   debug('resolving %s by joke url', url)
//   const headers = { Accept: 'application/json' }
//   const resText = await fetch(url, { headers }).then(res => res.text()).catch(err => {
//     //   console.error(err)

//     // })
//   let resJSON

//   try {
//     resJSON = JSON.parse(resText)
//   } catch (error) {
//     throw error
//     process.exit(1)
//   }
//   //

//     debug('fetch JOKES', resJSON)
//   return resJSON
// })
// }

// const fetchRandomJoke = async () => {
//   const res = await fetchJokes(JOKES_API)
//   debug('RESPONSIBLE res.joke', res.joke)
//   return res.joke
// }

// const fetchSearchTermJoke = async term => {
//   const jokeSearch = `${JOKES_API}search?term=${term}`
//   const jokes = await fetchJokes(jokeSearch)
//     .then(res => res.json())
//     .catch(err => {
//       console.error(err)
//       process.exit(1)
//     })
//   debug('Bunch of %o jokes', jokes)
//   return response
// }

// ////////--------  fetchResponse
// function sendDriftMessage(driftMessage, conversationId, orgId) {
//   const driftMessage = {
//     orgId: orgId,
//     body: JSON.stringify(message),
//     type: 'chat',
//   }
//   const dirty = await postResponse(driftMessage, conversationId, orgId)

//   return
// }

// // async function postResponse(url, driftMessage, orgId) {
//   const responseEndpoint = `${DRIFT_CONVO_API}/${conversationId}/messages`

// //   let bread
// //   bread = await fetch(url, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       Authorization: `Bearer ${DRIFT_ACCESS_TOKEN}`,
// //     },
// //     body: JSON.stringify(driftMessage),
// //     type: 'chat',
// //     orgId: `${orgId}`,
// //   })
// //     .then(response => {
// //       response
// //     })
// //     .catch(err => console.error(err))
// //   return bread
// // }

// ////////--------  fetchResponse

// // function postResponse(message, conversationId, orgId) {
// //   // Send the Drift message. Finally!
// //   // .post(`${DRIFT_CONVO_API}/${conversationId}/messages`)
// //   debug('XXXXXXXXXXXXXXXXXXXXXXXXXXXXMMMMMMMMM', message)
// //   debug('XXXXXXXXXXXXXXXXXXXXXXXXXXXX', JSON.stringify(message, null, 4))
// //   console.log('====================================')
// //   debug('XXXXXXXXXXXXXXXXXXXXXXXXXXXX-PARSE', JSON.parse(message))
// //   console.log('====================================')

// //   const driftMessage = {
// //     orgId: orgId,
// //     body: JSON.stringify(message),
// //     type: 'chat',
// //   }

// //   request
// //     .post(DRIFT_CONVO_API + `/${conversationId}/messages`)
// //     .set('Content-Type', 'application/json')
// //     .set(`Authorization`, `bearer ${DRIFT_ACCESS_TOKEN}`)
// //     .send(driftMessage)
// //     .catch(err => console.log(err))
// //   return
// // }

// server.listen((PORT = 4000), () => {
//   console.log(`> We're live on http://localhost:${PORT}`)
//   process.on('SIGTERM', () => {
//     console.log('> Shutting down')
//     server.close()
//   })
// })

// function handleMessage(orgId, data) {

//   if (message.subtype) {
//     const subtype = message.subtype
//     if (message.subtype === 'message_changed') {
//       message.message.channel = message.channel // needs to be copied across
//       message = message.message
//     }
//     if (message.subtype === 'message_deleted') {
//       // stick something in `text` so it can carry on
//       message.previous_message.channel = message.channel
//       message = message.previous_message
//       message.subtype = subtype
//     }
//   }

//   if (message.user === bot.self.id) {
//     return
//   }

//   let text = (message.text || '').trim()
//   if (!text) {
//     debug('message empty')
//     return
//   }

//   if (!inRetro) {
//     if (isDM(message)) {
//       // debug('> got message whilst not in retro');
//       if (message.reply_to) {
//         return // ignore
//       }
//       debug('> got a DM: %s', message.text)
//       return notInRetro(message)
//     }

//     if (!isToBot(text)) {
//       return
//     }
//   }

//   if (isDM(message)) {
//     debug('> got retrospective message: %s', message.text)
//     // capture the rerto data
//     return captureRetrospective(message)
//   } else if (isToBot(text)) {
//     debug('> got potential command: %s', message.text)
//     // else we're in the retro, parse the data
//     return command(message)
//   }
// }
