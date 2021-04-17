<template>
  <v-row no-gutters justify="center">
    <v-col cols="4" class="text-center">
      <v-form ref="settingsForm">
        <p class="text-h4">Tus ajustes</p>
        <v-text-field v-model="userName" class="rounded" rounded filled label="Tu nombre" required :rules="requiredRule" />
        <v-text-field v-model="userAddress" label="Dirección completa" rounded filled class="rounded" required :rules="requiredRule" />
        <v-row>
          <v-col>
            <v-select
              class="rounded"
              :items="documentTypes"
              v-model="selectedDocumentType"
              filled
              rounded
              placeholder="Tipo de documento"
            />
          </v-col>
          <v-col>
            <v-text-field v-model="userDocNumber" class="rounded" rounded filled label="Numero de documento" :rules="requiredRule"/>
          </v-col>
        </v-row>
        <v-text-field v-model="userTelephone" class="rounded" rounded filled label="Telefono" type="tel" :rules="requiredRule"/>
        <v-btn :loading="isLoading" x-large color="primary" @click="save" elevation="0" block class="mb-3">Guardar información</v-btn>
      </v-form>
      <v-expand-transition>
        <v-alert v-if="showSuccess" text type="success">Tus datos se han modificado correctamente</v-alert>
        <v-alert v-if="showError" text type="error">Algo ha ido mal al actualizar tus datos, intentalo de nuevo</v-alert>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex'
  @Component({
    computed: {
      ...mapState({
        userDoc: 'userDoc'
      })
    },
    middleware: ['authenticated']
  })
  export default class SettingsPage extends Vue {
    // default vars
    userDoc!: any
    documentTypes = [
      'Pasaporte',
      'DNI',
      'NIE'
    ]
    requiredRule = [(v: any) => !!v || 'Este campo es obligatorio']
    showSuccess = false
    showError = false
    isLoading = false

    // models
    userName: string | null = null
    selectedDocumentType: string | null = null
    userDocNumber: string | null = null
    userAddress: string |  null = null
    userTelephone: string | null = null


    mounted() {
      this.selectedDocumentType = this.userDoc.document?.docType
      this.userDocNumber = this.userDoc.document?.number
      this.userName = this.userDoc.name
      this.userAddress = this.userDoc.address
      this.userTelephone = this.userDoc.telephone
    }

    save() {
      if((this.$refs.settingsForm as any).validate()) {
        this.isLoading = true
        this.$fire.firestore.doc(`users/${this.userDoc.id}`).update({
          name: this.userName,
          document: {
            docType: this.selectedDocumentType,
            number: this.userDocNumber
          },
          address: this.userAddress,
          telephone: this.userTelephone
        }).then(() => {
          this.isLoading = false
          this.showSuccess = true
          setTimeout(() => this.showSuccess = false, 3000)
        }).catch(error => {
          this.isLoading = false
          console.log(error)
          this.showError = true
          setTimeout(() => this.showError = false, 3000)
        })
      }
    }
  }
</script>