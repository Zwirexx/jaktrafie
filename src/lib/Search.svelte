<script>
  import { apiStopsStore } from "../lib/store.js";
  import { apiDictionaryStore } from "../lib/store.js";
  import { getContext } from "svelte";
  import { fly, slide } from "svelte/transition";
  import { expoInOut, quintOut } from "svelte/easing";

  const { getMap } = getContext("map");

  let searchText = "";
  let searchInitiated = false;
  let cachedBusStops = "";
  let dictionary = [];

  apiStopsStore.subscribe((value) => {
    cachedBusStops = value;
  });
  apiDictionaryStore.subscribe((value) => {
    dictionary = value.result;
  });

  // cachedBusStops.result.forEach((element) => {
  //   dataArray.push(`${element.values[2].value} ${element.values[1].value}`);
  //   // console.log(element.values);
  // });

  // document.querySelector("#searchInput").addEventListener("input", () =>{
  //   if(this.value.length > 0) {
  //     this.
  // })

  function checkDotInName(str) {
    const dotIndex = str.indexOf(".");
    if (
      dotIndex !== -1 &&
      dotIndex !== str.length - 1 &&
      str[dotIndex + 1] !== " "
    ) {
      const updatedStr =
        str.slice(0, dotIndex + 1) + " " + str.slice(dotIndex + 1);
      return updatedStr;
    }
    return str;
  }

  const przystanki = cachedBusStops.result.map((przystanek) => {
    const idUlicy = przystanek.values.find(
      (item) => item.key === "id_ulicy"
    ).value;
    let nazwaUlicy = dictionary.ulice[idUlicy] || "";

    let nazwaPrzystanku = przystanek.values.find(
      (item) => item.key === "nazwa_zespolu"
    ).value;
    const numerPrzystanku = przystanek.values.find(
      (item) => item.key === "slupek"
    ).value;
    const kierunek = przystanek.values.find(
      (item) => item.key === "kierunek"
    ).value;
    const szerokosc = przystanek.values.find(
      (item) => item.key === "szer_geo"
    ).value;
    const dlugosc = przystanek.values.find(
      (item) => item.key === "dlug_geo"
    ).value;
    nazwaPrzystanku = checkDotInName(nazwaPrzystanku);

    nazwaUlicy = checkDotInName(nazwaUlicy);
    return {
      nazwaPrzystanku,
      numerPrzystanku,
      nazwaUlicy,
      kierunek,
      szerokosc,
      dlugosc,
    };
  });
  function filterData(searchText) {
    return przystanki
      .filter((item) =>
        item.nazwaPrzystanku.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => a.nazwaPrzystanku.localeCompare(b.nazwaPrzystanku));
  }

  function isMetroStation(name) {
    const lowerCaseName = name.toLowerCase();

    return metroStations.some((station) => {
      return station.toLowerCase().includes(lowerCaseName);
    });
  }
  function addMarker(lat, lng) {
    const map = getMap();

    if (map) {
      L.marker([lat, lng]).addTo(map);

      map.setView([lat, lng], 17);
      searchText = "";
    }
  }
  function check() {
    if (searchText.length == 0) {
      searchInitiated = false;
      console.log("dupa");
    } else {
      searchInitiated = true;
      console.log("dupa");
    }
  }
</script>

<div class="absolute z-10 flex justify-center">
  <form class="drop-shadow-lg">
    <div class="flex drop-shadow">
      <input
        bind:value={searchText}
        on:input={check}
        type="text"
        id="searchInput"
        class="mt-10 rounded-tl-lg"
        class:rounded-bl-lg={!searchInitiated}
        class:typing={searchInitiated}
        placeholder="Wyszukaj przystanek lub adres"
      />
      <button
        class="search-btn mt-10 rounded-tr-lg"
        class:rounded-br-lg={!searchInitiated}
        ><svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <rect width="26" height="26" fill="url(#pattern0)" />
          <defs>
            <pattern
              id="pattern0"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlink:href="#image0_5_325" transform="scale(0.0104167)" />
            </pattern>
            <image
              id="image0_5_325"
              width="96"
              height="96"
              xlink:href="data:image/png;base64,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"
            />
          </defs>
        </svg>
      </button>
    </div>
    <div class="search-response-box flex flex-col">
      {#if searchText.length > 2}
        {#each filterData(searchText) as item}
          {#if item.nazwaUlicy != "" && item.kierunek.includes("_") != true && item.numerPrzystanku.startsWith("7") != true}
            <button
              class="search-response text-left"
              on:click={addMarker(item.szerokosc, item.dlugosc)}
              ><div>
                <span class="font-medium"
                  >{item.nazwaPrzystanku}
                  {item.numerPrzystanku}</span
                >

                <span class="text-xs">
                  <!-- {#if item.nazwaUlicy.startsWith("al.") || item.nazwaUlicy.startsWith("pl.")}<div
                    />{:else}
                    ul.
                  {/if} -->
                  <!-- {item.nazwaUlicy.replace(/-{4,50}/g, "")} -->
                  {#if item.kierunek != "null" && item.kierunek != ""}
                    →
                    {checkDotInName(
                      item.kierunek.toUpperCase().replace(/-{4,50}/g, "")
                    )}
                  {/if}
                </span>
              </div>
              <!-- <span class="italic text-sm">
                210, 184, 511, 114, 750, 850, 800, 150
              </span> -->
            </button>
          {/if}
        {/each}
        {#if filterData(searchText).length == 0}
          <button class="search-response text-left" disabled
            >Nic nie znaleziono xd</button
          >
        {/if}
      {:else if searchText.length > 0 && searchText.length <= 2}
        <button class="search-response text-left" disabled>Pisz dalej</button>
      {:else}{/if}
    </div>
  </form>
</div>

<style>
  .line-no {
    background: rgb(70, 66, 255);
    background: linear-gradient(
      145deg,
      rgba(70, 66, 255, 1) 0%,
      rgba(106, 55, 255, 1) 100%
    );
  }
  .search-response-box {
    max-height: 20rem;
    overflow-y: auto;
  }
  .search-response {
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
    padding-left: 1.2rem;
    padding-right: 1.2rem;
    font-size: 0.95rem;
  }
  input {
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;
    padding-left: 1.2rem;
    padding-right: 1.2rem;
    font-size: 1rem;
    box-sizing: border-box;
    outline: none;
    width: 20rem;
    transition: all 0.2s ease-in-out;
  }
  input.typing {
    width: 30rem;
  }
  input::placeholder {
    color: #888eb4;
  }
  button {
    background-color: white;
    box-sizing: border-box;
    outline: none;
  }
  button.search-btn {
    height: 3rem;
    width: 2.5rem;
  }
</style>
