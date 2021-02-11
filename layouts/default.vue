<template>
  <v-app light>
    <v-navigation-drawer class="default__navigation" permanent mini-variant mini-variant-width="120px" app>
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
          <v-list-item class="navigation__item" tag="nuxt-link" nuxt to="/profile" exact exact-active-class="v-item--active">
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
    </v-navigation-drawer>
    <v-main>
      <v-container fluid style="max-width:1264px">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
  @Component
  export default class Layout extends Vue {
    selectedItem = 0
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
