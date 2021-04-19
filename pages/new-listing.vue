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
            <v-text-field class="rounded mb-3" filled rounded label="Nombre" hide-details="false" />
            <v-row no-gutters class="mb-3">
              <v-col cols="10">
                <v-text-field class="rounded" filled rounded label="Metros" hide-details="false" />
              </v-col>
              <v-col class="d-flex flex-col justify-center align-center">
                <p class="ma-0">m2</p>
              </v-col>
            </v-row>
            <v-textarea class="rounded mb-3" filled rounded label="Descripción edificio" hide-details="false" />
            <v-textarea class="rounded mb-3" filled rounded label="Equipamiento" hide-details="false" />
            <v-textarea class="rounded" filled rounded label="Comentarios" hide-details="false" />
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
                <v-text-field class="rounded mb-3" filled rounded label="Calle" hide-details="false" required />
              </v-col>
              <v-col>
                <v-text-field class="rounded mb-3" filled rounded label="Numero" hide-details="false" type="number" required />
              </v-col>
            </v-row>
            <v-text-field class="rounded mb-3" filled rounded label="Información adicional" placeholder="Portal, Piso, Puerta..." hide-details="false" />
            <v-row>
              <v-col>
                <v-text-field class="rounded mb-3" filled rounded label="Cod. Postal" hide-details="false" required type="number" />
              </v-col>
              <v-col cols="8">
                <v-text-field class="rounded mb-3" filled rounded label="Ciudad" hide-details="false" required />
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-3">
              <v-btn class="rounded-sm mr-2" elevation="0" @click="currentStep = 2" text>Anterior</v-btn>
              <v-btn class="rounded-sm" elevation="0" color="primary" @click="currentStep = 4">Siguiente</v-btn>
            </v-row>
          </div>
        </v-stepper-content>
        <v-stepper-step step="4">Documentación</v-stepper-step>
        <v-stepper-content step="4">
          <div>
            <p>Por favor, suba aqui todos los documentos relacionados al inmueble</p>
            <p class="text-caption">Por ejemplo la cédula de habitabilidad, certificado de eficiencia energética</p>
            <div class="image-upload-block" @click="$refs.documentInput.click()">
              <p class="ma-0">Arrastra aqui los documentos, o haz click para elegirlos</p>
            </div>
            <input ref="documentInput" style="display: none" type="file" multiple @change="handleDocumentFiles">
          </div>
        </v-stepper-content>
      </v-stepper>
    </v-col>
    <v-col class="overview-box ml-2 pl-8">
      <p class="text-h6 mt-5">Resumen del inmueble</p>
      <p v-if="selectedType">{{ selectedType }}<span v-if="selectedSubtype"> - {{ selectedSubtype }}</span></p>
    </v-col>
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
    types = types
    subtypes = subtypes

    currentStep = 1
    selectedType: string = ''
    selectedSubtype: string = ''

    handleDocumentFiles(event: any) {
      console.log(event.target.files)
      if (event.target.files.length > 0) {
        
      }
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
  background-color: rgba(0, 0, 0, 0.06);
}

.image-upload-block {
  width: 100%;
  height: 12rem;
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