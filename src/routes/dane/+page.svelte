<script>
  let today = new Date().toJSON().slice(0, 10);
</script>

<div class="mt-10 ml-10">
  <div>
    <div class="text-3xl font-bold">Dane</div>
    <div class="text-xl">
      Dane przystanków, tras oraz lokalizacji pojazdów <br />pochodzą od
      <a
        href="https://api.um.warszawa.pl/"
        class="hover:text-blue-400 underline"
        target="_blank">Miasto Stołeczne Warszawa</a
      >.
      <br />
      Dane pozyskano {today}
      <br />
      <a href="/" class="hover:text-blue-400 underline">Powrót</a>
    </div>
  </div>
</div>
