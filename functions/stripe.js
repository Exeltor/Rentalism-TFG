const functions = require('firebase-functions')
const stripe = require('stripe')('sk_test_51IjieKKRqAL8ItsqzWRGUAVTd2i40LnYmleRbmOe1ZQzbuOxox7Bub7VO6Xz3wrXAy0AFxMkNp0SV258TU3HmrHR00D35BRpLH');

exports.createConnectUser = functions.region('europe-west1').firestore.document('users/{userId}').onCreate(async (snap, context) => {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'ES',
    email: snap.data().email,
    capabilities: {
      card_payments: {requested: true},
      transfers: {requested: true},
    },
  });

  snap.ref.update({
    stripeId: account.id
  })
})

exports.retrieveConnectedAccountData = functions.https.onCall(async (data, context) => {
  const account = await stripe.accounts.retrieve(data.stripeId)
  
  return account
});

exports.generateOnboardingLink = functions.https.onCall(async (data, context) => {
  const link = await stripe.accountLinks.create({
    account: data.stripeId,
    refresh_url: data.url,
    return_url: data.url,
    type: 'account_onboarding'
  })

  return link
})