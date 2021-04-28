<template>
  <div style="overflow: hidden">
    <client-only>
      <ais-instant-search :search-client="searchClient" index-name="listings">
        <v-row no-gutters class="full-height">
          <v-col class="pa-2" style="overflow-y: scroll; overflow-x: hidden; max-height: 100%">
            <p class="text-h4 font-weight-bold">Tu busqueda</p>
            <v-row>
              <v-col>
                <ais-menu-select attribute="type">
                  <v-select
                    class="rounded"
                    slot-scope="{ items, canRefine, refine }"
                    :disabled="!canRefine"
                    @change="refine(selectedType)"
                    item-text="label"
                    v-model="selectedType"
                    :items="items"
                    filled
                    rounded
                    placeholder="Tipo"
                  >
                    <img slot="prepend-inner" src="@/assets/images/chevron-down.svg" alt="chevron-down" style="height: 25px; width: 25px">
                    <div slot="append-icon" />
                  </v-select>
                </ais-menu-select>
              </v-col>
              <v-col>
                <ais-menu-select attribute="subtype">
                  <v-select
                    class="rounded"
                    slot-scope="{ items, canRefine, refine }"
                    :disabled="!canRefine"
                    @change="refine(selectedSubtype)"
                    item-text="label"
                    v-model="selectedSubtype"
                    :items="items"
                    filled
                    rounded
                    placeholder="Subtipo"
                  >
                    <img slot="prepend-inner" src="@/assets/images/chevron-down.svg" alt="chevron-down" style="height: 25px; width: 25px">
                    <div slot="append-icon" />
                  </v-select>
                </ais-menu-select>
              </v-col>
              <v-col>
                <ais-search-box>
                  <div slot-scope="{ currentRefinement, isSearchStalled, refine }">
                    <v-text-field class="rounded" filled rounded placeholder="Ciudad" :value="currentRefinement" @input="refine">
                      <img slot="prepend-inner" src="@/assets/images/search-icon.svg" alt="search-icon" style="height: 25px; width: 25px">
                    </v-text-field>
                    <span :hidden="!isSearchStalled">Loading...</span>
                  </div>
                </ais-search-box>
              </v-col>
            </v-row>
            <ais-state-results>
              <template slot-scope="{ results: { hits } }">
                <ais-hits v-if="hits.length > 0" :class-names="{ 'ais-Hits-list': 'results-list', 'ais-Hits-item': 'listing-card-search' }">
                  <div slot="item" slot-scope="{ item }">
                    <nuxt-link :to="`/search/${item.objectID}`">
                      <listing-card :item="item" />
                    </nuxt-link>
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
  </div>
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
    selectedType: any = null
    selectedSubtype: any = null

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