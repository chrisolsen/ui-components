<svelte:options customElement="goa-form" />

<script lang="ts">
  import { onMount } from "svelte";
  import { FieldsetDetail } from "./Fieldset.svelte";
  import { calculateMargin, Spacing } from "../../common/styling";

  export let page: string;
  export let mt: Spacing = null;
  export let mr: Spacing = null;
  export let mb: Spacing = null;
  export let ml: Spacing = null;

  let _form: HTMLFormElement;
  let _fieldsets: Record<string, HTMLElement> = {};
  let _firstElement: string;

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
      if (!_firstElement) {
        _firstElement = detail.id;
      }
      e.stopPropagation();
    });
  }

  function addWindowPopStateListener() {
    window.addEventListener("popstate", (e: PopStateEvent) => {
      _form.dispatchEvent(new CustomEvent("_formPopState", {
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
            first: key === _firstElement,
            active: key === page,
          },
        }),
      );
    });
  }

</script>

<form 
  bind:this={_form}
  style={calculateMargin(mt, mr, mb, ml)}
>
  <slot />
</form>
