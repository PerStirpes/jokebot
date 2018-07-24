const { createServer } = require('http')
const sendDriftMessage = require('./lib/fetchResponse')
const { fetchRandomJoke } = require('./lib/fetchRequest')

const { DRIFT_VERIFICATION_TOKEN } = process.env
const debug = require('debug')('joke-bot:server')
const express = require('express')
const app = express()
const server = createServer(app)

debug('booting ', app)
const bodyParser = require('body-parser')

// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/joke', (_, response) => {
  response.send(`<style>body {display: flex;justify-content: center;
    align-items: center;} span {font-size: 45px;font-family: Arial;}</style>
    <span>🧚‍ We Are Live!, keep calm and code on 🧚</span>`)
})

app.post('/joke', ({ body }, response) => {
  const { token, type, orgId, data } = body
  console.log(type)
  debug('conversation_status_updated', data.converstationId)
  if (token === DRIFT_VERIFICATION_TOKEN) {
    debug('conversation_status_updated', data.converstationId)
    if (type === 'new_message') {
      const randomJoke = fetchRandomJoke().catch(err => console.error(err))
      console.log('heres the random joke', randomJoke)
      sendDriftMessage({ converstationId }, randomJoke, orgId).catch(err =>
        console.error(err)
      )
    }
  } else {
    debug('DRIFT_VERIFICATION_TOKEN mismatch', response)
    response.sendStatus(403)
  }
})

server.listen((PORT = 3000), () => {
  console.log(`> We're live on http://localhost:${PORT}`)
})
