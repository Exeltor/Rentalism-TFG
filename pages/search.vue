<template>
  <client-only>
    <ais-instant-search :search-client="searchClient" index-name="listings">
      <v-row no-gutters class="full-height">
        <v-col>
          
        </v-col>
        <v-col>
          <geo-search-map />
        </v-col>
      </v-row>
    </ais-instant-search>
  </client-only>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import algoliasearch from 'algoliasearch/lite'
import GeoSearchMap from '@/components/search/GeoSearchMap.vue'

  @Component({
    components: {
      GeoSearchMap
    }
  })
  export default class SearchPage extends Vue {
    searchClient = algoliasearch(
      'A9OBHA2F69',
      '0bcdcc6dbed35d8bf93b79bfd30b2eb3'
    )
  }
</script>

<style lang="scss" scoped>
.full-height {
  height: 100vh;
}
</style>