<template>
  <div>
    <v-row class="hero-section">
      <v-col cols="6" class="d-flex flex-column justify-center align-center">
        <div>
          <h2 class="text-h2 font-weight-bold">Rentalism</h2>
          <p class="text-h6">Tu centro de alquiler</p>
        </div>
      </v-col>
      <v-col cols="6" class="d-flex justify-center align-center">
        <img class="hero-image" src="@/assets/images/mountains-icon.svg" alt="Mountains Hero Icon">
      </v-col>
    </v-row>
    <p class="text-h4 font-weight-bold">¿Que buscas?</p>
    <v-row style="margin-bottom: 4em">
      <v-col cols="3">
        <v-select
          class="rounded"
          :items="items"
          v-model="selectedType"
          filled
          rounded
          placeholder="Tipo"
        >
          <img slot="prepend-inner" src="@/assets/images/chevron-down.svg" alt="chevron-down" style="height: 25px; width: 25px">
          <div slot="append-icon" />
        </v-select>
      </v-col>
      <v-col cols="3">
        <v-select
          class="rounded"
          :items="items"
          v-model="selectedSubtype"
          filled
          rounded
          placeholder="Subtipo"
        >
          <img slot="prepend-inner" src="@/assets/images/chevron-down.svg" alt="chevron-down" style="height: 25px; width: 25px">
          <div slot="append-icon" />
        </v-select>
      </v-col>
      <v-col cols="6">
        <v-text-field class="rounded" filled rounded placeholder="Localidad" v-model="city">
          <img slot="prepend-inner" src="@/assets/images/search-icon.svg" alt="search-icon" style="height: 25px; width: 25px">
        </v-text-field>
        <div class="text-right">
          <v-btn class="rounded" x-large elevation="0" width="50%" color="primary">
            <div class="d-flex flex-row justify-end align-center" style="width: 100%">
              Buscar
              <img src="@/assets/images/arrow-right-white.svg" alt="arrow-right" style="width: 25px">
            </div>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="text-h6">
      <v-col class="d-flex flex-column align-start">
        <div class="d-flex flex-row justify-center align-center mb-6">
          <img class="rounded mr-3" src="@/assets/images/Madrid-illustration.jpg" width="100px" height="100px">
          <div class="d-flex flex-column justify-center">
            <p class="font-weight-bold mb-2">Madrid</p>
            <p class="mb-0">1332 inmuebles</p>
          </div>
        </div>
        <div class="d-flex flex-row justify-center align-center">
          <img class="rounded mr-3" src="@/assets/images/Sevilla-illustration.jpg" width="100px" height="100px">
          <div class="d-flex flex-column justify-center">
            <p class="font-weight-bold mb-2">Sevilla</p>
            <p class="mb-0">452 inmuebles</p>
          </div>
        </div>
      </v-col>
      <v-col class="d-flex flex-column align-start">
        <div class="d-flex flex-row justify-center align-center mb-6">
          <img class="rounded mr-3" src="@/assets/images/Barcelona-illustration.jpg" width="100px" height="100px">
          <div class="d-flex flex-column justify-center">
            <p class="font-weight-bold mb-2">Barcelona</p>
            <p class="mb-0">1192 inmuebles</p>
          </div>
        </div>
        <div class="d-flex flex-row justify-center align-center">
          <img class="rounded mr-3" src="@/assets/images/Zaragoza-illustration.jpg" width="100px" height="100px">
          <div class="d-flex flex-column justify-center">
            <p class="font-weight-bold mb-2">Zaragoza</p>
            <p class="mb-0">321 inmuebles</p>
          </div>
        </div>
      </v-col>
      <v-col class="d-flex flex-column align-start">
        <div class="d-flex flex-row justify-center align-center mb-6">
          <img class="rounded mr-3" src="@/assets/images/Valencia-illustration.jpg" width="100px" height="100px">
          <div class="d-flex flex-column justify-center">
            <p class="font-weight-bold mb-2">Valencia</p>
            <p class="mb-0">532 inmuebles</p>
          </div>
        </div>
        <div class="d-flex flex-row justify-center align-center">
          <img class="rounded mr-3" src="@/assets/images/Malaga-illustration.jpg" width="100px" height="100px">
          <div class="d-flex flex-column justify-center">
            <p class="font-weight-bold mb-2">Málaga</p>
            <p class="mb-0">135 inmuebles</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
  @Component
  export default class HomePage extends Vue {
    items = [
      'Mostro',
      'Titan',
      'Loquillo'
    ]

    selectedType: string = ''
    selectedSubtype: string = ''
    city: string = ''
  }
</script>

<style lang="scss" scoped>
.hero-image {
  width: 80%;
}
</style>
