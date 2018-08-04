;(() => {
  const $ = document.body
  const driftUserId = 1177958

  const scheduleButton = $.querySelector(
    '#schedule-meeting-button'
  ).addEventListener('click', () => {
    drift.on('ready', api => api.scheduleMeeting(driftUserId))
  })

  const newConversationButton = $.querySelector(
    '#new-conversation-button'
  ).addEventListener('click', () => {
    drift.on('ready', api => api.goToNewConversation())
  })

  const conversationListButton = $.querySelector(
    '#conversation-list-button'
  ).addEventListener('click', () => {
    drift.on('ready', api => {
      api.goToConversationList()
    })
  })

  // A LITTLE EXPERIMENTING
  // const jokeButton = $.querySelector('#drift-open-chat')
  //   .addEventListener('click', () => {
  //     location = '#drift-open-chat'
  //     drift.on('ready', (api, payload) => {
  //       api.goToNewConversation()
  //       window.drift.on("startConversation", function (data) {
  //         console.log("User started a new conversation " + data.conversationId);
  //       });
  //     })
  //   })

  const chatButton = document
    .querySelector('#open-chat')
    .addEventListener('click', () => {
      drift.on('ready', api => api.sidebar.toggle())
    })

  const jokeButton = $.querySelector('#drift-open-chat').addEventListener(
    'click',
    () => {
      location = '#drift-open-chat'
    }
  )
})()
