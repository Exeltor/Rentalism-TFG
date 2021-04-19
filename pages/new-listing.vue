<template>
  <v-row class="full-height" no-gutters>
    <v-col class="mr-2" style="background-color: white; border-radius: 2rem; height: 100%; overflow: scroll">
      <p class="text-h6 pl-8 mt-5">Crea tu inmueble</p>
      <v-stepper v-model="currentStep" vertical class="elevation-0">
        <v-stepper-step step="1">Tipo de inmueble</v-stepper-step>
        <v-stepper-content step="1">
          <div>
            Elija el tipo y el subtipo del inmueble
            <v-select
              class="rounded"
              :items="types"
              v-model="selectedType"
              filled
              rounded
              placeholder="Tipo"
            >
              <img slot="prepend-inner" src="@/assets/images/chevron-down.svg" alt="chevron-down" style="height: 25px; width: 25px">
              <div slot="append-icon" />
            </v-select>
            <v-select
              class="rounded"
              :items="subtypes[selectedType]"
              v-model="selectedSubtype"
              filled
              rounded
              placeholder="Subtipo"
            >
              <img slot="prepend-inner" src="@/assets/images/chevron-down.svg" alt="chevron-down" style="height: 25px; width: 25px">
              <div slot="append-icon" />
            </v-select>
            <v-btn class="rounded-sm" elevation="0" color="primary" @click="currentStep = 2">Siguiente</v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-step step="2">Datos del inmueble</v-stepper-step>
        <v-stepper-content step="2">
          <div>
            <v-text-field v-model="name" class="rounded mb-3" filled rounded label="Nombre" hide-details="false" />
            <v-row no-gutters class="mb-3">
              <v-col cols="10">
                <v-text-field v-model="metres" class="rounded" filled rounded label="Metros" type="number" hide-details="false" />
              </v-col>
              <v-col class="d-flex flex-col justify-center align-center">
                <p class="ma-0">m2</p>
              </v-col>
            </v-row>
            <v-textarea v-model="descriptionBuilding" class="rounded mb-3" filled rounded label="Descripción edificio" hide-details="false" />
            <v-textarea v-model="equipment" class="rounded mb-3" filled rounded label="Equipamiento" hide-details="false" />
            <v-textarea v-model="comments" class="rounded" filled rounded label="Comentarios" hide-details="false" />
            <v-row no-gutters class="mt-3">
              <v-btn class="rounded-sm mr-2" elevation="0" @click="currentStep = 1" text>Anterior</v-btn>
              <v-btn class="rounded-sm" elevation="0" color="primary" @click="currentStep = 3">Siguiente</v-btn>
            </v-row>
          </div>
        </v-stepper-content>
        <v-stepper-step step="3">Ubicación</v-stepper-step>
        <v-stepper-content step="3">
          <div>
            <v-row>
              <v-col cols="8">
                <v-text-field v-model="address" class="rounded mb-3" filled rounded label="Calle" hide-details="false" required />
              </v-col>
              <v-col>
                <v-text-field v-model="number" class="rounded mb-3" filled rounded label="Numero" hide-details="false" type="number" required />
              </v-col>
            </v-row>
            <v-text-field v-model="additionalAddressInfo" class="rounded mb-3" filled rounded label="Información adicional" placeholder="Portal, Piso, Puerta..." hide-details="false" />
            <v-row>
              <v-col>
                <v-text-field v-model="postalCode" class="rounded mb-3" filled rounded label="Cod. Postal" hide-details="false" required type="number" />
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="city" class="rounded mb-3" filled rounded label="Ciudad" hide-details="false" required />
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-3">
              <v-btn class="rounded-sm mr-2" elevation="0" @click="currentStep = 2" text>Anterior</v-btn>
              <v-btn class="rounded-sm" elevation="0" color="primary" @click="currentStep = 4">Siguiente</v-btn>
            </v-row>
          </div>
        </v-stepper-content>
        <v-stepper-step step="4">Fotos</v-stepper-step>
        <v-stepper-content step="4">
          <div>
            <p>Adjunta fotos para que todos puedan darle un vistazo a tu inmueble</p>
            <p class="text-caption">Procura que las fotos sean de buena calidad (minimo 3 fotos)</p>
            <div v-cloak class="image-upload-block" @click="$refs.imageInput.click()" @dragover.prevent @drop.prevent="handlePictureDrop">
              <p v-if="uploadedPhotos.length === 0" class="ma-0">Arrastra aqui las fotos, o haz click para elegirlas</p>
              <div v-else style="display: block; width: 100%">
                <v-chip v-for="(photo, index) in uploadedPhotos" :key="photo.name" class="ma-1" outlined close @click:close="uploadedPhotos.splice(index, 1)">{{ photo.name }}</v-chip>
              </div>
            </div>
            <input ref="imageInput" style="display: none" type="file" accept="image/*" multiple @change="handlePictureFiles">
            <v-row no-gutters class="mt-3">
              <v-btn class="rounded-sm mr-2" elevation="0" @click="currentStep = 3" text>Anterior</v-btn>
              <v-btn class="rounded-sm" elevation="0" color="primary" @click="currentStep = 5">Siguiente</v-btn>
            </v-row>
          </div>
        </v-stepper-content>
        <v-stepper-step step="5">Documentación</v-stepper-step>
        <v-stepper-content step="5">
          <div>
            <p>Sube aqui todos los documentos relacionados al inmueble</p>
            <p class="text-caption">Por ejemplo la cédula de habitabilidad, certificado de eficiencia energética</p>
            <div v-cloak class="image-upload-block" @click="$refs.documentInput.click()" @dragover.prevent @drop.prevent="handleDocumentDrop">
              <p v-if="uploadedDocuments.length === 0" class="ma-0">Arrastra aqui los documentos, o haz click para elegirlos</p>
              <div v-else style="display: block; width: 100%">
                <v-chip v-for="(document, index) in uploadedDocuments" :key="document.name" class="ma-1" outlined close @click:close="uploadedDocuments.splice(index, 1)">{{ document.name }}</v-chip>
              </div>
            </div>
            <input ref="documentInput" style="display: none" type="file" multiple @change="handleDocumentFiles">
            <v-row no-gutters class="mt-3">
              <v-btn class="rounded-sm mr-2" elevation="0" @click="currentStep = 4" text>Anterior</v-btn>
              <v-btn class="rounded-sm" elevation="0" color="primary" @click="currentStep = 6">Siguiente</v-btn>
            </v-row>
          </div>
        </v-stepper-content>
        <v-stepper-step step="6">Precio</v-stepper-step>
        <v-stepper-content step="6">
          <div>
            <v-row>
              <v-col cols="10">
                <v-text-field v-model="price" class="rounded mb-3" filled rounded label="Cantidad" hide-details="false" required type="number" />
              </v-col>
              <v-col class="d-flex flex-col justify-center align-center">
                <p class="ma-0">€ / mes</p>
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-3">
              <v-btn class="rounded-sm mr-2" elevation="0" @click="currentStep = 5" text>Anterior</v-btn>
              <v-btn class="rounded-sm" elevation="0" color="primary" @click="createListing">Finalizar</v-btn>
            </v-row>
          </div>
        </v-stepper-content>
      </v-stepper>
    </v-col>
    <v-col class="overview-box ml-2 px-8">
      <p class="text-h6 mt-5">Resumen del inmueble</p>
      <p v-if="name" class="text-h4">{{ name }}</p>
      <v-row no-gutters align="center" class="text-h6" justify="space-between">
        <p v-if="selectedType" class="mr-10 mb-0">{{ selectedType }}<span v-if="selectedSubtype"> - {{ selectedSubtype }}</span></p>
        <v-row v-if="metres" no-gutters align="center" justify="end">
          <img class="mr-1" src="@/assets/images/area-icon.svg" alt="Area" style="height: 2rem">
          <p class="ma-0">{{ metres }} m2</p>
        </v-row>
      </v-row>
      <v-row no-gutters justify="space-between">
        <div>
          <p v-if="address" class="mb-0">{{ address }}<span v-if="number">, {{ number }}</span></p>
          <p v-if="additionalAddressInfo" class="mb-0">{{ additionalAddressInfo }}</p>
          <p v-if="postalCode" class="mb-0">{{ postalCode }}</p>
          <p v-if="city">{{ city }}</p>
        </div>
        <p v-if="price" class="text-h6">{{ price }} € / mes</p>
      </v-row>
      <v-row>
        <v-col v-for="picture in picturePreviews" :key="picture" cols="3">
          <v-img :src="picture" aspect-ratio="1" />
        </v-col>
      </v-row>
      <div v-if="descriptionBuilding" class="mt-5">
        <p class="text-h5">Descripción del edificio</p>
        <p style="white-space: pre">{{ descriptionBuilding }}</p>
      </div>
      <div v-if="equipment" class="mt-5">
        <p class="text-h5">Equipamiento</p>
        <p style="white-space: pre">{{ equipment }}</p>
      </div>
      <div v-if="comments" class="mt-5">
        <p class="text-h5">Información adicional</p>
        <p style="white-space: pre">{{ comments }}</p>
      </div>
    </v-col>
    <v-dialog v-model="openFinishDialog" persistent width="600px">
      <v-card class="rounded d-flex flex-column justify-center align-center">
        <v-progress-circular v-if="loading" indeterminate color="primary" />
        <v-icon v-else color="primary" size="10em">mdi-check</v-icon>
        <p class="text-h5">{{ loading ? 'Creando el inmueble...' : '¡Inmueble creado correctamente!' }}</p>
        <v-btn :loading="loading" x-large color="primary" elevation="0" class="mb-3" nuxt to="/listings">Ver mis inmuebles</v-btn>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { types, subtypes } from '@/helpers/constants'
