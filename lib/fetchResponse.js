const fetch = require('node-fetch')
const { DRIFT_ACCESS_TOKEN, DRIFT_CONVO_API } = process.env
const debug = require('debug')('server:fetchRESPONSE:joke')

async function sendDriftMessage (converstationId, driftMessage, orgId) {
  const responseEndpoint = `${DRIFT_CONVO_API}/${converstationId}/messages`
  const dirty = await postResponse(responseEndpoint, driftMessage, orgId)
    .then(res => console.log(res.json()))
    .catch(err => console.error(err))
  debug('dirty:', dirty)
  return dirty
}

async function postResponse (url, driftMessage, orgId) {
  let bread
  bread = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DRIFT_ACCESS_TOKEN}`
    },
    body: JSON.stringify(driftMessage),
    type: 'chat',
    orgId: `${orgId}`
  })
    .then(response => {
      response
    })
    .catch(err => console.error(err))
  return bread
}

module.exports = sendDriftMessage
