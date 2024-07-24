<svelte:options customElement="goa-fieldset" />

<script lang="ts" context="module">
  export type FieldsetDetail = {
    id: string;
    heading: string;
    el: HTMLElement;
  };

  export type BindingType = {
    el: HTMLElement;
    type: "form-item" | "form-field";
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { calculateMargin, Spacing } from "../../common/styling";

  export let id: string = "";
  export let heading: string = "";
  export let buttonText: string = "";
  export let mt: Spacing = null;
  export let mr: Spacing = null;
  export let mb: Spacing = null;
  export let ml: Spacing = null;
  export let last: boolean = false;

  let _rootEl: HTMLElement;
  let _firstElement: boolean;
  let _active: boolean = false;
  let _detail: FieldsetDetail;

  let _errors: Record<string, string> = {};

  $: if (_active) {
    const url = new URL(location.href);
    url.searchParams.set("page", id);
    history.pushState({page: id}, "", url)
  }

  onMount(() => {
    _detail = {
      id,
      heading,
      el: _rootEl,
    };
  
    dispatchBindMsg();
    addToggleActiveStateListener();
  });
  
  function dispatchBindMsg() {
    setTimeout(() => {
      _rootEl.dispatchEvent(
        new CustomEvent("fieldset:bind", {
          composed: true,
          bubbles: true,
          detail: _detail,
        }),
      );
    }, 10);
  }

  function addToggleActiveStateListener() {
    _rootEl.addEventListener("fieldset:toggle-active", (e: Event) => {
      const {first, active} = (e as CustomEvent).detail;
      _firstElement = first;
      _active = active;
    });
  }

  function handleClick() {
    _rootEl.dispatchEvent(
      new CustomEvent("_continue", {
        composed: true,
        bubbles: true,
        detail: _detail,
      }),
    );
  }

  function back(e: Event) {
    history.back();
    e.stopPropagation();
  }

</script>

<section bind:this={_rootEl}>
  {#if _active}
    <fieldset style={calculateMargin(mt, mr, mb, ml)}>
        {#if !_firstElement}
          <button on:click={back}>
            <goa-link
              type="tertiary" 
              leadingicon="chevron-back" 
              mb="2xl"
            >
              Back
            </goa-link>
          </button>
        {:else}
          <div style="visibility: hidden">&nbsp;</div>
          <goa-spacer vSpacing="2xl" />
        {/if}

        {#if Object.keys(_errors).length}
          <goa-callout type="emergency" heading="Please correct the following errors on this page:">
            <ul>
            {#each Object.keys(_errors) as key}
              <li>{_errors[key]}</li>
            {/each}
            </ul>
          </goa-callout>
        {/if}
    
        <goa-text as="h2" size="heading-l">{heading}</goa-text>

        <slot />

        {#if !last}
          <goa-block mt="xl">
            <goa-button on:_click={handleClick} type="primary">
              {buttonText || "Save and continue"}
            </goa-button>
          </goa-block>
        {/if}
    </fieldset>
  {/if}
</section>

<style>
  fieldset {
    border: none;
    padding: 0;
  }

  button {
    background: transparent;
    padding: 0;
    border: none;
  }
</style>
