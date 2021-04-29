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
                  <v-icon color="primary" size="100" v-if="invoiceData">{{ invoiceData.stripeInvoiceStatus === 'paid' ? 'mdi-check' : 'mdi-timer-sand' }}</v-icon>
                  <p v-if="invoiceData">{{ invoiceData.stripeInvoiceStatus === 'paid' ? 'Se ha realizado el pago' : 'Pago pendiente' }}</p>
                </v-col>
              </v-row>
              <v-divider class="my-4" />
              <v-row>
                <v-col v-if="!rentalData.ownerSignature" style="display: flex; flex-direction: column; justify-content: center">
                  <div class="text-center">
                    <vue-qrcode :width="200" :scale="1" :value="`https://rentalism.herokuapp.com/signature/${$route.params.id}?role=owner`" />
                  </div>
                  <p class="text-center">Escanea este codigo QR en el movil para firmar el contrato</p>
                </v-col>
                <v-col v-else style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                  <img :src="rentalData.ownerSignature" style="width: 200px">
                  <p class="text-center">¡Contrato firmado correctamente!</p>
                </v-col>
              </v-row>
              <v-divider class="my-4" />
              <v-row>
                <v-col v-if="rentalData.tenantSignature && rentalData.ownerSignature">
                  <p>¡Ambas partes han firmado el contrato!</p>
                  <p>Dale click al siguiente boton para comenzar el proceso de alquiler</p>
                  <v-btn class="rounded" x-large elevation="0" color="primary" block @click="confirmRental" :disabled="rentalData.owner_confirm">
                    {{ rentalData.owner_confirm ? 'Alquiler confirmado' : 'Confirmar alquiler' }}
                  </v-btn>
                  <p class="text-caption">Una vez que ambas partes acepten, automaticamente de dirigiras a la siguiente pantalla</p>
                </v-col>
                <v-col v-else>
                  <p>Aqui aparecera el boton de confirmación del alquiler una vez que ambas partes hayan firmado</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div v-else-if="rentalData.status === 'ongoing'" style="height: 100%">
          <v-row style="height: 100%">
            <v-col>
              <p class="text-h5">Alquiler en proceso</p>
              <p>Aqui puede visualizar el contrato, asi como los pagos requeridos por el propietario</p>
              <v-btn class="rounded mb-6" x-large block elevation="0" color="primary" :href="rentalData.contract_url">
                Descargar contrato de alquiler
              </v-btn>
              <v-row class="text-center">
                <v-col>
                  <p class="ma-0">Fdo. {{ userDoc.name }}</p>
                  <img :src="rentalData.ownerSignature" style="height: 100px;">
                </v-col>
                <v-col>
                  <p class="ma-0">Fdo. {{ otherPersonData.name }}</p>
                  <img :src="rentalData.tenantSignature" style="height: 100px;">
                </v-col>
              </v-row>
              <div style="height: 50%; overflow-y: auto">
                <div v-if="additionalInvoices.length === 0" style="display: flex; flex-direction: column; justify-content: center; align-center: center; height: 100%; width: 100%">
                  <p class="text-center">No hay facturas por pagar, y tampoco hay historial de pagos</p>
                  <v-btn x-large color="primary" class="rounded" outlined @click="showAdditionalInvoiceDialog = true">Crear nuevo pago</v-btn>
                </div>
                <v-list v-else>
                  <v-row no-gutters align="center" class="py-6" style="position: sticky; top: 0; background-color: white; z-index: 500">
                    <p class="mb-0 font-weight-bold">Lista de facturas</p>
                    <v-spacer />
                    <v-btn class="rounded-sm" color="primary" @click="showAdditionalInvoiceDialog = true">Crear nueva factura</v-btn>
                  </v-row>
                  <div v-for="(invoice, index) in additionalInvoices" :key="index">
                    <v-divider class="pa-0 mb-6" />
                    <v-row no-gutters align="center">
                      <p class="ma-0">{{ invoice.items[0].description }}</p>
                      <v-spacer />
                      <p class="ma-0">{{ invoice.items[0].amount / 100 }}€</p>
                      <v-btn class="rounded-sm" text :disabled="invoice.stripeInvoiceStatus !== 'paid'" :href="invoice.stripeInvoiceUrl" target="_blank">{{ invoice.stripeInvoiceStatus !== 'paid' ? 'Pendiente' : 'Pagado, ver justificante' }}</v-btn>
                    </v-row>
                    <v-divider class="pa-0 mt-6" />
                  </div>
                </v-list>
              </div>
              <v-btn color="error" outlined block>Cerrar proceso de alquiler</v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <v-dialog v-model="showAdditionalInvoiceDialog" max-width="600px" rounded="xl">
      <v-card class="pa-6">
        <p class="text-h4">Crear nuevo pago</p>
        <v-text-field v-model="additionalInvoiceName" class="rounded mb-3" filled rounded label="Nombre pago" hide-details="false" required />
        <v-text-field v-model="additionalInvoiceAmount" class="rounded mb-3" filled rounded label="Cantidad" hide-details="false" type="number" required />
        <div style="display: flex; flex-direction: row; height: auto; justify-content: center">
          <v-btn class="rounded mr-3" x-large elevation="0" color="primary" outlined @click="showAdditionalInvoiceDialog = false">
            Cancelar
          </v-btn>
          <v-btn class="rounded" x-large elevation="0" color="primary" @click="createAdditionalPayment">
            Crear
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
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
import VueQrcode from 'vue-qrcode'

  @Component({
    computed: {
      ...mapState({
        userDoc: 'userDoc'
      })
    },
    components: {
      VueQrcode,
    },
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
    additionalInvoices: any[] = []
    additionalInvoiceListener: any = null
    showAdditionalInvoiceDialog: boolean = false
    additionalInvoiceAmount: number = 0
    additionalInvoiceName: string = ''

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
          this.additionalInvoiceListener = this.$fire.firestore.collection('invoices').where(this.$fireModule.firestore.FieldPath.documentId(), 'in', this.rentalData.additionalInvoices).onSnapshot(data => {
            this.additionalInvoices = data.docs.map(doc => doc.data())
          })
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
              amount: (this.invoiceDownpaymentAmount * 100).toFixed(0),
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

    createAdditionalPayment() {
      if(this.additionalInvoiceAmount > 0 && this.additionalInvoiceName) {
        this.$fire.firestore.collection('invoices').add({
          email: this.otherPersonData.email,
          items: [
            {
              amount: (this.additionalInvoiceAmount * 100).toFixed(0),
              currency: 'eur',
              description: this.additionalInvoiceName
            }
          ],
          transfer_data: {
            destination: this.stripeUserData.id
          }
        }).then(response => {
          this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ additionalInvoices: this.$fireModule.firestore.FieldValue.arrayUnion(response.id) })
          this.showAdditionalInvoiceDialog = false
        })
      }
    }

    confirmRental() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ owner_confirm: true })
      if(this.rentalData.tenant_confirm) {
        this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ status: 'ongoing' })
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

    @Watch('showAdditionalInvoiceDialog')
    handleAdditionalInvoiceDialog(value: boolean) {
      if(!value) {
        this.additionalInvoiceAmount = 0
        this.additionalInvoiceName = ''
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