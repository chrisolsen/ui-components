<svelte:options customElement="goa-fieldset" />

<script lang="ts" context="module">
  export type FieldsetDetail = {
    id: string;
    el: HTMLFieldSetElement;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";

  export let id: string = "";
  export let heading: string = "";
  export let buttonText: string = "";

  let _fieldsetEl: HTMLFieldSetElement;
  let _active: boolean = false;
  let _detail: FieldsetDetail;

  $: {
    if (_active) {
      const url = new URL(location.href);
      url.searchParams.set("page", id);
      history.pushState({page: id}, "", url)
    }
  }

  onMount(() => {
    dispatchBindMsg();
    addToggleActiveStateListener();

    _detail = {
      id,
      el: _fieldsetEl,
    };
  });
  
  function dispatchBindMsg() {
    setTimeout(() => {
      _fieldsetEl.dispatchEvent(
        new CustomEvent("bind", {
          composed: true,
          bubbles: true,
          detail: _detail,
        }),
      );
    }, 10);
  }

  function addToggleActiveStateListener() {
    _fieldsetEl.addEventListener("fieldset:toggle-active", (e: Event) => {
      _active = (e as CustomEvent).detail.active;
    });
  }

  function handleClick() {
    _fieldsetEl.dispatchEvent(
      new CustomEvent("continue", {
        composed: true,
        bubbles: true,
        detail: _detail,
      }),
    );
  }

  function back() {
    history.back();
  }
</script>

<fieldset bind:this={_fieldsetEl}>
  {#if _active}
    <h3>{heading}</h3>

    <slot />

    <goa-button type="tertiary" on:_click={back}>Back</goa-button>
    <goa-button on:_click={handleClick} type="primary">
      {buttonText || "Save and continue"}
    </goa-button>
  {/if}
</fieldset>

<style>
  fieldset {
    border: none;
  }
</style>
