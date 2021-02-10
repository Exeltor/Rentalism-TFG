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
    <v-col></v-col>
    <v-col></v-col>
    <v-col></v-col>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  width: 80%;
}
</style>
