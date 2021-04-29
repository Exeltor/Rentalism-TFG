
importScripts(
  'https://www.gstatic.com/firebasejs/8.4.0/firebase-app.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/8.4.0/firebase-messaging.js'
)
firebase.initializeApp({"apiKey":"AIzaSyAJa-HPO4lgvUNZ9GRlx10anJUxVtMmm0I","authDomain":"rentalism-52556.firebaseapp.com","databaseURL":"https:\u002F\u002Fvektor-38512.firebaseio.com","projectId":"rentalism-52556","storageBucket":"rentalism-52556.appspot.com","messagingSenderId":"435233991978","appId":"1:435233991978:web:231af5ea6fa659d8510253"})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

// Setup event listeners for actions provided in the config:
self.addEventListener('notificationclick', function(e) {
  const actions = [{"action":"randomName","url":"randomUrl"}]
  const action = actions.find(x => x.action === e.action)
  const notification = e.notification

  if (!action) return

  if (action.url) {
    clients.openWindow(action.url)
    notification.close()
  }
})
