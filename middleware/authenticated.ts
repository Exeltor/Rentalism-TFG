import { Middleware } from '@nuxt/types'

const authenticated: Middleware = (context) => {
  if(!context.store.state.authUser) {
    return context.redirect('/')
  }
}

export default authenticated