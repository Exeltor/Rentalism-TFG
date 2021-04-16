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
              <v-text-field v-model="email" class="rounded align-self-stretch mb-6" filled rounded placeholder="E-mail" hide-details="auto" :error-messages="emailErrors" @input="$v.email.$touch()" @blur="$v.email.$touch()">
                <img slot="prepend-inner" src="@/assets/images/mail-icon.svg" alt="mail-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-text-field v-model="password" class="rounded align-self-stretch mb-2" filled rounded placeholder="Contraseña" hide-details="auto" type="password" :error-messages="passwordErrors" @input="$v.password.$touch()" @blur="$v.password.$touch()">
                <img slot="prepend-inner" src="@/assets/images/key-icon.svg" alt="key-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <p class="text-body-1 ma-0 align-self-start">¿Has olvidado tu contraseña? <span style="color: #77B6C0; cursor: pointer">Restaurar</span></p>
              <v-expand-transition>
                <v-alert v-if="showLoginError" text dense color="error">Usuario o contraseña incorrectos</v-alert>
              </v-expand-transition>
              <v-btn class="rounded font-weight-bold my-7" x-large elevation="0" color="primary" style="width: 50%" @click="login">
                Entrar
              </v-btn>
              <p class="text-body-1 ma-0">O en caso contrario, <span style="color: #77B6C0; cursor: pointer" @click.stop="step = 2">registrate</span></p>
            </div>
          </v-window-item>
          <v-window-item :value="2">
            <div class="d-flex flex-column align-center pa-10">
              <p class="text-h4 font-weight-bold mb-10">Registrate</p>
              <v-text-field v-model="registrationEmail" class="rounded align-self-stretch mb-2" filled rounded placeholder="E-mail" hide-details="auto" :error-messages="registrationEmailErrors" @input="$v.registrationEmail.$touch()" @blur="$v.registrationEmail.$touch()">
                <img slot="prepend-inner" src="@/assets/images/mail-icon.svg" alt="mail-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-text-field v-model="registrationName" class="rounded align-self-stretch mb-6" filled rounded placeholder="Nombre" hide-details="auto" :error-messages="registrationNameErrors" @input="$v.registrationName.$touch()" @blur="$v.registrationName.$touch()">
                <img slot="prepend-inner" src="@/assets/images/user-icon-grey.svg" alt="key-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-text-field v-model="registrationPassword" class="rounded align-self-stretch mb-2" filled rounded placeholder="Contraseña" type="password" hide-details="auto" :error-messages="registrationPasswordErrors" @input="$v.registrationPassword.$touch()" @blur="$v.registrationPassword.$touch()">
                <img slot="prepend-inner" src="@/assets/images/key-icon.svg" alt="mail-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-text-field v-model="repeatRegistrationPassword" class="rounded align-self-stretch mb-2" filled rounded placeholder="Repite Contraseña" type="password" hide-details="auto" :error-messages="registrationRepeatPasswordErrors" @input="$v.repeatRegistrationPassword.$touch()" @blur="$v.repeatRegistrationPassword.$touch()">
                <img slot="prepend-inner" src="@/assets/images/key-icon.svg" alt="key-icon" style="height: 25px; width: 25px">
              </v-text-field>
              <v-btn class="rounded font-weight-bold my-7" x-large elevation="0" :loading="registrationLoading" color="primary" style="width: 50%" @click="register">
                Registrarse
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
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
  @Component({
    validations: {
      email: { required, email },
      password: { required, minLength: minLength(6) },
      registrationEmail: { required, email },
      registrationName: { required },
      registrationPassword: { required, minLength: minLength(6) },
      repeatRegistrationPassword: { sameAsPassword: sameAs('registrationPassword') }
    },
    computed: {
      ...mapState({
        localUser: 'authUser'
      })
    }
  })
  export default class Layout extends Vue {
    localUser!: any
    showLoginModal = false
    step = 1
    
    //login variables
    email: string = ''
    password: string = ''
    showLoginError: boolean = false;

    //registration variables
    registrationEmail: string = ''
    registrationName: string = ''
    registrationPassword: string = ''
    repeatRegistrationPassword: string = ''
    registrationLoading: boolean = false

    directToLogin() {
      if(!this.$store.getters.isLoggedIn) {
        this.showLoginModal = true
      } else {
        this.$router.push(`/profile/${this.localUser.uid}`)
      }
    }

    get emailErrors() {
      const errors: string[] = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Formato invalido')
      !this.$v.email.required && errors.push('Este campo es obligatorio')
      return errors
    }

    get registrationEmailErrors() {
      const errors: string[] = []
      if (!this.$v.registrationEmail.$dirty) return errors
      !this.$v.registrationEmail.email && errors.push('Formato invalido')
      !this.$v.registrationEmail.required && errors.push('Este campo es obligatorio')
      return errors
    }

    get passwordErrors() {
      const errors: string[] = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.minLength && errors.push(`Minimo ${this.$v.password.$params.minLength.min} caracteres`)
      !this.$v.password.required && errors.push('Este campo es obligatorio')
      return errors
    }

    get registrationPasswordErrors() {
      const errors: string[] = []
      if (!this.$v.registrationPassword.$dirty) return errors
      !this.$v.registrationPassword.minLength && errors.push(`Minimo ${this.$v.password.$params.minLength.min} caracteres`)
      !this.$v.registrationPassword.required && errors.push('Este campo es obligatorio')
      return errors
    }

    get registrationRepeatPasswordErrors() {
      const errors: string[] = []
      if (!this.$v.repeatRegistrationPassword.$dirty) return errors
      !this.$v.repeatRegistrationPassword.sameAsPassword && errors.push('La contraseña debe coincidir')
      return errors
    }

    get registrationNameErrors() {
      const errors: string[] = []
      if(!this.$v.registrationName.$dirty) return errors
      !this.$v.registrationName.required && errors.push('Este campo es obligatorio')
      return errors
    }

    login() {
      this.$v.email.$touch()
      this.$v.password.$touch()
      if(!this.$v.email.$invalid && !this.$v.password.$invalid) {
        this.$fire.auth.signInWithEmailAndPassword(this.email, this.password).then(response => {
          
        }).catch(() => {
          this.showLoginError = true
          setTimeout(() => { this.showLoginError = false }, 3000)
        })
      }
    }

    register() {
      this.$v.registrationEmail.$touch()
      this.$v.registrationPassword.$touch()
      this.$v.repeatRegistrationPassword.$touch()
      this.$v.registrationName.$touch()

      if(!this.$v.registrationEmail.$invalid
        && !this.$v.registrationPassword.$invalid
        && !this.$v.repeatRegistrationPassword.$invalid
        && !this.$v.registrationName.$invalid
      ) {
        this.registrationLoading = true
        this.$fire.auth.createUserWithEmailAndPassword(this.registrationEmail, this.registrationPassword).then(response => {
          const userUid = response.user!.uid
          console.log(userUid)
          this.$fire.firestore.doc(`users/${userUid}`).set({
            name: this.registrationName
          }).then(() => {
            this.registrationLoading = false
            this.showLoginModal = false
          }).catch(error => {
            console.log(error)
            this.registrationLoading = false
          })
        }).catch(error => {
          console.log(error)
          this.registrationLoading = false
        })
      }
    }

    @Watch('showLoginModal')
    handleSwitch(value: any) {
      if (value === false) {
        this.step = 1
        this.registrationLoading = false
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
