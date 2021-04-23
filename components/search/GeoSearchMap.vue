<template>
  <div v-if="state">
    <GMap
      ref="gMap"
      language="es"
      :zoom="6"
      @loaded="isLoaded = true"
    >
      <GMapMarker
        v-for="item of state.items"
        :key="item.objectID"
        :position="item._geoloc"
      >
        <GMapInfoWindow :options="{maxWidth: 200}">
          <code>
            {{ item.name }}
          </code>
        </GMapInfoWindow>
      </GMapMarker>
    </GMap>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { createWidgetMixin } from 'vue-instantsearch'
import { connectGeoSearch } from 'instantsearch.js/es/connectors'
 
  @Component({
    mixins: [createWidgetMixin({ connector: connectGeoSearch })]
  })
  export default class GeoSearchMap extends Vue {
    state!: any
    isLoaded: boolean = false

    @Watch('isLoaded')
    @Watch('state')
    handle() {
      if(this.isLoaded) {
        console.log(this.$refs.gMap)
        this.$nextTick(() => {
          (this.$refs.gMap as any).initChildren()
        })
      }
    }
  }
</script>