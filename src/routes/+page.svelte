<script>
  import Leaflet from "$lib/Leaflet.svelte";
  import Marker from "$lib/Marker.svelte";
  import { apiStopsStore } from "../lib/store.js";
  import { scale } from "svelte/transition";
  import { fade } from "svelte/transition";
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
  const apiStops = "http://localhost:3000/api/stops";

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
  let direction = "TX-MML03";

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
      console.error("fetchAllBusStopsData(): ", error);
    }
  }
  const stopObjectsPromise = fetchAllBusStopsData();
</script>

<main>
  {#await stopObjectsPromise}
    <section class="h-screen w-full flex justify-center items-center flex-col">
      <div class="w-1/3">
        <!-- <div class="text-xl mb-3 font-medium">{loadingMessage}</div>
        <ChunkSpinner /> -->
        <img
          src="src/assets/jaktrafiebanner.png"
          id="loading-img"
          alt="Ładowanie"
          out:scale={{
            duration: 200,
            opacity: 0.1,
            start: 0.5,
            easing: quintOut,
          }}
        />
      </div>
    </section>
  {:then stopObjects}
    <section in:fade={{ duration: 200 }}>
      <RoutePane {line} {stopObjects} />
    </section>

    <section
      class="map h-screen w-screen absolute inset-y-0 right-0"
      in:fade={{ duration: 200 }}
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
</main>

<style lang="postcss">
  section.map {
    width: 73%;
  }
  main {
    background-color: #1b0029;
  }
  #loading-img {
    animation: pulse 1.5s linear infinite;
  }
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
</style>
