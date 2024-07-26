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

  export type ValidationDetail = {
    name: string;
    valid: boolean;
    msg: string;
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
  let _fieldState: Record<string, string> = {};
  let _formItems: Record<string, HTMLElement> = {};
  let _formFields: Record<string, HTMLElement> = {};

  $: if (_active) {
    const url = new URL(location.href);
    url.searchParams.set("page", id);
    history.pushState({ page: id }, "", url);
  }

  onMount(() => {
    _detail = {
      id,
      heading,
      el: _rootEl,
    };

    dispatchBindMsg();
    addToggleActiveStateListener();
    addChildChangeListener();
    addChildMountedListeners();
    addValidationListener();
    addErrorListener();
    addResetErrorsListener();

    addSetListener();
  });

  function addSetListener() {
    _rootEl.addEventListener("set:fieldset", (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setTimeout(() => {
        for (const [_, values] of Object.entries(detail)) {
          for (const [propName, value] of Object.entries(values as Record<string, string>)) {
            if (Object.keys(_formFields).includes(propName)) {
              // set internal state
              _fieldState[propName] = value as string;
              // dispatch to form field component
              _formFields[propName].dispatchEvent(new CustomEvent("set:value", {
                composed: true,
                detail: {
                  name: propName,
                  value  
                }
              }));
            }
          }
        }
      }, 100)
    })
  }

  function addResetErrorsListener() {
    _rootEl.addEventListener("__resetErrors", () => {
      _errors = {};
    });
  }

  function addErrorListener() {
    _rootEl.addEventListener("error", (e: Event) => {
      const { name, msg } = (e as CustomEvent).detail;
      _errors[name] = msg;

      // dispatch error down to form items and fields
      _formItems[name].dispatchEvent(new CustomEvent("set:error", {
        composed: true,
        detail: {
          error: msg
        }
      }))
      _formFields[name].dispatchEvent(new CustomEvent("set:error", {
        composed: true
      }))
    });
  }

  function addValidationListener() {
    _rootEl.addEventListener("validate", (e: Event) => {
      const { name, valid, msg } = (e as CustomEvent<ValidationDetail>).detail;
      if (!valid) {
        _errors[name] = msg;
      }
    });
  }

  function addChildChangeListener() {
    _rootEl.addEventListener("_change", (e: Event) => {
      const { name, value } = (e as CustomEvent).detail;
      console.log("receiving change enve", name, value)
      _fieldState[name] = value;
    });
  }

  function addChildMountedListeners() {
    _rootEl.addEventListener("form-item:mounted", (e: Event) => {
      const { id, el } = (e as CustomEvent).detail;
      console.log("saving form item", id, el)
      _formItems[id] = el;
    });
    _rootEl.addEventListener("form-field:mounted", (e: Event) => {
      const { name, el } = (e as CustomEvent).detail;
      console.log("setting form fields", (e as CustomEvent).detail)
      _formFields[name] = el;
    });
  }

  function dispatchBindMsg() {
    setTimeout(() => {
      dispatch("fieldset:bind", _detail);
    }, 10);
  }

  function addToggleActiveStateListener() {
    _rootEl.addEventListener("fieldset:toggle-active", (e: Event) => {
      const { first, active } = (e as CustomEvent).detail;
      _firstElement = first;
      _active = active;
    });
  }

  // Handled the app's on:_continue handler
  function handleClick() {
    dispatch("_continue", {
      el: _rootEl,
      state: _fieldState,
    });
  }

  function handleSubmit() {
    dispatch("__submit", {});
  }

  function dispatch(eventName: string, detail: Record<string, unknown>) {
    _rootEl.dispatchEvent(
      new CustomEvent(eventName, {
        composed: true,
        bubbles: true,
        detail,
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
          <goa-link type="tertiary" leadingicon="chevron-back" mb="2xl">
            Back
          </goa-link>
        </button>
      {:else}
        <div style="visibility: hidden">&nbsp;</div>
        <goa-spacer vSpacing="2xl" />
      {/if}

      {#if Object.keys(_errors).length}
        <goa-callout
          type="emergency"
          heading="Please correct the following errors on this page:"
        >
          <ul>
            {#each Object.keys(_errors) as key}
              <li>{_errors[key]}</li>
            {/each}
          </ul>
        </goa-callout>
      {/if}

      <goa-text as="h2" size="heading-l">{heading}</goa-text>

      <slot />

      {#if last}
        <goa-block mt="xl">
          <goa-button on:_click={handleSubmit} type="primary">
            {buttonText || "Submit"}
          </goa-button>
        </goa-block>
      {:else}
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
