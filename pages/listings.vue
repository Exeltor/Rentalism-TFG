<template>
  <div>
    <div v-if="loading" class="full-height d-flex flex-column align-center justify-center">
      <v-progress-circular color="secondary" indeterminate size="50" />
    </div>
    <div v-else-if="listings.length === 0 && rentals.length === 0 && !loading" class="full-height d-flex flex-column align-center justify-center">
      <img class="mb-8" style="width: 8rem" src="@/assets/images/question-cloud.svg" alt="Not found">
      <p class="text-h6">Parece que no tienes ningun inmueble creado, y tampoco estas alquilando ningun inmueble...</p>
      <nuxt-link class="text-h6" to="/new-listing">Crea un inmueble</nuxt-link>
      <p class="my-3">o</p>
      <nuxt-link class="text-h6" to="/search">Encuentra el perfecto para ti</nuxt-link>
    </div>
    <v-row v-else class="full-height" no-gutters>
      <v-col class="mr-2 pa-8 rounded-white-container">
        <v-row no-gutters>
          <p class="text-h6">Tus inmuebles</p>
          <v-spacer />
          <v-btn class="rounded-sm" elevation="0" color="primary" nuxt to="/new-listing">Crear</v-btn>
        </v-row>
        <div v-if="listings.length > 0">
          <div v-for="(listing, index) in listings" :key="index" class="rounded listing-tile pa-3">
            <v-row no-gutters>
              <v-img class="rounded mr-2" :src="listing.photos[0]" height="150" max-width="200" />
              <v-col>
                <p class="text-h5 mb-1 ml-4">{{ listing.name }}</p>
                <p class="ml-4">{{ listing.type }} - {{ listing.subtype }}</p>
                <v-row no-gutters class="mt-3">
                  <v-btn class="rounded-sm mr-2" elevation="0" text nuxt :to="`/search/${listing.id}`">Ver página</v-btn>
                  <v-btn v-if="listing.rentals.length === 1" class="rounded-sm" elevation="0" color="primary" nuxt :to="`rentals/${listing.rentals[0].id}`">Administrar</v-btn>
                  <v-menu v-if="listing.rentals.length > 1" offset-y rounded="sm" max-height="200px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="rounded-sm" elevation="0" color="primary" v-bind="attrs" v-on="on">
                        Administrar
                        <v-icon right>
                          mdi-menu-down
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="rental in listing.rentals" :key="rental.id" nuxt :to="`/rentals/${rental.id}`">
                        <v-list-item-title>{{ rental.tenantName }}</v-list-item-title>
                        <div class="text-caption font-weight-bold ml-6">
                          <div v-if="rental.status === 'created'" style="background-color: #f0f0f0; border-radius: 0.4rem" class="pa-1">Creado</div>
                          <div v-else-if="rental.status === 'contract_formalization' || rental.status === 'down_payment'" style="background-color: #cf6b00; border-radius: 0.4rem; color: white" class="pa-1">{{ rental.status === 'contract_formalization' ? 'Contrato' : 'Fianza' }}</div>
                          <div v-else-if="rental.status === 'ongoing'" style="background-color: #77B6C0; border-radius: 0.4rem; color: white" class="pa-1">En curso</div>
                          <div v-else-if="rental.status === 'finalized'" style="background-color: #C30000; border-radius: 0.4rem; color: white" class="pa-1">Finalizado</div>
                          <div v-else-if="rental.status === 'rejected'" style="background-color: #C30000; border-radius: 0.4rem; color: white" class="pa-1">Denegado</div>
                        </div>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </div>
        <div v-else>
          <p>No tienes ningun inmueble en la plataforma... <nuxt-link to="/new-listing">Crear</nuxt-link></p>
        </div>
      </v-col>
      <v-col class="pa-8 rounded-white-container">
        <p class="text-h6">Tus alquileres</p>
        <div v-if="rentals.length > 0">
          <div v-for="(rental, index) in rentals" :key="index" class="rounded listing-tile pa-3">
            <v-row no-gutters>
              <v-img class="rounded mr-2" :src="rental.photos[0]" height="150" max-width="200" />
              <v-col>
                <p class="text-h5 mb-1 ml-4">{{ rental.name }}</p>
                <p class="ml-4">{{ rental.type }} - {{ rental.subtype }}</p>
                <v-row no-gutters class="mt-3">
                  <v-btn class="rounded-sm mr-2" elevation="0" text nuxt :to="`search/${rental.id}`">Ver página</v-btn>
                  <v-btn v-if="rental.rentalId" class="rounded-sm" elevation="0" color="primary" nuxt :to="`rentals/${rental.rentalId}`">Administrar</v-btn>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </div>
        <div v-else>
          <p>No estas alquilando ningun inmueble... <nuxt-link to="/search">Buscar</nuxt-link></p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

  @Component({
    middleware: ['authenticated']
  })
  export default class ListingsPage extends Vue {
    loading: boolean = true

    listings: any[] = [];
    rentals: Object[] = []
    mounted() {
      this.loading = true
      Promise.all([
        this.$fire.firestore.collection('listings').where('user', '==', this.$store.state.authUser.uid).get(),
        this.$fire.firestore.collection('rentals').where('tenant', '==', this.$store.state.authUser.uid).get().then(response => {
          let listingsPromises: Promise<any>[] = []
          response.docs.forEach(doc => {
            listingsPromises.push(this.$fire.firestore.doc(`listings/${doc.data().listing}`).get())
          })
          return Promise.all(listingsPromises)
        })
      ]).then(responses => {
        responses[0].docs.forEach(async document => this.listings.push({
          ...document.data(),
          id: document.id,
          rentals: await Promise.all((await this.$fire.firestore.collection('rentals').where('listing', '==', document.id).where('owner', '==', this.$store.state.authUser.uid).get()).docs.map(async doc => {
            return { 
              ...doc.data(),
              id: doc.id,
              tenantName: (await this.$fire.firestore.doc(`users/${doc.data().tenant}`).get()).data()!.name
            }
          }))
        }))
        responses[1].forEach(async document => {
          this.rentals.push({ ...document.data(), id: document.id, rentalId: (await this.$fire.firestore.collection('rentals').where('listing', '==', document.id).where('tenant', '==', this.$store.state.authUser.uid).get()).docs[0].id })
        })
        this.loading = false
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