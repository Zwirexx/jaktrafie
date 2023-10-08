<script>
  import "../app.css";
  import { onMount } from "svelte";
  import { apiStopsStore } from "../lib/store.js";
  import { apiDictionaryStore } from "../lib/store.js";
  import { apiStopLinesStore } from "../lib/store.js";
  const apiStopsUrl = "http://localhost:3000/api/stops";
  const apiDictionaryUrl = "http://localhost:3000/api/dictionary";
  async function getStops() {
    const response = await fetch(apiStopsUrl);
    const data = await response.json();
    apiStopsStore.set(data);
  }
  async function getDictionary() {
    const response = await fetch(apiDictionaryUrl);
    const data = await response.json();
    apiDictionaryStore.set(data);
  }
  onMount(async () => {
    getStops();
    getDictionary();
  });
</script>

<main>
  <div class="absolute z-10 right-10 top-10 opacity-50 font-bold">
    JAKTRAFIE DEV
  </div>
  <slot />
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
  * {
    font-family: "Poppins", sans-serif;
  }
</style>
