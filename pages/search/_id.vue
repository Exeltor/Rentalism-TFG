<template>
  <div>
    <client-only>
      <div class="mb-5" style="height: 400px; border-radius: 2rem; overflow: hidden">
        <v-carousel cycle height="400" show-arrows-on-hover hide-delimiter-background>
          <v-carousel-item v-for="photo in listingData.photos" :key="photo">
            <v-img :src="photo" height="400px" width="100%" />
          </v-carousel-item>
        </v-carousel>
      </div>
    </client-only>
    <v-row>
      <v-col cols="8">
        <p class="text-h3 font-weight-bold mb-0">{{ listingData.name }}</p>
        <p>{{ listingData.type }} - {{ listingData.subtype }}</p>
        <v-divider />
        <p class="text-h5 font-weight-bold">Descripción edificio</p>
        <p>{{ listingData.descriptionBuilding }}</p>
        <v-divider />
        <p class="text-h5 font-weight-bold">Equipamiento</p>
        <p>{{ listingData.equipment }}</p>
        <v-divider />
        <p class="text-h5 font-weight-bold">Comentarios</p>
        <p>{{ listingData.comments }}</p>
      </v-col>
      <v-col cols="4">
        <div style="background-color: white; position: sticky; top: 2rem" class="rounded pa-6">
          <div v-if="ownerData">
            <nuxt-link :to="`/profile/${listingData.user}`">
              <v-row no-gutters class="mb-4" align="center" style="color: black">
                <img :src="ownerData.imageUrl || require('@/assets/images/user-icon.svg')" alt="user" style="height: 70px; width: 70px; object-fit: cover" class="rounded mr-4">
                <p class="text-h5 font-weight-bold ma-0">{{ ownerData.name }}</p>
              </v-row>
            </nuxt-link>
            <div class="rounded mb-4" style="overflow: hidden">
              <GmapMap
                ref="gMap"
                language="es"
                :zoom="15"
                :center="listingData._geoloc"
                style="height: 300px; width: 100%"
              >
                <GmapMarker
                  :position="listingData._geoloc"
                />
              </GmapMap>
            </div>
            <v-btn class="rounded" x-large elevation="0" block color="primary" @click="beginRentalDialog = true" :disabled="$store.state.authUser === null || listingData.user === $store.state.authUser.uid">
              {{ $store.state.authUser === null ? 'Registrese para iniciar el proceso' : listingData.user === $store.state.authUser.uid ? 'Eres el propietario' : 'Iniciar proceso de alquiler' }}
            </v-btn>
          </div>
          <div v-else>
            <v-progress-circular indeterminate />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="beginRentalDialog" width="800px">
      <v-card class="rounded pa-4">
        <p class="text-h5 font-weight-bold mb-0">Comenzar proceso de alquiler</p>
        <p>Elige el rango de tiempo aproximado que desear alquilar el inmueble</p>
        <v-date-picker
          v-model="selectedRentalDateRange"
          range
          full-width
          :min="new Date().toISOString()"
        />
        <v-expand-transition>
          <v-alert v-if="showDateRangeError" text type="error">Tienes que elegir dos fechas</v-alert>
        </v-expand-transition>
        <v-btn class="rounded" x-large elevation="0" block color="primary" @click="createRental">
          Enviar petición alquiler
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
  @Component({
    async asyncData({ params, app }) {
      const result = await app.$fire.firestore.doc(`listings/${params.id}`).get()
      console.log(result.data())
      return { listingData: result.data() }
    }
  })
  export default class ListingDetailPage extends Vue {
    listingData!: any
    ownerData: any = null
    beginRentalDialog: boolean = false
    selectedRentalDateRange = []
    showDateRangeError = false

    mounted() {
      this.$fire.firestore.doc(`users/${this.listingData.user}`).get().then(result => {
        this.ownerData = result.data()
      }).catch(error => {
        console.log(error)
      })
    }

    createRental() {
      if(this.selectedRentalDateRange.length === 2) {
        this.$fire.firestore.collection('rentals').add({
          processBeginDate: new Date(),
          tenant: this.$store.state.authUser.uid,
          owner: this.listingData.user,
          approxStartDate: this.selectedRentalDateRange[0],
          approxEndDate: this.selectedRentalDateRange[1],
          listing: this.$route.params.id,
          status: 'created'
        }).then(response => {
          const sendPushMessage = this.$fire.functions.httpsCallable('messaging-sendPushMessage')
          if(this.ownerData.notificationToken) {
            sendPushMessage({ 
              name: 'new-rent-request',
              type: 'new-rent-request',
              id: response.id,
              title: `Nueva petición de alquiler para ${this.listingData.name}`,
              body: 'test',
              token: this.ownerData.notificationToken
            })
          }
        })
        this.beginRentalDialog = false
      } else {
        this.showDateRangeError = true
        setTimeout(() => this.showDateRangeError = false, 3000)
      }
    }
  }
</script>

<style lang="scss" scoped>
.full-height {
  height: 100vh;
}

.custom-slide-class{
  width: 100%;
  height: 100%;
}
</style>