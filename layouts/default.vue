<template>
  <v-app light>
    <v-navigation-drawer class="default__navigation" permanent mini-variant mini-variant-width="120px" app>
      <div class="d-flex flex-column justify-space-between" style="height: 100%">
        <v-list nav>
          <v-list-item style="margin-bottom: 50px">
            <nuxt-link to="/">
              <img class="logo" src="@/assets/images/logo.svg" alt="Rentalism">
            </nuxt-link>
          </v-list-item>
          <v-list-item-group color="primary">
            <v-list-item class="navigation__item" tag="nuxt-link" nuxt to="/search" exact exact-active-class="v-item--active">
              <img class="navigation__img" src="@/assets/images/search-icon.svg" alt="Search">
            </v-list-item>
            <v-list-item class="navigation__item" @click.stop="directToLogin" exact exact-active-class="v-item--active">
              <img class="navigation__img" src="@/assets/images/user-icon.svg" alt="Profile">
            </v-list-item>
            <v-list-item class="navigation__item" tag="nuxt-link" nuxt to="/messages" exact exact-active-class="v-item--active">
              <img class="navigation__img" src="@/assets/images/message-icon.svg" alt="Messages">
            </v-list-item>
            <v-list-item class="navigation__item" tag="nuxt-link" nuxt to="/listings" exact exact-active-class="v-item--active">
              <img class="navigation__img" src="@/assets/images/grid-icon.svg" alt="Listings">
            </v-list-item>
            <v-list-item class="navigation__item" tag="nuxt-link" nuxt to="/settings" exact exact-active-class="v-item--active">
              <img class="navigation__img" src="@/assets/images/settings-icon.svg" alt="Settings">
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-btn icon x-large class="align-self-center mb-6">
          <img src="@/assets/images/logout-icon.svg" alt="Logout" style="width: 35px; height: 35px;">
        </v-btn>
      </div>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid style="max-width:1264px">
        <nuxt />
      </v-container>
    </v-main>
    <v-dialog v-model="showLoginModal" max-width="600px" rounded="xl">
      <v-card>
        <v-window v-model="step">
          <v-window-item :value="1">
            <div class="d-flex flex-column align-center pa-10">
              <p class="text-h4 font-weight-bold mb-10">Inicia Sesión</p>
              <v-text-field class="rounded align-self-stretch mb-6" filled rounded placeholder="E-mail" hide-details="auto">
                <img slot="prepend-inner" src="@/assets/images/mail-icon.svg" alt="mail-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-text-field class="rounded align-self-stretch mb-2" filled rounded placeholder="Contraseña" hide-details="auto">
                <img slot="prepend-inner" src="@/assets/images/key-icon.svg" alt="key-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <p class="text-body-1 ma-0 align-self-start">¿Has olvidado tu contraseña? <span style="color: #77B6C0; cursor: pointer">Restaurar</span></p>
              <v-btn class="rounded font-weight-bold my-7" x-large elevation="0" color="primary" style="width: 50%">
                Entrar
              </v-btn>
              <p class="text-body-1 ma-0">O en caso contrario, <span style="color: #77B6C0; cursor: pointer" @click.stop="step = 2">registrate</span></p>
            </div>
          </v-window-item>
          <v-window-item :value="2">
            <div class="d-flex flex-column align-center pa-10">
              <p class="text-h4 font-weight-bold mb-10">Registrate</p>
              <v-text-field class="rounded align-self-stretch mb-2" filled rounded placeholder="E-mail" hide-details="auto">
                <img slot="prepend-inner" src="@/assets/images/mail-icon.svg" alt="mail-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-text-field class="rounded align-self-stretch mb-6" filled rounded placeholder="Nombre" hide-details="auto">
                <img slot="prepend-inner" src="@/assets/images/user-icon-grey.svg" alt="key-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-text-field class="rounded align-self-stretch mb-2" filled rounded placeholder="Contraseña" hide-details="auto">
                <img slot="prepend-inner" src="@/assets/images/key-icon.svg" alt="mail-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-text-field class="rounded align-self-stretch mb-2" filled rounded placeholder="Repite Contraseña" hide-details="auto">
                <img slot="prepend-inner" src="@/assets/images/key-icon.svg" alt="key-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-btn class="rounded font-weight-bold my-7" x-large elevation="0" color="primary" style="width: 50%">
                Registraro
              </v-btn>
              <p class="text-body-1 ma-0">O en caso contrario, <span style="color: #77B6C0; cursor: pointer" @click.stop="step = 1">inicia sesión</span></p>
            </div>
          </v-window-item>
        </v-window>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
  @Component
  export default class Layout extends Vue {
    showLoginModal = false
    step = 1

    directToLogin() {
      if(!this.$store.getters.isLoggedIn) {
        this.showLoginModal = true
      } else {
        this.$router.push('/profile')
      }
    }

    @Watch('showLoginModal')
    handleSwitch(value: any) {
      if (value === false) {
        this.step = 1
      }
    }
  }
</script>

<style lang="scss" scoped>
.logo {
  width: 85px;
  height: 85px;
}

.navigation__item {
  &:not(:last-child):not(:only-child) {
    margin-bottom: 15px !important;
  }
  .navigation__img {
    width: 30px;
    height: 30px;
  }
}
</style>
