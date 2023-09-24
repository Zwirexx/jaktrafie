<script>
  export let line;
  export let stopObjects;

  /**
   * Funkcja dodaje spację po kropce w nazwie przystanku.
   *
   * @param {string} str - Tekst do sprawdzenia.
   * @returns {string} Nowa bądź niezimeniona nazwa przystanku.
   */
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
</script>

<section
  class="max-h-screen h-screen absolute inset-y-0 left-0 bg-indigo-950 overflow-hidden"
>
  <div class="h-screen ml-14 w-full flex flex-col mt-24 mb-24">
    <div class="flex mb-8">
      <div class="text-white font-bold text-6xl">{line}</div>
      <div class="ml-5">
        <div class="text-slate-400 font-medium text-lg">Kierunek</div>
        <div class="overflow-hidden w-44 whitespace-nowrap">
          <div
            class=" text-white font-medium text-xl"
            class:scrolling-text={stopObjects[stopObjects.length - 1].nazwa
              .length > 15}
          >
            {checkDotInName(stopObjects[stopObjects.length - 1].nazwa)}
          </div>
        </div>
      </div>
    </div>
    <div class="stops-list text-white overflow-y-scroll">
      {#each stopObjects as stop}
        <div class="flex items-center overflow-hidden">
          {#if stop.typ != "2"}
            <svg
              id="eIakqWN79Ds1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              height="18"
              width="18"
              viewBox="0 0 100 100"
              shape-rendering="geometricPrecision"
              text-rendering="geometricPrecision"
              ><ellipse
                rx="9.446036"
                ry="9.446036"
                transform="matrix(4.763903 0 0 4.763903 50 50)"
                fill="rgba(170,182,207,0)"
                stroke="#888eb4"
                stroke-width="2"
                stroke-miterlimit="1"
              /><ellipse
                rx="30"
                ry="30"
                transform="translate(50 50)"
                fill="#888eb4"
                stroke-width="0"
              /></svg
            >
          {:else}
            <svg
              id="eB6MVYkZzyd1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 100 100"
              height="18"
              width="18"
              shape-rendering="geometricPrecision"
              text-rendering="geometricPrecision"
              ><ellipse
                rx="9.446036"
                ry="9.446036"
                transform="matrix(4.763903 0 0 4.763903 50 50)"
                fill="rgba(170,182,207,0)"
                stroke="#888eb4"
                stroke-width="2"
                stroke-miterlimit="1"
              /></svg
            >
          {/if}

          <span class="ml-5 text-base"
            >{checkDotInName(stop.nazwa)} {stop.nr_zespolu}</span
          >
        </div>
        {#if stopObjects.indexOf(stop) != stopObjects.length - 1}
          <div class="line" />
        {/if}
      {/each}
    </div>
  </div>
</section>

<style>
  section {
    width: 27%;
  }
  .stops-list {
    max-height: 70%;
  }
  .line {
    margin-left: 8px;
    border-left: 3px solid #888eb4;
    height: 32px;
  }
  .scrolling-text {
    /* transform: translateX(0%); */

    animation: scrollText 10s linear infinite;
  }
  @keyframes scrollText {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-200%);
    }
  }
  @keyframes magic-flow {
    from {
      background-position: 0% center;
    }
    to {
      background-position: -200% center;
    }
  }
  .glowing-text {
    animation: magic-flow 4s linear infinite;
    background: linear-gradient(60deg, #fde5b9, #bcd1db, #fde5b9);
    background-size: 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
