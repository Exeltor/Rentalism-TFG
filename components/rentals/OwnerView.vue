<template>
  <div style="height: 100%; width: 100%; background-color: white" class="rounded">
    <div v-if="loading" style="height: inherit; width: inherit; display: flex; flex-direction: column; justify-content: center; align-items: center">
      <v-progress-circular color="secondary" indeterminate />
    </div>
    <div v-else style="height: 100%; width: 100%;">
      <div v-if="stripeUserData.requirements" style="height: inherit; width: inherit; display: flex; flex-direction: column; justify-content: center; align-items: center">
        <p class="text-h6">Visita esta url y rellena los datos necesarios para poder aceptar pagos</p>
        <a v-if="accountLink" :href="accountLink.url">Visitar configuración de pagos</a>
        <p v-else>Generando link <v-progress-circular indeterminate color="secondary" /></p>
      </div>
      <div v-else class="pa-5" style="height: inherit; width: inherit; display: flex; flex-direction: column; justify-content: center; align-items: center">
        <div v-if="rentalData.status === 'created'" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
          <p class="text-h4">{{ otherPersonData.name }}</p>
          <p>esta interesado en alquilar esta propiedad para el siguiente periodo estimado:</p>
          <p class="text-h5">{{ rentalData.approxStartDate }} - {{ rentalData.approxEndDate }}</p>
          <div style="display: flex; flex-direction: row; height: auto">
            <v-btn class="rounded mr-3" x-large elevation="0" color="primary" outlined @click="showDenyDialog = true">
              Denegar
            </v-btn>
            <v-btn class="rounded" x-large elevation="0" color="primary" @click="acceptRental">
              Aceptar
            </v-btn>
          </div>
        </div>
        <div v-else-if="rentalData.status === 'contract_formalization'" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
          <v-row>
            <v-col>
              <p class="mb-0">En el siguiente campo, haga click o arrastre el contrato de alquiler rellenado para su posterior firma y aceptación</p>
              <p class="text-caption align-self-start">En formato pdf</p>
            </v-col>
            <v-col>
              <div class="image-upload-block mb-2" @click="$refs.documentInput.click()">
                <img v-if="!documentImagePreview && !userDoc.document" class="upload-plus-icon" src="@/assets/images/plus-icon.svg" alt="Add">
                <v-img v-else contain :src="documentImagePreview || userDoc.document.image" max-height="100%" />
                <input ref="documentInput" type="file" accept="image/*" style="display: none" @change="handleDocumentInput">
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <v-dialog v-model="showDenyDialog" max-width="600px" rounded="xl">
      <v-card class="pa-6">
        <p class="text-h4">Indique motivo de la denegación</p>
        <v-textarea v-model="denyMotiveText" class="rounded mb-3" filled rounded label="Motivo denegación" hide-details="false" />
        <div style="display: flex; flex-direction: row; height: auto; justify-content: center">
          <v-btn class="rounded mr-3" x-large elevation="0" color="primary" outlined @click="showDenyDialog = false">
            Cancelar
          </v-btn>
          <v-btn class="rounded" x-large elevation="0" color="primary">
            Enviar y denegar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'

  @Component({
    computed: {
      ...mapState({
        userDoc: 'userDoc'
      })
    }
  })
  export default class OwnerView extends Vue {
     @Prop({ type: Object, required: true }) readonly otherPersonData!: any
    userDoc!: any
    rentalData: any | null = null
    listingData: any | null = null
    rentalDataListener: any = null
    loading: boolean = true
    stripeUserData: any = null
    accountLink: any = null
    showDenyDialog: boolean = false
    denyMotiveText: string = ''

    mounted() {
      const retrieveAccountData = this.$fire.functions.httpsCallable('stripe-retrieveConnectedAccountData')
      Promise.all([
        this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).get(),
        retrieveAccountData({ stripeId: this.userDoc.stripeId })
      ]).then(async responses => {
        this.rentalData = responses[0].data()!
        this.stripeUserData = responses[1].data
        console.log(this.stripeUserData)
        this.listingData = (await this.$fire.firestore.doc(`listings/${this.rentalData.listing}`).get()).data()
        this.rentalDataListener = this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).onSnapshot(rental => {
          this.rentalData = rental.data()
        })
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    }

    beforeDestroy() {
      if (this.rentalDataListener) this.rentalDataListener()
    }

    acceptRental() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ status: 'contract_formalization' })
    }

    @Watch('stripeUserData')
    getAccountLink() {
      if(this.stripeUserData.requirements) {
        const generateOnboardingLink = this.$fire.functions.httpsCallable('stripe-generateOnboardingLink')
        generateOnboardingLink({
          stripeId: this.userDoc.stripeId,
          url: window.location.href,
        }).then(response => {
          this.accountLink = response.data
        }).catch(error => {
          console.log(error)
        })
      }
    }

    @Watch('showDenyDialog')
    handleDenyDialog(value: boolean) {
      if(!value) {
        this.denyMotiveText = ''
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>