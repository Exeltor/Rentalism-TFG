<template>
  <client-only>
    <vueSignature ref="signature" :w="'800px'" :h="'400px'" />
  </client-only>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import vueSignature from 'vue-signature';

  @Component({
    layout: 'empty',
    components: {
      vueSignature
    }
  })
  export default class SignaturePad extends Vue {
    
  }
</script>

<style lang="scss" scoped>

</style>
