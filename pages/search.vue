<template>
  <client-only>
    <ais-instant-search :search-client="searchClient" index-name="listings">
      <v-row no-gutters class="full-height">
        <v-col>
          <ais-state-results>
            <template slot-scope="{ results: { hits } }">
              <ais-hits v-if="hits.length > 0" :class-names="{ 'ais-Hits-list': null, 'ais-Hits-item': null }">
                <div slot="item" slot-scope="{ item }">
                  <listing-card :item="item" />
                </div>
              </ais-hits>
              <div v-else class="content">
                <h3>No results found!</h3>
              </div>
            </template>
          </ais-state-results>
        </v-col>
        <v-col>
          <geo-search-map style="height: 100%" />
        </v-col>
      </v-row>
    </ais-instant-search>
  </client-only>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import algoliasearch from 'algoliasearch/lite'
import GeoSearchMap from '@/components/search/GeoSearchMap.vue'
import ListingCard from '@/components/search/ListingCard.vue'


  @Component({
    components: {
      GeoSearchMap,
      ListingCard
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