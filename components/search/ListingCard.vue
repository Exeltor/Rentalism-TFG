<template>
  <div class="pa-2 card">
    <v-row no-gutters>
      <div class="picture-container">
        <div v-if="item.photos.length === 1" class="single-picture">
          <img :src="item.photos[0]">
        </div>
        <div v-else-if="item.photos.length === 2" class="double-picture">
          <v-row no-gutters>
            <img :src="item.photos[0]" style="height: 180px; width: 50%" class="mr-1">
            <img :src="item.photos[1]" style="height: 180px; width: 50%" class="ml-1">
          </v-row>
        </div>
        <div v-else class="triple-picture">
          <div style="display: flex; flex-direction: row; height: 180px">
            <img :src="item.photos[0]" style="height: 180px; width: 50%;" class="mr-1">
            <div style="display: flex; flex-direction: column; width: 50%" class="ml-1">
              <img :src="item.photos[1]" style="height: 90px" class="mb-1">
              <img :src="item.photos[2]" style="height: 90px" class="mt-1">
            </div>
          </div>
        </div>
      </div>
      <v-col class="ml-2">
        <p class="text-h5 mb-0">{{ item.name }}</p>
        <p class="mb-0">{{ item.type }} - {{ item.subtype }}</p>
        <p class="mb-10"><img src="@/assets/images/area-icon.svg" style="height: 1.2rem; vertical-align: sub" class="mr-1">{{ item.metres }} m2</p>
        <v-row no-gutters>
          <v-col>
            <p class="mb-0">{{ item.location.address }}, {{ item.location.number }}</p>
            <p class="mb-0">{{ item.location.postalCode }} - {{ item.location.city }}</p>
          </v-col>
          <div class="pa-1 px-4 text-center mb-5" style="background-color: #77B6C0; border-radius: 1.5rem; color: white;">
            <p style="font-weight: bold" class="text-h6 mb-0">{{ item.price }} €</p>
            <p class="mb-0">al mes</p>
          </div>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component
  export default class ListingCard extends Vue {
    @Prop({ type: Object, required: true }) readonly item!: any
  }
</script>

<style lang="scss" scoped>
img {
  object-fit: cover;
}
.card {
  border-radius: 2rem;
  border: #ECECEC solid 1px;
  height: 200px;
}
.picture-container {
  height: 180px;
  width: 250px;
  border-radius: 2rem;
  overflow: hidden;
}
.single-picture {
  height: inherit;
  img {
    height: inherit;
  }
}

.double-picture {
  height: inherit;
  img {
    height: inherit;
  }
}

.triple-picture {
  height: inherit;
  img {
    height: inherit;
  }
}
</style>
