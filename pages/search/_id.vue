<template>
  <div>
    <client-only>
      <swiper ref="photoSwiper">

      </swiper>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
  @Component({
    asyncData({ params, app }) {
      return app.$fire.firestore.doc(`listings/${params.id}`).get().then(result => {
        return { listingData: result.data() }
      })
    }
  })
  export default class ListingDetailPage extends Vue {
    listingData!: any
  }
</script>

<style lang="scss" scoped>
.full-height {
  height: 100vh;
}
</style>