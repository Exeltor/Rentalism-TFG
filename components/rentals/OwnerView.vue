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
      <div v-else style="height: inherit; width: inherit; display: flex; flex-direction: column; justify-content: center; align-items: center">
        
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
  export default class OwnerView extends Vue {
    @Prop({ type: Object, required: true }) readonly otherPersonData!: any
    userDoc!: any
    rentalData: any | null = null
    listingData: any | null = null
    loading: boolean = true
    stripeUserData: any = null
    accountLink: any = null

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
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
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

  }
</script>

<style lang="scss" scoped>

</style>