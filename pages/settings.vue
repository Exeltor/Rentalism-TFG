<template>
  <v-row no-gutters justify="center">
    <v-col cols="4" class="text-center">
      <p class="text-h4">Tus ajustes</p>
      <v-text-field v-model="userName" class="rounded" rounded filled label="Tu nombre" />
      <v-text-field v-model="userAddress" label="Dirección completa" rounded filled class="rounded" />
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
          <v-text-field v-model="userDocNumber" class="rounded" rounded filled label="Numero de documento"/>
        </v-col>
      </v-row>
      <v-text-field v-model="userTelephone" class="rounded" rounded filled label="Telefono" type="tel" />
      <v-btn color="primary" @click="save">Guardar información</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex'
  @Component({
    ...mapState({
      userDoc: 'userDoc'
    })
  })
  export default class SettingsPage extends Vue {
    // default vars
    userDoc!: any
    documentTypes = [
      'Pasaporte',
      'DNI',
      'NIE'
    ]

    // models
    userName: string | null = null
    selectedDocumentType: string | null = null
    userDocNumber: string | null = null
    userAddress: string |  null = null
    userTelephone: string | null = null


    mounted() {
      console.log(this.userDoc)
      this.selectedDocumentType = this.userDoc.document.docType
      this.userDocNumber = this.userDoc.document.number
      this.userName = this.userDoc.name
      this.userAddress = this.userDoc.address
      this.userTelephone = this.userDoc.telephone
    }

    save() {

    }
  }
</script>