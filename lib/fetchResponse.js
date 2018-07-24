const fetch = require('node-fetch')
const CONVERSATION_ENDPOINT = 'https://driftapi.com/v1/conversations'
const TOKEN = 'lpFa0YKPLkBcdItuLcyAqruvUjaTFyCm'

// const headers = {
//   Accept: 'application/json',
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${TOKEN}`,
// , method = 'POST'
// }

function sendResponse (url, driftMessage) {
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(driftMessage),
    type: 'chat',
    orgId: `${orgId}`
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
}

const sendDriftMessage = (conversationId, driftMessage) => {
  const responseEndpoint = `${CONVERSATION_ENDPOINT}/${conversationId}/messages`
  sendResponse(responseEndpoint, driftMessage)
}

const createDriftMessage = (orgId, type) => {
  // TODO:   async fetch(path, opts = {}) {
}

module.exports = { createDriftMessage, sendDriftMessage }
