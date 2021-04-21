const functions = require('firebase-functions')
const algoliasearch = require('algoliasearch')

const ALGOLIA_ID = functions.config().algolia.app_id
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key

const algolia = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

exports.exportToAlgolia = functions.region('europe-west1').firestore.document('listings/{listingId}').onWrite((snap, context) => {
  const index = algolia.initIndex('listings')

  const listingId = context.params.listingId
  const data = snap.after.data()

  if (!data) {
    return index.deleteObject(listingId, (err) => {
      if (err) {
        console.log(err)
      }
      console.log('Listing removed from Algolia Index', listingId)
    })
  }

  data.objectID = listingId

  return index.saveObject(data, (err) => {
    if (err) {
      console.log(err)
    }
    console.log('Listing updated in Algolia Index', data)
  })
})