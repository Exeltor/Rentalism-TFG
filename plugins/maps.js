import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAJa-HPO4lgvUNZ9GRlx10anJUxVtMmm0I',
  },
  installComponents: true
})