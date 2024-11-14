<svelte:options customElement="test-app-header-menu-wrapper" />

<script lang="ts">
  import { onMount } from "svelte";
  import type { GoAIconType } from "../icon/Icon.svelte";
  import GoAAppHeaderMenu from "./AppHeaderMenu.svelte";

  export let heading: string = "some label";
  export let leadingicon: GoAIconType;

  let _spanEl: HTMLElement;
  let link: HTMLLinkElement;

  onMount(() => {
    link.addEventListener("click", () => {
      console.log("the link has been clicked")
      _spanEl.innerHTML = "Test without loading";
    })
  })

  function selectWithoutLoading() {
    console.log("the link has been clicked")
    _spanEl.innerHTML = "Test without loading";
  }
</script>

<GoAAppHeaderMenu {heading} {leadingicon}>
  <a href="#seniors">Seniors</a>
  <a href="#family">Family</a>
  <a href="#children">Children</a>
  <a href="#special" bind:this={link}>Test</a>
</GoAAppHeaderMenu>
<span bind:this={_spanEl} data-testid="test-without-loading"></span>
<input data-testid="input" />
