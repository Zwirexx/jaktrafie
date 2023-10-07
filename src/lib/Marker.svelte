<script>
  import { onMount, getContext, onDestroy } from "svelte";
  import L from "leaflet";

  export let markerLatLng;

  // const markerIcon = L.divIcon({
  //   className: "bus-stop-icon",
  // });
  // export let number;
  export let stopType;
  let marker;

  const { getMap } = getContext("map");

  onMount(() => {
    const map = getMap(); // Pobierz mapę

    if (map) {
      marker = L.marker(markerLatLng, {
        icon: L.icon({
          iconUrl: "src/assets/stop-circle.svg",
          iconSize: [18, 18],
          // iconAnchor: [12, 24],
        }),
      }).addTo(map);

      // map.on("zoomend", () => {
      // }); zmiana wyglądu markerów przy innych levelach zoomu
    }
  });

  onDestroy(() => {
    marker?.remove();
    marker = undefined;
  });
</script>
