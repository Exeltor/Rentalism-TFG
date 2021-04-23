<template>
  <div>
    <div class="full-height">
      <div v-if="loading" class="centered-content" style="height: 100%">
        <v-progress-circular indeterminate color="secondary" />
      </div>
      <div v-if="!rentalData && !loading" class="centered-content" style="height: 100%">
        <img class="mb-8" style="width: 8rem" src="@/assets/images/question-cloud.svg" alt="Not found">
        <p class="text-h3 ma-0">Parece que este alquiler no existe</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class RentalDetailPage extends Vue {
    rentalData: Object | null = null
    loading: boolean = true

    mounted() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).get().then(result => {
        this.rentalData = result.data()!
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    }

  }
</script>

<style lang="scss" scoped>
.full-height {
  height: 97vh;
}

.centered-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>