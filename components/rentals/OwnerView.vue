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
              <v-row align="center" justify="center">
                <v-col >
                  <p class="text-h5 text-center">Una vez subido el contrato, espere que el inquilino acepte los terminos</p>
                </v-col>
              </v-row>
              <v-divider class="mb-10" />
              <v-row>
                <v-col>
                  <p class="mb-0">En el siguiente campo, haga click o arrastre el contrato de alquiler rellenado para su posterior firma y aceptación</p>
                  <p class="text-caption align-self-start">En formato pdf</p>
                </v-col>
                <v-col>
                  <div class="contract-upload-block mb-2 pa-2" @click="!contractUploadLoading ? $refs.documentInput.click() : null" @dragover.prevent @drop.prevent="handleDocumentDrop">
                    <v-progress-circular v-if="contractUploadLoading" color="primary" indeterminate />
                    <img v-if="!rentalData.contract_url && !contractUploadLoading" class="upload-plus-icon" src="@/assets/images/plus-icon.svg" alt="Add">
                    <div v-if="rentalData.contract_url && !contractUploadLoading">
                      <p>¡Contrato subido! <v-icon color="primary">mdi-check</v-icon></p>
                      <p class="text-caption">Arrastra o haz click para subir otro contrato y reemplazar el existente</p>
                    </div>
                    <input ref="documentInput" type="file" accept="application/pdf" style="display: none" @change="handleDocumentInput">
                  </div>
                  <v-expand-transition>
                    <v-alert v-if="showContractError" text type="error">Solo se admite el formato .pdf</v-alert>
                  </v-expand-transition>
                  <a v-if="rentalData.contract_url" :href="rentalData.contract_url">Ver contrato subido</a>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div v-else-if="rentalData.status === 'down_payment'" style="height: 100%">
          <v-row>
            <v-col>
              <p class="text-h6 text-center mb-6">Realice el envio del cobro de la fianza, para posteriormente firmar el contrato</p>
              <v-row>
                <v-col style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                  <div v-if="!rentalData.downpayment_invoice">
                    <p>Haga click en el siguiente boton para emitir la factura de la fianza</p>
                    <v-btn class="rounded" x-large elevation="0" color="primary" @click="downPaymentDialogOpen = true">
                      Generar factura
                    </v-btn>
                  </div>
                  <div v-else>
                    <p>La factura se ha emitido correctamente</p>
                    <p>Puede monitorizar el estado del pago a la derecha</p>
                  </div>
                </v-col>
                <v-col v-if="rentalData.downpayment_invoice" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                  <v-icon color="primary" size="100">{{ invoiceData.stripeInvoiceStatus === 'paid' ? 'mdi-check' : 'mdi-timer-sand' }}</v-icon>
                  <p>{{ invoiceData.stripeInvoiceStatus === 'paid' ? 'Se ha realizado el pago' : 'Pago pendiente' }}</p>
                </v-col>
              </v-row>
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
    <v-dialog v-model="downPaymentDialogOpen" max-width="600px" rounded="xl">
      <v-card class="pa-6">
        <p class="text-h4">Indique cantidad de la fianza</p>
        <v-text-field v-model="invoiceDownpaymentAmount" class="rounded mb-3" filled rounded label="Cantidad" hide-details="false" type="number" required />
        <v-expand-transition>
          <v-alert v-if="showDownpaymentError" text type="error">El campo es obligatorio y no puede ser negativo</v-alert>
        </v-expand-transition>
        <div style="display: flex; flex-direction: row; height: auto; justify-content: center">
          <v-btn class="rounded mr-3" x-large elevation="0" color="primary" outlined @click="downPaymentDialogOpen = false">
            Cancelar
          </v-btn>
          <v-btn class="rounded" x-large elevation="0" color="primary" @click="generateInvoice">
            Enviar factura
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
    contractUploadLoading: boolean = false
    showContractError: boolean = false
    showDownpaymentError: boolean = false
    downPaymentDialogOpen: boolean = false
    invoiceDownpaymentAmount: number = 0
    invoiceListener: any = null
    invoiceData: any = null

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
      if (this.invoiceListener) this.invoiceListener()
    }

    acceptRental() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ status: 'contract_formalization' })
    }

    generateInvoice() {
      if(this.invoiceDownpaymentAmount <= 0 || !this.invoiceDownpaymentAmount) {
        this.showDownpaymentError = true
        setTimeout(() => this.showDownpaymentError = false, 3000)
      } else {
        this.$fire.firestore.collection('invoices').add({
          email: this.otherPersonData.email,
          items: [
            {
              amount: this.invoiceDownpaymentAmount * 100,
              currency: 'eur',
              description: `Pago fianza de ${this.listingData.name}`
            }
          ],
          transfer_data: {
            destination: this.stripeUserData.id
          }
        }).then(response => {
          this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ downpayment_invoice: response.id })
        })
      }
    }

    handleDocumentInput(e: any) {
      if (e.target.files) {
        const file = e.target.files[0]
        this.uploadContract(file)
      }
    }

    handleDocumentDrop(e: any) {
      if (e.dataTransfer.files) {
        const file = e.dataTransfer.files[0]
        if (file.name.split('.').pop() === 'pdf') {
          this.uploadContract(file)
        } else {
          this.showContractError = true
          setTimeout(() => this.showContractError = false, 3000)
        }
      }
    }

    uploadContract(file: any) {
      this.contractUploadLoading = true
      this.$fire.storage.ref(`rentals/${this.$route.params.id}/contrato_alquiler.pdf`).put(new Blob([file])).then(async response => {
        this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ contract_url: await response.ref.getDownloadURL() }).then(() => {
          this.contractUploadLoading = false
        })
      })
    }

    @Watch('stripeUserData')
    getAccountLink() {
      if(this.stripeUserData.requirements.currently_due.length > 0) {
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

    @Watch('rentalData.downpayment_invoice')
    initializeInvoiceListener() {
      console.log('initializing invoice listener')
      this.invoiceListener = this.$fire.firestore.doc(`invoices/${this.rentalData.downpayment_invoice}`).onSnapshot(response => {
        this.invoiceData = response.data()
      })
    }

    @Watch('showDenyDialog')
    handleDenyDialog(value: boolean) {
      if(!value) {
        this.denyMotiveText = ''
      }
    }

    @Watch('downPaymentDialogOpen')
    handleDownpaymentDialog(value: boolean) {
      if(!value) {
        this.invoiceDownpaymentAmount = 0
      }
    }

  }
</script>

<style lang="scss" scoped>
.contract-upload-block {
  width: 100%;
  height: 8rem;
  background-color: rgba(0, 0, 0, 0.06);
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }

  .upload-plus-icon {
    height: 3rem;
    width: 3rem;
  }
}
</style>