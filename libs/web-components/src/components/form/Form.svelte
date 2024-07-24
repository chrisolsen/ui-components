<svelte:options customElement="goa-form" />

<script lang="ts" context="module">
  export type FormState = {
    form: Record<string, string>;
    history: string[];
    lastModified?: Date;
  };

  type ChangeEvent = {
    name: string;
    value: string;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { FieldsetDetail } from "./Fieldset.svelte";
  import { calculateMargin, Spacing } from "../../common/styling";

  export let page: string;
  export let mt: Spacing = null;
  export let mr: Spacing = null;
  export let mb: Spacing = null;
  export let ml: Spacing = null;

  let _formEl: HTMLFormElement;
  let _fieldsets: Record<string, FieldsetDetail> = {};
  let _firstElement: string;

  let state: FormState = {
    form: {},
    history: [],
    lastModified: undefined,
  };

  $: _fieldsets && sendToggleActiveStateMsg(page);

  onMount(() => {
    addBindListener();
    addWindowPopStateListener();
    addChildChangeListener();
  });

  // listen to `_change` events by input elemented nested within fieldsets
  // and update the state
  function addChildChangeListener() {
    _formEl.addEventListener("_change", (e: Event) => {
      const { name, value } = (e as CustomEvent<ChangeEvent>).detail;
      state.form[name] = value;
      state.lastModified = new Date()
      e.stopPropagation();
    });
  }

  // listen for child fieldsets
  function addBindListener() {
    _formEl.addEventListener("fieldset:bind", (e: Event) => {
      const detail = (e as CustomEvent<FieldsetDetail>).detail;
      _fieldsets[detail.id] = detail;
      if (!_firstElement) {
        _firstElement = detail.id;
      }

      e.stopPropagation();
    });
  }

  // listen to url changes or location back
  function addWindowPopStateListener() {
    window.addEventListener("popstate", (e: PopStateEvent) => {

      const history = [...state.history];
      history.pop();
      state.history = history;
    
      e.stopPropagation();
    });
  }

  function sendToggleActiveStateMsg(page: string) {
    Object.keys(_fieldsets).map((key) => {
      _fieldsets[key].el.dispatchEvent(
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

<form bind:this={_formEl} style={calculateMargin(mt, mr, mb, ml)}>
  <slot />
</form>
