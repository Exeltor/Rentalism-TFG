const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const messaging = admin.messaging()

exports.sendPushMessage = functions.https.onCall(async (data) => {
  const message = {
    name: data.name,
    data: {
      type: data.type,
      id: data.id
    },
    notification: {
      title: data.title,
      body: data.body
    },
    token: data.token
  }

  try {
    await messaging.send(message)
  } catch(e) {
    console.error(`Did not work to send a message to token ${message.token}`)
    console.error(e)
  }
})