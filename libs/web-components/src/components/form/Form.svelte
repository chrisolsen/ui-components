<svelte:options customElement="goa-form" />

<script lang="ts">
  import { onMount } from "svelte";
  import { FieldsetDetail } from "./Fieldset.svelte";

  export let page: string;

  let _form: HTMLFormElement;
  let _fieldsets: Record<string, HTMLElement> = {};

  $: _fieldsets && sendToggleActiveStateMsg(page);

  onMount(() => {
    addBindListener();
    // listen to url changes or location back
    addWindowPopStateListener();
  });

  function addBindListener() {
    _form.addEventListener("bind", (e: Event) => {
      const detail = (e as CustomEvent<FieldsetDetail>).detail;
      _fieldsets[detail.id] = detail.el;
      e.stopPropagation();
    });
  }

  function addWindowPopStateListener() {
    window.addEventListener("popstate", (e: PopStateEvent) => {
      _form.dispatchEvent(new CustomEvent("formPopState", {
        composed: true,
        bubbles: true,
      }))
      e.stopPropagation();
    })
  }

  function sendToggleActiveStateMsg(page: string) {
    Object.keys(_fieldsets).map((key) => {
      _fieldsets[key].dispatchEvent(
        new CustomEvent("fieldset:toggle-active", {
          composed: true,
          detail: {
            active: key === page,
          },
        }),
      );
    });
  }

</script>

<form bind:this={_form}>
  <slot />
</form>
