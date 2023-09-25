<script>
  import Leaflet from "$lib/Leaflet.svelte";
  import Marker from "$lib/Marker.svelte";
  import { apiStopsStore } from "../lib/store.js";
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import ChunkSpinner from "../lib/ChunkSpinner.svelte";
  import RoutePane from "../lib/RoutePane.svelte";
  import Search from "../lib/Search.svelte";

  const initialView = [52.2297, 21.0122];
  let loadingMessage = "Ładowanie aplikacji...";

  let randomLoadingMessages = [
    "Ładowanie przystanków...",
    "Tankowanie autobusów...",
    "Jesteś 2147483648 w kolejce...",
  ];
  let loadingMessageIndex = 0;
  const apiStops =
    "https://api.um.warszawa.pl/api/action/dbstore_get/?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&apikey=558910cd-f086-4a9f-a7d0-d7b4048a9e83";

  function displayNextMessage() {
    setTimeout(() => {
      loadingMessage = randomLoadingMessages[loadingMessageIndex];
      loadingMessageIndex < randomLoadingMessages.length - 1
        ? loadingMessageIndex++
        : false;
      displayNextMessage();
    }, 8000);
  }
  displayNextMessage();

  const apiRoutes = "http://localhost:3000/api/data";
  async function fetchDataFromAPI(api) {
    try {
      const response = await fetch(api);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Błąd podczas pobierania danych z API:", error);
      return [];
    }
  }

  let cachedBusStops = "";
  apiStopsStore.subscribe((value) => {
    cachedBusStops = value;
  });
  let cachedRoutes = null;
  let line = "210";
  let direction = "TP-TRUH";

  async function getCachedOrFetchData(api, cachedData) {
    if (!cachedData) {
      cachedData = await fetchDataFromAPI(api);
    }
    return cachedData;
  }

  async function findBusStopInData(data, numerZespolu, nrSlupka, typ) {
    const przystanek = data.find((entry) => {
      const zespol = entry.values.find((item) => item.key === "zespol");
      const slupek = entry.values.find((item) => item.key === "slupek");
      return (
        zespol &&
        zespol.value === numerZespolu &&
        slupek &&
        slupek.value === nrSlupka
      );
    });

    if (przystanek) {
      const nazwaPrzystanku = przystanek.values.find(
        (item) => item.key === "nazwa_zespolu"
      ).value;
      const szerokoscGeograficzna = parseFloat(
        przystanek.values.find((item) => item.key === "szer_geo").value
      );
      const dlugoscGeograficzna = parseFloat(
        przystanek.values.find((item) => item.key === "dlug_geo").value
      );
      return {
        nazwa: nazwaPrzystanku,
        szerokosc: szerokoscGeograficzna,
        dlugosc: dlugoscGeograficzna,
        nr_zespolu: nrSlupka,
        typ: typ,
      };
    } else {
      return null;
    }
  }
  async function dupa() {
    let przystanki = await getCachedOrFetchData(apiRoutes, cachedRoutes);

    przystanki = przystanki.result[line][direction];
    if (przystanki == undefined) {
      console.error(
        `%c Błąd w trasie. ${line} ${direction} `,
        "color: red; font-weight: bold; font-size: 16px"
      );
    }
    const posortowanePrzystanki = Object.values(przystanki).sort(
      (a, b) => parseInt(a[0]) - parseInt(b[0])
    );
    return posortowanePrzystanki;
  }

  async function fetchAllBusStopsData() {
    try {
      const data = await getCachedOrFetchData(apiStops, cachedBusStops);
      const posortowanePrzystanki = await dupa();
      const stopObjects = await Promise.all(
        posortowanePrzystanki.map(async (przystanek) => {
          const busStopData = await findBusStopInData(
            data.result,
            przystanek.nr_zespolu,
            przystanek.nr_przystanku,
            przystanek.typ
          );
          return busStopData;
        })
      );

      return stopObjects.filter((item) => item !== null);
    } catch (error) {
      console.log("fetchAllBusStopsData(): ", error);
    }
  }
  const stopObjectsPromise = fetchAllBusStopsData();
</script>

{#await stopObjectsPromise}
  <section class="h-screen w-full flex justify-center items-center flex-col">
    <div>
      <div class="text-xl mb-3 font-medium">{loadingMessage}</div>
      <ChunkSpinner />
    </div>
  </section>
{:then stopObjects}
  <section>
    <RoutePane {line} {stopObjects} />
  </section>

  <section
    transition:scale={{
      duration: 500,
      opacity: 0.2,
      start: 0.5,
      easing: quintOut,
    }}
    class="map h-screen w-screen absolute inset-y-0 right-0"
  >
    <Leaflet {initialView} zoomLevel={12}>
      {#each stopObjects as stop}
        <Marker
          markerLatLng={[stop.szerokosc, stop.dlugosc]}
          number={stopObjects.indexOf(stop) + 1}
          stopType={stop.typ}
        />
      {/each}
      <Search slot="search" />
    </Leaflet>
  </section>
{:catch error}
  <div class="h-screen w-full flex justify-center items-center">
    <div>{error}</div>
  </div>
{/await}

<style lang="postcss">
  section.map {
    width: 73%;
  }
</style>
