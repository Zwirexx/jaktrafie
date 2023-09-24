<script>
  import {
    onMount,
    onDestroy,
    setContext,
    createEventDispatcher,
  } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { mapStore } from "../lib/store.js";

  export let initialView;
  export let zoomLevel;

  let map;
  setContext("map", {
    getMap: () => map,
  });

  mapStore.set(map);

  onMount(() => {
    map = L.map("map").setView(initialView, zoomLevel);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_no_buildings/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 17,
        minZoom: 10,
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a> | <a href="/dane">Źródło Danych</a>`,
      }
    ).addTo(map);
  });

  onDestroy(() => {
    map?.remove();
    map = undefined;
  });
</script>

<div class="justify-center flex">
  <slot name="search" />
</div>

<div id="map" class="relative">
  {#if map}
    <slot />
  {/if}
</div>

<style>
  #map {
    height: 100%;
    z-index: 0;
  }
</style>
