import { vuexfireMutations, firestoreAction } from 'vuexfire'

export const state = () => ({
  authUser: null,
  userDoc: null
})

export const mutations = {
  ...vuexfireMutations,
  RESET_STORE: (state) => {
    state.authUser = null
  },

  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email
    }
  }
}

export const actions = {
  async nuxtServerInit({ dispatch }, ctx) {
    // INFO -> Nuxt-fire Objects can be accessed in nuxtServerInit action via this.$fire___, ctx.$fire___ and ctx.app.$fire___'

    /** Get the VERIFIED authUser on the server */
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      const { allClaims: claims, ...authUser } = ctx.res.locals.user

      console.info(
        'Auth User verified on server-side. User: ',
        authUser,
        'Claims:',
        claims
      )

      await dispatch('onAuthStateChanged', {
        authUser,
        claims,
      })

      console.log('end server init')
    }
  },
  async onAuthStateChanged({ commit, dispatch }, { authUser }) {
    if (!authUser) {
      commit('RESET_STORE')
      dispatch('unbindUserDoc')
      return
    }
    commit('SET_AUTH_USER', { authUser })
    await dispatch('bindUserDoc')
  },
  bindUserDoc: firestoreAction(async function ({ state, bindFirestoreRef }) {
    if (!state.authUser) { return }
    const ref = this.$fire.firestore
      .collection('users')
      .doc(state.authUser.uid)
    await bindFirestoreRef('userDoc', ref, { wait: true })
    console.log('user doc bound', state.userDoc)
  }),
  unbindUserDoc: firestoreAction(({ commit, unbindFirestoreRef }) => {
    unbindFirestoreRef('userDoc')
    commit('RESET_STORE')
  }),
}

export const getters = {
  isLoggedIn: (state) => {
    try {
      return state.authUser.id !== null
    } catch {
      return false
    }
  }
}