<template>
  <div v-if="state">
    <GmapMap
      ref="gMap"
      language="es"
      :zoom="6"
      :center="{lat: 40.416729, lng: -3.703339}"
      @loaded="isLoaded = true"
      style="height: 100%"
    >
      <GmapMarker
        v-for="item of state.items"
        :key="item.objectID"
        :position="item._geoloc"
        :clickable="true" 
        @click="toggleInfoWindow(item._geoloc, item.name, item.objectID)"
      />
      <gmap-info-window :options="infoOptions" :position="infoWindowPosition" :opened="infoWindowOpen" @closeclick="infoWindowOpen=false" @click.capture="stuff(item.objectID)" />
    </GmapMap>
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

    infoWindowPosition: null | Object = null
    infoWindowOpen = false
    currentMidx = null
    infoOptions = {
      content: '',
      //optional: offset infowindow so it visually sits nicely on top of our marker
      pixelOffset: {
        width: 0,
        height: -35
      }
    }

    stuff(objectID: string) {
      console.log(objectID)
    }
    
    toggleInfoWindow(latLng: Object, itemName: string, idx: any) {
      this.infoWindowPosition = latLng;
      this.infoOptions.content = itemName;
      if (this.currentMidx == idx) {
        this.infoWindowOpen = !this.infoWindowOpen;
      }
      else {
        this.infoWindowOpen = true;
        this.currentMidx = idx;
      }
    }

    // @Watch('isLoaded')
    // @Watch('state')
    // handle() {
    //   if(this.isLoaded) {
    //     console.log(this.$refs.gMap);
    //     (this.$refs.gMap as any).$markers = []
    //     this.$nextTick(() => {
    //       (this.$refs.gMap as any).initChildren()
    //     })
    //   }
    // }
  }
</script>