require('dotenv').config()
const { createServer } = require('http')

const express = require('express')
const app = express()
const server = createServer(app)
const bodyParser = require('body-parser')

const { DRIFT_VERIFICATION_TOKEN, SENTRY_API } = process.env
const { handleMessage } = require('./lib/incoming')

// debugging tools lines 10 - 22 - ugh
const debug = require('debug')('joke-bot:server')
const Raven = require('raven')
Raven.config(SENTRY_API).install()
app.use(Raven.requestHandler())
app.use(Raven.errorHandler())
app.get('/', () => {
  throw new Error('Broke!')
})
app.use(function onError (err, req, res, next) {
  console.error(err.message)
  res.status(500).end(`${res.sentry} ${err.message}` + '\n')
})

app.use(bodyParser.json())

app.get('/joke', (_, response) => {
  response.send(`<style>body {display: flex;justify-content: center;
    align-items: center;} span {font-size: 45px;font-family: Arial;}</style>
    <span>🧚‍ We Are Live!, keep calm and code on 🧚</span>`)
})

app.post('/joke', ({ body }, response) => {
  const { token, type, orgId, data } = body

  // Verifying tokens 👇,
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

const PORT = parseInt(process.env.PORT, 10) || 80
const dev = process.env.NODE_ENV !== 'production'
server.listen(PORT, err => {
  if (err) throw err
  console.log(`> We're live on http://localhost:${PORT}`)
})
