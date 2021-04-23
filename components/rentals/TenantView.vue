<template>
  <div style="height: 100%; width: 100%; background-color: white" class="rounded"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class RentalDetailPage extends Vue {
    rentalData: any | null = null
    listingData: any | null = null
    loading: boolean = true

    mounted() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).get().then(async result => {
        this.rentalData = result.data()!
        this.listingData = (await this.$fire.firestore.doc(`listings/${this.rentalData.listing}`).get()).data()
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    }

  }
</script>

<style lang="scss" scoped>

</style>