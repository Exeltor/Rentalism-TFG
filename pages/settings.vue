<template>
  <v-row no-gutters justify="center"> 
    <v-col class="text-center">
      <p class="text-h4">Tus ajustes</p>
      <v-row justify="center" class="mt-5">
        <v-col cols="4" class="text-center">
          <p class="text-h6">Información básica</p>
          <v-form ref="settingsForm">
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
          </v-form>
        </v-col>
        <v-col cols="4">
          <p class="text-h6">Documentación</p>
          <div class="text-left">
            <p>Sube aqui una foto de la cara principal de tu documento de identificación</p>
            <div class="image-upload-block mb-2" @click="$refs.documentInput.click()">
              <img v-if="!documentImagePreview && !userDoc.document.image" class="upload-plus-icon" src="@/assets/images/plus-icon.svg" alt="Add">
              <v-img v-else contain :src="documentImagePreview || userDoc.document.image" max-height="100%" />
              <input ref="documentInput" type="file" accept="image/*" style="display: none" @change="handleDocumentInput">
            </div>
            <v-expand-transition>
              <p v-if="!documentImagePresent" class="text-caption error--text">La imagen del documento es obligatoria</p>
            </v-expand-transition>
            <p class="text-caption">Asegurate que sea el mismo documento que el introducido en la Información Básica</p>
          </div>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8">
          <v-expand-transition>
            <v-alert v-if="showSuccess" text type="success">Tus datos se han modificado correctamente</v-alert>
            <v-alert v-if="showError" text type="error">Algo ha ido mal al actualizar tus datos, intentalo de nuevo</v-alert>
          </v-expand-transition>
          <v-btn :loading="isLoading" x-large color="primary" @click="save" elevation="0" class="mb-3" block>Guardar información</v-btn>
        </v-col>
      </v-row>
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
    documentImagePreview: string | null = null
    documentImageFile: File | null = null
    documentImagePresent: boolean = true

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
      if (this.userDoc.document?.image) this.documentImagePresent = true
    }

    handleDocumentInput(e: any) {
      if (e.target.files) {
        const file = e.target.files[0]
        this.documentImagePreview = URL.createObjectURL(file)
        this.documentImageFile = file
        this.documentImagePresent = true
      }
    }

    save() {
      if (this.userDoc.document?.image || this.documentImageFile) {
        this.documentImagePresent = true
      } else {
        this.documentImagePresent = false
      }
      if((this.$refs.settingsForm as any).validate() && this.documentImagePresent) {
        this.isLoading = true

        if(this.documentImageFile) {
          console.log('uploading file')
          Promise.all([
            this.$fire.firestore.doc(`users/${this.userDoc.id}`).update({
              name: this.userName,
              'document.docType': this.selectedDocumentType,
              'document.number': this.userDocNumber,
              address: this.userAddress,
              telephone: this.userTelephone
            }),
            this.$fire.storage.ref(`personal_documents/${this.userDoc.id}.${this.documentImageFile!.name.split('.').pop()}`).put(new Blob([this.documentImageFile!]))
          ]).then(results => {
            results[1].ref.getDownloadURL().then(url => {
              this.$fire.firestore.doc(`users/${this.userDoc.id}`).update({
                'document.image': url
              })
            })
            this.isLoading = false
            this.showSuccess = true
            setTimeout(() => this.showSuccess = false, 3000)
          }).catch(errors => {
            console.log(errors)
            this.isLoading = false
            this.showError = true
            setTimeout(() => this.showError = false, 3000)
          })
        } else if (this.userDoc.document?.image) {
          console.log('not uploading file')
          this.$fire.firestore.doc(`users/${this.userDoc.id}`).update({
            name: this.userName,
            'document.docType': this.selectedDocumentType,
            'document.number': this.userDocNumber,
            address: this.userAddress,
            telephone: this.userTelephone
          }).then(() => {
            this.isLoading = false
            this.showSuccess = true
            setTimeout(() => this.showSuccess = false, 3000)
          }).catch(errors => {
            console.log(errors)
            this.isLoading = false
            this.showError = true
            setTimeout(() => this.showError = false, 3000)
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.image-upload-block {
  width: 10rem;
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