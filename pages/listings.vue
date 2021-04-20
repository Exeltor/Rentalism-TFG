<template>
  <div>
    <div v-if="!listings && !rentals" class="full-height d-flex flex-column align-center justify-center">
      <img class="mb-8" style="width: 8rem" src="@/assets/images/question-cloud.svg" alt="Not found">
      <p class="text-h6">Parece que no tienes ningun inmueble creado, y tampoco estas alquilando ningun inmueble...</p>
      <nuxt-link class="text-h6" to="/new-listing">Crea un inmueble</nuxt-link>
      <p class="my-3">o</p>
      <nuxt-link class="text-h6" to="/search">Encuentra el perfecto para ti</nuxt-link>
    </div>
    <v-row v-else class="full-height" no-gutters>
      <v-col class="mr-2 pa-8 rounded-white-container">
        <p class="text-h6">Tus inmuebles</p>
        <div v-for="(listing, index) in listings" :key="index" class="rounded listing-tile pa-3">
          <v-row no-gutters>
            <v-img class="rounded mr-2" :src="listing.photos[0]" height="150" max-width="200" />
            <v-col>
              <p class="text-h5 mb-1 ml-4">{{ listing.name }}</p>
              <p class="ml-4">{{ listing.type }} - {{ listing.subtype }}</p>
              <v-row no-gutters class="mt-3">
                <v-btn class="rounded-sm mr-2" elevation="0" text>Ver página</v-btn>
                <v-btn class="rounded-sm" elevation="0" color="primary">Administrar</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col class="pa-8 rounded-white-container">
        <p class="text-h6">Tus alquileres</p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class ListingsPage extends Vue {

    listings: Object[] = [];
    rentals: Object[] = []
    mounted() {
      Promise.all([
        this.$fire.firestore.collection('listings').where('user', '==', this.$store.state.authUser.uid).get(),
        this.$fire.firestore.collection('rentals').where('tentant', '==', this.$store.state.authUser.uid).get(),
      ]).then(responses => {
        responses[0].docs.forEach(document => this.listings.push(document.data()))
        responses[1].docs.forEach(document => this.rentals.push(document.data()))
      })
    }

  }
</script>

<style scoped lang="scss">
.full-height {
  height: 97vh;
}

.rounded-white-container {
  border-radius: 2rem;
  background-color: white;
}

.listing-tile {
  background-color: #FBFBFB;
  width: 100%;
  
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>