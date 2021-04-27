<template>
  <div v-if="loading" style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center">
    <v-progress-circular color="secondary" indeterminate />
  </div>
  <client-only v-else>
    <div v-if="!rentalData" style="height: 100vh; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center">
      <v-icon color="primary" size="100">mdi-help</v-icon>
      <p>Este proceso de alquiler no existe...</p>
    </div>
    <div v-else-if="rentalData && (personaFirma === 'tenant' && !rentalData.tenantSignature || personaFirma === 'owner' && !rentalData.ownerSignature)" style="height: 100vh; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center">
      <p class="text-h4">{{ personaFirma === 'tenant' ? 'Inquilino' : 'Propietario' }}</p>
      <p class="text-h6">Firme el contrato de alquiler</p>
      <vue-signature ref="signature" :w="'300px'" :h="'300px'" class="mb-4"/>
      <v-btn class="rounded mb-2" x-large elevation="0" color="primary" outlined style="width: 300px" @click="clear" :loading="signLoading">
        Limpiar y firmar de nuevo
      </v-btn>
      <v-btn class="rounded" x-large elevation="0" color="primary" style="width: 300px" @click="sign" :loading="signLoading">
        Firmar
      </v-btn>
      <v-dialog v-model="showSuccessDialog" persistent fullscreen>
        <v-card style="height: 100vh; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center">
          <v-icon color="primary" size="100">mdi-check</v-icon>
          <p class="text-h4 text-center">Gracias por firmar el documento. Puedes cerrar esta pestaña</p>
        </v-card>
      </v-dialog>
    </div>
    <div v-else style="height: 100vh; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center">
      <v-icon color="primary" size="100">mdi-help</v-icon>
      <p class="text-center">Algo ha ido mal o no tiene permisos para firmar este documento</p>
    </div>
  </client-only>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import vueSignature from 'vue-signature';

  @Component({
    layout: 'empty',
    components: {
      vueSignature
    }
  })
  export default class SignaturePad extends Vue {
    loading = true
    rentalData: any = null
    personaFirma: any = ''
    showSuccessDialog: boolean = false
    signLoading = false;

    mounted() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).get().then(result => {
        this.rentalData = result.data()
        this.loading = false
      })
      this.personaFirma = this.$route.query.role
    }

    clear() {
      (this.$refs.signature as any).clear()
    }

    sign() {
      this.signLoading = true
      const signature = (this.$refs.signature as any).save('image/jpeg')
      if(this.personaFirma === 'tenant') {
        this.$fire.storage.ref(`rentals/${this.$route.params.id}/tenantSignature.jpeg`).put(this.dataURItoBlob(signature)).then(result => {
          result.ref.getDownloadURL().then(downloadurl => {
            this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ tenantSignature: downloadurl })
            this.signLoading = false
            this.showSuccessDialog = true
          })
        })
      } else {
        this.$fire.storage.ref(`rentals/${this.$route.params.id}/ownerSignature.jpeg`).put(this.dataURItoBlob(signature)).then(result => {
          result.ref.getDownloadURL().then(downloadurl => {
            this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).update({ ownerSignature: downloadurl })
            this.signLoading = false
            this.showSuccessDialog = true
          })
        })
      }
    }

    dataURItoBlob(dataURI:any) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], { type: mimeString });
    }
  }
</script>

<style lang="scss" scoped>

</style>
