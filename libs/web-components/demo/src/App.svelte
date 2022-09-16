<script>
  import "../../src";

  let _showModal = false;
  let _showModal2 = false;
  let modal;
  let modal2;

  $: {
    modal?.addEventListener("_close", () => _showModal = false)
    modal2?.addEventListener("_close", () => _showModal2 = false)
  }

  function showModal() {
    _showModal = true;  
  }

  function showModal2() {
    _showModal2 = true;  
  }

</script>

<svelte:head>
  <title>GoA Component Playground</title>
</svelte:head>

<h2>Playground</h2>

<form method="get" action="/">
  <goa-input type="text" name="foo" value="foo" />

  <script>
    var inputs = document.querySelectorAll("goa-input")
    for (const input of inputs) {
      input.addEventListener("_change", (e) => {
        const {name, value} = e.detail; 
        console.log(name, value)
      })
    }
  </script>

  <input name="native" value="native" />
  <button type="submit">Submit</button>
</form>
