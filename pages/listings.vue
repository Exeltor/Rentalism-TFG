<template>
  <div>
    <div class="full-height d-flex flex-column align-center justify-center" v-if="!userDoc.listings && !userDoc.rentals">
      <img class="mb-8" style="width: 8rem" src="@/assets/images/question-cloud.svg" alt="Not found">
      <p class="text-h6">Parece que no tienes ningun inmueble creado, y tampoco estas alquilando ningun inmueble...</p>
      <nuxt-link class="text-h6" to="/new-listing">Crea un inmueble</nuxt-link>
      <p class="my-3">o</p>
      <nuxt-link class="text-h6" to="/search">Encuentra el perfecto para ti</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

  @Component({
    computed: {
      ...mapState({
        userDoc: 'userDoc'
      })
    }
  })
  export default class ListingsPage extends Vue {

  }
</script>

<style scoped lang="scss">
.full-height {
  height: 100vh
}
</style>