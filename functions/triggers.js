const functions = require('firebase-functions')
const axios = require('axios')

exports.setGeolocationData = functions.region('europe-west1').firestore.document('listings/{listingId}').onCreate((snap, context) => {
  const addressString = `${snap.data().location.address}, ${snap.data().location.number}, ${snap.data().location.postalCode}, ${snap.data().location.city}`
  
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(addressString)}&key=AIzaSyAJa-HPO4lgvUNZ9GRlx10anJUxVtMmm0I`).then(response => {
    const data = response.data

    snap.ref.update({
      _geoloc: {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng
      }
    })
  })
})