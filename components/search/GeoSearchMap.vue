<template>
  <GMap
    ref="gMap"
    language="es"
    :zoom="6"
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { createWidgetMixin } from 'vue-instantsearch'
import { connectGeoSearch } from 'instantsearch.js/es/connectors'

  @Component({
    mixins: [createWidgetMixin({ connector: connectGeoSearch })]
  })
  export default class GeoSearchMap extends Vue {
    
  }
</script>