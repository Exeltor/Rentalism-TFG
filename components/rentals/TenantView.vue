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
        <div v-else-if="rentalData.status === 'rejected'" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
          <p class="text-h4">Denegado</p>
          <p class="font-weight-bold">Esta peticion de alquiler ha sido denegada por el siguiente motivo</p>
          <p style="white-space: pre-wrap; word-wrap: break-word">{{ rentalData.denyMotive }}</p>
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
        <div v-else-if="rentalData.status === 'down_payment'" style="height: 100%">
          <p class="text-h6 text-center">Realice el pago de la fianza, y firme el contrato</p>
          <v-row>
            <v-col style="display: flex; flex-direction: column; justify-content: center; align-items: center">
              <div v-if="!invoiceData">
                <p>Espere a que el propietario envie la factura de la fianza</p>
              </div>
              <div v-else-if="invoiceData && invoiceData.stripeInvoiceStatus !== 'paid'">
                <p>La factura esta disponible</p>
                <v-btn class="rounded" x-large elevation="0" color="primary" :href="invoiceData.stripeInvoiceUrl" target="_blank">
                  Proceder al pago
                </v-btn>
              </div>
              <div v-else-if="invoiceData && invoiceData.stripeInvoiceStatus === 'paid'" class="text-center">
                <v-icon color="primary" size="100">mdi-check</v-icon>
                <p>¡Fianza pagada correctamente!</p>
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <v-row>
            <v-col v-if="!rentalData.tenantSignature" style="display: flex; flex-direction: column; justify-content: center">
              <div class="text-center">
                <vue-qrcode :width="200" :scale="1" :value="`https://rentalism.herokuapp.com/signature/${$route.params.id}?role=tenant`" />
              </div>
              <p class="text-center">Escanea este codigo QR en el movil para firmar el contrato</p>
            </v-col>
            <v-col v-else style="display: flex; flex-direction: column; justify-content: center; align-items: center">
              <img :src="rentalData.tenantSignature" style="width: 200px">
              <p class="text-center">¡Contrato firmado correctamente!</p>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <v-row class="text-center">
            <v-col v-if="rentalData.tenantSignature && rentalData.ownerSignature && invoiceData && invoiceData.stripeInvoiceStatus === 'paid'">
              <p>¡Ambas partes han firmado el contrato y la fianza ha sido pagada!</p>
              <p>Dale click al siguiente boton para comenzar el proceso de alquiler</p>
              <v-btn class="rounded" x-large elevation="0" color="primary" block @click="confirmRental" :disabled="rentalData.tenant_confirm">
                {{ rentalData.tenant_confirm ? 'Alquiler confirmado' : 'Confirmar alquiler' }}
              </v-btn>
              <p class="text-caption">Una vez que ambas partes acepten, automaticamente de dirigiras a la siguiente pantalla</p>
            </v-col>
            <v-col v-else>
              <p>Aqui aparecera el boton de confirmación del alquiler una vez que ambas partes hayan firmado y la fianza haya sido pagada</p>
            </v-col>
          </v-row>
        </div>
        <div v-else-if="rentalData.status === 'ongoing' || rentalData.status === 'finalized'" style="height: 100%">
          <v-row style="height: 100%">
            <v-col>
              <p class="text-h5">Alquiler {{ rentalData.status === 'ongoing' ? 'en proceso' : 'cerrado' }}</p>
              <p>Aqui puede visualizar el contrato, asi como los pagos requeridos por el propietario</p>
              <v-row>
                <v-col>
                  <v-btn class="rounded mb-6" x-large block elevation="0" color="primary" :href="rentalData.contract_url">
                    Descargar contrato de alquiler
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn class="rounded mb-6" x-large block elevation="0" color="primary" outlined @click="downloadDocuments">
                    Descargar documentación
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="text-center">
                <v-col>
                  <p class="ma-0">Fdo. {{ userDoc.name }}</p>
                  <img :src="rentalData.tenantSignature" style="height: 100px;">
                </v-col>
                <v-col>
                  <p class="ma-0">Fdo. {{ otherPersonData.name }}</p>
                  <img :src="rentalData.ownerSignature" style="height: 100px;">
                </v-col>
              </v-row>
              <div style="height: 50%; overflow-y: auto">
                <div v-if="additionalInvoices.length === 0" style="display: flex; flex-direction: column; justify-content: center; align-center: center; height: 100%; width: 100%">
                  <p class="ma-0 text-center">No hay facturas por pagar, y tampoco hay historial de pagos</p>
                </div>
                <v-list v-else>
                  <v-row no-gutters align="center" class="py-6" style="position: sticky; top: 0; background-color: white; z-index: 500">
                    <p class="mb-0 font-weight-bold">Lista de facturas</p>
                  </v-row>
                  <div v-for="(invoice, index) in additionalInvoices" :key="index">
                    <v-divider class="pa-0 mb-6" />
                    <v-row no-gutters align="center">
                      <p class="ma-0">{{ invoice.items[0].description }}</p>
                      <v-spacer />
                      <p class="ma-0">{{ invoice.items[0].amount / 100 }}€</p>
                      <v-btn class="rounded-sm" text :href="invoice.stripeInvoiceUrl" target="_blank">{{ invoice.stripeInvoiceStatus !== 'paid' ? 'Pagar' : 'Pagado, ver justificante' }}</v-btn>
                    </v-row>
                    <v-divider class="pa-0 mt-6" />
                  </div>
                </v-list>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
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
    invoiceListener: any = null
    invoiceData: any = null
    additionalInvoices: any[] = []
    additionalInvoiceListener: any = null

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

    downloadDocuments() {
      this.listingData.documents.forEach((doc: string) => window.open(doc))
    }

    beforeDestroy() {
      if (this.rentalDataListener) this.rentalDataListener()
      if (this.invoiceListener) this.invoiceListener()
      if (this.additionalInvoiceListener) this.additionalInvoiceListener()
    }

    acceptContract() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ status: 'down_payment' })
    }

    confirmRental() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ tenant_confirm: true })
      if(this.rentalData.owner_confirm) {
        this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ status: 'ongoing' })
      }
    }

    @Watch('rentalData.downpayment_invoice')
    initializeInvoiceListener() {
      console.log('initializing invoice listener')
      this.invoiceListener = this.$fire.firestore.doc(`invoices/${this.rentalData.downpayment_invoice}`).onSnapshot(response => {
        this.invoiceData = response.data()
      })
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