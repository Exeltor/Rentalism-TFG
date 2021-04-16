<template>
  <v-row>
    <v-col class="d-flex flex-column align-center">
      <v-avatar height="200" width="200" class="rounded" color="primary">
        <v-img v-if="user.imageUrl" :src="user.imageUrl" />
        <div v-else class="pa-5">
          <v-img :src="require('@/assets/images/user-icon.svg')" width="50%" />
          <p>¡Añade una foto de perfil!</p>
        </div>
      </v-avatar>
      <p class="text-h4 pt-3">{{ user.name }}</p>
      <p>{{ user.listings ? user.listings.length > 0 ? user.listings.length : 'No tiene' : 'No tiene' }} inmuebles en exposición</p>
      <v-rating />
      <v-row class="mt-3">
        <v-btn icon nuxt to="/messages" class="mr-16" x-large>
          <img src="@/assets/images/message-icon.svg" height="40" width="40">
        </v-btn>
        <v-btn icon x-large>
          <img src="@/assets/images/flag-icon.svg" height="40" width="40">
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
  @Component({
    async asyncData({ params, app }) {
      return app.$fire.firestore.doc(`users/${params.id}`).get().then(result => {
        return { user: result.data() }
      }).catch(error => {
        return { user: null }
      })
    }
  })
  export default class ProfilePage extends Vue {
    user!: any

    mounted() {
      console.log(this.user)
    }
  }
</script>