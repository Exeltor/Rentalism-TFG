<template>
  <div>
    <div v-if="loading" class="full-height centered-content" style="height: 100%">
      <v-progress-circular indeterminate color="secondary" />
    </div>
    <div v-if="!rentalData && !loading" class="full-height centered-content" style="height: 100%">
      <img class="mb-8" style="width: 8rem" src="@/assets/images/question-cloud.svg" alt="Not found">
      <p class="text-h3 ma-0">Parece que este alquiler no existe</p>
    </div>
    <div v-if="rentalData && !loading" class="full-height">
      <p class="text-h4 font-weight-bold">Alquiler de {{ listingData.name }}</p>
      <v-divider class="mb-5" />
      <v-row style="height: 90vh">
        <v-col cols="8">
          <TenantView v-if="rentalData.tenant === $store.state.authUser.uid && otherPersonData" :other-person-data="otherPersonData" />
          <OwnerView v-if="rentalData.owner === $store.state.authUser.uid && otherPersonData" :other-person-data="otherPersonData"/>
        </v-col>
        <v-col cols="4">
          <div class="rounded chat-main pa-4" style="height: 100%; background-color: white">
            <div class="title-container mb-2">
              <img src="@/assets/images/message-icon.svg" alt="Chat" style="height: 40px;" class="mr-2">
              <p v-if="otherPersonData" class="mb-0 font-weight-bold">{{ otherPersonData.name }}</p>
            </div>
            <v-divider />
            <div class="message-container pr-2 pt-1" v-chat-scroll="{smooth: true, scrollonremoved:true, smoothonremoved: false}">
              <div v-if="messages.length > 0" style="width: 100%" class="message-wrapper">
                <div v-for="message in messages" :key="message.id" class="pa-2 rounded message-bubble" style="background-color: #eeeeee;" :style="message.sender !== $store.state.authUser.uid ? 'align-self: flex-start;' : 'align-self: flex-end;'">
                  <p v-if="otherPersonData" class="mb-0 font-weight-bold" :class="message.sender !== $store.state.authUser.uid ? 'text-left' : 'text-right'">{{ message.sender !== $store.state.authUser.uid ? otherPersonData.name : 'Tú' }}</p>
                  <p style="white-space: pre-wrap;">{{ message.message }}</p>
                  <p class="text-caption mb-0" :class="message.sender !== $store.state.authUser.uid ? 'text-left' : 'text-right'">{{ message.timestamp.toDate().toLocaleTimeString() }}</p>
                </div>
              </div>
              <div v-else style="height: inherit; width: 100%" class="empty-messages-placeholder">
                <p class="mb-0">No hay mensajes... ¡Escribe uno!</p>
              </div>
            </div>
            <v-divider class="my-4" />
            <div class="input-container">
              <v-textarea v-model="chatMessageText" class="rounded mr-1" filled rounded placeholder="Escribe tu mensaje..." auto-grow rows="1" hide-details="false" />
              <v-btn icon large><img src="@/assets/images/send-message-icon.svg" alt="Send" style="transform: rotate(90deg); height: 30px;" @click="sendMessage"></v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TenantView from '@/components/rentals/TenantView.vue'
import OwnerView from '@/components/rentals/OwnerView.vue'

  @Component({
    components: {
      TenantView,
      OwnerView
    }
  })
  export default class RentalDetailPage extends Vue {
    rentalData: any | null = null
    listingData: any | null = null
    loading: boolean = true
    chatMessageText: string = ''
    otherPersonData: any = null
    chatListener: any = null
    messages: any[] = []

    mounted() {
      this.$fire.firestore.doc(`rentals/${this.$route.params.id}`).get().then(async result => {
        this.rentalData = result.data()!
        this.listingData = (await this.$fire.firestore.doc(`listings/${this.rentalData.listing}`).get()).data()
        console.log(this.$store.state.authUser.uid, 'my uid')
        console.log(this.rentalData.owner, 'owner uid')
        console.log(this.rentalData.tenant, 'tenant uid')
        if(this.$store.state.authUser.uid === this.rentalData.owner) {
          console.log('i am owner')
          this.$fire.firestore.doc(`users/${this.rentalData.tenant}`).get().then(result => {
            this.otherPersonData = result.data()
          })
        } else if (this.$store.state.authUser.uid === this.rentalData.tenant) {
          console.log('i am tenant')
          this.$fire.firestore.doc(`users/${this.rentalData.owner}`).get().then(result => {
            this.otherPersonData = result.data()
            console.log(this.otherPersonData)
          })
        }

        this.loading = false
      }).catch(error => {
        console.log(error)
      })

      this.chatListener = this.$fire.firestore
        .collection(`rentals/${this.$route.params.id}/messages`)
        .orderBy('timestamp', 'asc')
        .limitToLast(50)
        .onSnapshot(data => {
          this.messages = data.docs.map((doc) => {
            const data = doc.data()
            data.id = doc.id
            return data
          })
        })
    }

    beforeDestroy() {
      if (this.chatListener) this.chatListener()
    }

    sendMessage() {
      this.$fire.firestore.collection(`rentals/${this.$route.params.id}/messages`).add({
        message: this.chatMessageText,
        sender: this.$store.state.authUser.uid,
        timestamp: new Date
      })
      this.chatMessageText = ''
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

.chat-main {
  display: flex;
  flex-direction: column;

  .message-container {
    display: flex;
    flex: 1 1 auto;
    height: 0px;
    overflow-y: auto;

    .empty-messages-placeholder {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .message-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: fit-content;

      .message-bubble:not(:last-child) {
        margin-bottom: .8rem;
      }
      
    }
  }

  .input-container {
    flex-grow: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .title-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>