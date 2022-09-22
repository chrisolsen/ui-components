<script>
  import "../../src";
</script>

<svelte:head>
  <title>GoA Component Playground</title>
</svelte:head>

<h2>Playground</h2>

<form method="get" action="/">
  <goa-dropdown id="dropdown" value="green" width="400px" name="colors" >
    <goa-dropdown-item value="red" name="colors" label="Red" />
    <goa-dropdown-item value="green" name="colors" label="Green" />
    <goa-dropdown-item value="blue" name="colors" label="Blue" />
  </goa-dropdown>

  <script>
    // var dropdown = document.getElementById("dropdown");
    // dropdown.addEventListener("_change", e => {
    //   console.log("_change", e.detail);
    //   dropdown.setAttribute("value", e.detail.value);
    // });
  </script>

  <goa-input type="text" leadingicon="add" trailingicon="close" error name="foo" value="foo" />
  <script>
    var inputs = document.querySelectorAll("goa-input")
    for (const input of inputs) {
      input.addEventListener("_change", (e) => {
        const {name, value} = e.detail; 
      })
    }
  </script>

  <input name="native" value="native" />
  <button type="submit">Submit</button>
</form>
