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
    <v-row>
      <v-col cols="3">
        <v-select
          class="rounded"
          :items="items"
          v-model="value"
          filled
          rounded
          placeholder="Tipo"
        >
          <img slot="prepend-inner" src="@/assets/images/chevron-down.svg" alt="chevron-down" style="height: 25px; width: 25px">
        </v-select>
      </v-col>
      <v-col cols="3">
        <v-select
          class="rounded"
          :items="items"
          v-model="value"
          filled
          rounded
          placeholder="Subtipo"
        >
          <img slot="prepend-inner" src="@/assets/images/chevron-down.svg" alt="chevron-down" style="height: 25px; width: 25px">
        </v-select>
      </v-col>
      <v-col cols="6">
        <v-text-field class="rounded" filled rounded placeholder="Localidad">
          <img slot="prepend-inner" src="@/assets/images/search-icon.svg" alt="search-icon" style="height: 25px; width: 25px">
        </v-text-field>
        <v-btn class="rounded" x-large elevation="0" width="50%" color="primary">
          Buscar
          <img src="@/assets/images/arrow-right-white.svg" alt="arrow-right" style="width: 25px">
        </v-btn>
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
  }
</script>

<style lang="scss" scoped>
.hero-image {
  width: 80%;
}
</style>
