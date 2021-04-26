<template>
  <div style="height: 100%; width: 100%; background-color: white" class="rounded">
    <div v-if="loading" style="height: inherit; width: inherit; display: flex; flex-direction: column; justify-content: center; align-items: center">
      <v-progress-circular color="secondary" indeterminate />
    </div>
    <div v-else style="height: 100%; width: 100%;">
      <div v-if="stripeUserData.requirements.currently_due.length > 0" style="height: inherit; width: inherit; display: flex; flex-direction: column; justify-content: center; align-items: center">
        <p class="text-h6">Visita esta url y rellena los datos necesarios para poder aceptar pagos</p>
        <a v-if="accountLink" :href="accountLink.url">Visitar configuración de pagos</a>
        <p v-else>Generando link <v-progress-circular indeterminate color="secondary" /></p>
      </div>
      <div v-else class="pa-5" style="height: inherit; width: inherit; display: flex; flex-direction: column; justify-content: center; align-items: center">
        <div v-if="rentalData.status === 'created'" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
          <p class="text-h5 text-center">Esta sección se actualizara una vez que el propietario haya aceptado la peticion de alquiler</p>
          <p>Vuelve a entrar más tarde o espera</p>
        </div>
        <div v-else-if="rentalData.status === 'contract_formalization'" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
          <p class="text-h4 text-center">¡El propietario ha aceptado tu peticion de alquiler!</p>
          <p v-if="!rentalData.contract_url" class="text-center">Aqui aparecera el contrato de alquiler una vez que el propietario lo suba, el cual podras aceptar si estas de acuerdo con las condiciones</p>
          <div v-if="rentalData.contract_url" class="text-center">
            <p>Haga click en el siguiente enlace para ver el contrato de alquiler</p>
            <a class="d-block mb-2" :href="rentalData.contract_url">Ver contrato de alquiler</a>
            <p>Si acepta las condiciones, presione "Continuar". En caso de preguntas, utilice el chat de la derecha para negociar condiciones diferentes</p>
            <v-btn class="rounded" x-large elevation="0" color="primary" @click="acceptContract">
              Continuar
            </v-btn>
          </div>
        </div>
      </div>
    </div>
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
  export default class TenantView extends Vue {
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

    acceptContract() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ status: 'down_payment' })
    }

    @Watch('stripeUserData')
    getAccountLink() {
      if(this.stripeUserData.requirements.currently_due.length) {
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