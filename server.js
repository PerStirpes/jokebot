const { createServer } = require('http')
const fetch = require('node-fetch')
const rp = require('request-promise')
const express = require('express')
const app = express()
const server = createServer(app)
const bodyParser = require('body-parser')
const debug = require('debug')('joke-bot:server')
const Raven = require('raven')

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
