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
        <p>{{ item.type }} - {{ item.subtype }}</p>
        <p>{{ item.metres }}</p>
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
