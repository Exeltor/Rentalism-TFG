<template>
  <v-row>
    <v-col class="d-flex flex-column align-center">
      <v-avatar height="200" width="200" class="rounded" color="primary" @click="$route.params.id === $store.state.authUser.uid ? $refs.imageInput.click() : null" style="cursor: pointer">
        <v-img v-if="user.imageUrl" :src="user.imageUrl" />
        <div v-else class="pa-5">
          <v-img :src="require('@/assets/images/user-icon.svg')" width="50%" />
          <p v-if="$route.params.id === $store.state.authUser.uid">Haz click para añadir una foto de perfil</p>
        </div>
      </v-avatar>
      <input v-if="$route.params.id === $store.state.authUser.uid" ref="imageInput" style="display: none" type="file" accept="image/*" @change="handleProfilePicture">
      <p class="text-h4 pt-3">{{ user.name }}</p>
      <p>{{ listings.length > 0 ? listings.length : 'No tiene' }} inmuebles en exposición</p>
      <v-row>
        <v-col cols="6" v-for="listing in listings" :key="listing.id">
          <nuxt-link :to="`/search/${listing.id}`">
            <ListingCard :item="listing" />
          </nuxt-link>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ListingCard from '@/components/search/ListingCard.vue'
  @Component({
    async asyncData({ params, app }) {
      return app.$fire.firestore.doc(`users/${params.id}`).get().then(result => {
        return { user: result.data() }
      }).catch(error => {
        return { user: null }
      })
    },
    components: {
      ListingCard
    },
    middleware: ['authenticated']
  })
  export default class ProfilePage extends Vue {
    user!: any
    userListener: any = null
    listings: any[] = []

    mounted() {
      this.userListener = this.$fire.firestore.doc(`users/${this.$route.params.id}`).onSnapshot(result => {
        this.user = result.data()
      })
      this.$fire.firestore.collection('listings').where('user', '==', this.$route.params.id).get().then(result => {
        this.listings = result.docs.map(doc => { 
          return { ...doc.data(), id: doc.id }
         })
      })
    }

    beforeDestroy() {
      if (this.userListener) this.userListener()
    }
    
    handleProfilePicture(event: any) {
      const file = event.target.files[0]
      this.$fire.storage.ref(`users/${this.$route.params.id}/profile_picture.${file.name.split('.').pop()}`).put(new Blob([file])).then(async response => {
        this.$fire.firestore.doc(`users/${this.$route.params.id}`).update({ imageUrl: await response.ref.getDownloadURL() })
      })
    }
  }
</script>