import { mapState } from 'vuex'

  @Component({
    computed: {
      ...mapState({
        userDoc: 'userDoc'
      })
    }
  })
  export default class NewListingPage extends Vue {
    userDoc!: any

    types = types
    subtypes = subtypes

    currentStep = 1
    selectedType: string = ''
    selectedSubtype: string = ''
    name: string = ''
    metres: number | null = null
    descriptionBuilding: string = ''
    equipment: string = ''
    comments: string = ''
    address: string = ''
    number: number | null = null
    additionalAddressInfo: string = ''
    postalCode: number | null = null
    city: string = ''
    price: number | null = null
    uploadedDocuments: File[] = []
    uploadedPhotos: File[] = []
    picturePreviews: any = []

    openFinishDialog = false
    loading = false

    handleDocumentFiles(event: any) {
      if (event.target.files.length > 0) {
        event.target.files.forEach((file: File) => this.uploadedDocuments.push(file))
      }
    }

    handlePictureFiles(event: any) {
      if (event.target.files.length > 0) {
        event.target.files.forEach((file: File) => this.uploadedPhotos.push(file))
      }
    }

    handlePictureDrop(e: any) {
      if (e.dataTransfer.files) {
        const files = e.dataTransfer.files
        files.forEach((file: File) => {
          if (file.type.split('/')[0] === 'image') this.uploadedPhotos.push(file)
        })
      }
    }

    beforeDestroy() {
      this.currentStep = 1
      this.selectedType = ''
      this.selectedSubtype = ''
      this.name = ''
      this.metres = null
      this.descriptionBuilding = ''
      this.equipment = ''
      this.comments = ''
      this.address = ''
      this.number = null
      this.additionalAddressInfo = ''
      this.postalCode = null
      this.city = ''
      this.price = null
      this.uploadedDocuments = []
      this.uploadedPhotos = []
      this.picturePreviews = []

      this.openFinishDialog = false
      this.loading = false
    }

    handleDocumentDrop(e: any) {
      if (e.dataTransfer.files) {
        const files = e.dataTransfer.files
        files.forEach((file: File) => this.uploadedDocuments.push(file))
      }
    }

    createListing() {
      this.openFinishDialog = true
      this.loading = true
      this.$fire.firestore.collection('listings').add({
        name: this.name,
        metres: this.metres,
        descriptionBuilding: this.descriptionBuilding,
        equipment: this.equipment,
        comments: this.comments,
        location: {
          address: this.address,
          number: this.number,
          additionalAddressInfo: this.additionalAddressInfo,
          postalCode: this.postalCode,
          city: this.city
        },
        price: this.price,
        documents: [],
        photos: [],
        user: this.userDoc.id,
        createdAt: new Date()
      }).then(result => {
        this.uploadedDocuments.forEach(document => {
          this.$fire.storage.ref(`listings/${result.id}/documents/${document.name}`)
          .put(new Blob([document])).then(async uploadFile => {
            this.$fire.firestore.doc(`listings/${result.id}`).update({
              documents: this.$fireModule.firestore.FieldValue.arrayUnion(await uploadFile.ref.getDownloadURL())
            })
          })
        })
        this.uploadedPhotos.forEach(photo => {
          this.$fire.storage.ref(`listings/${result.id}/photos/${photo.name}`)
          .put(new Blob([photo])).then(async uploadFile => {
            this.$fire.firestore.doc(`listings/${result.id}`).update({
              photos: this.$fireModule.firestore.FieldValue.arrayUnion(await uploadFile.ref.getDownloadURL())
            })
          })
        })
        this.loading = false
      })
    }

    @Watch('uploadedPhotos')
    handlePhotos() {
      this.picturePreviews.forEach((preview: any) => {
        URL.revokeObjectURL(preview)
      })
      this.uploadedPhotos.forEach(photo => {
        this.picturePreviews.push(URL.createObjectURL(photo))
      })
    }

    @Watch('selectedType')
    handle() {
      this.selectedSubtype = ''
    }

  }
</script>

<style lang="scss" scoped>
.full-height {
  height: 97vh;
}

.overview-box {
  border-radius: 2rem;
  overflow-y: scroll;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.06);
}

.image-upload-block {
  width: 100%;
  min-height: 12rem;
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