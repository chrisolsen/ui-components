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

  export type FieldsetPayloadTypes =
    | "set:fieldset"
    | "__resetErrors"
    | "error"
    | "_validate"
    | "form-item:mounted"
    | "fieldset:mounted"
    | "fieldset:toggle-active";

  export type FieldsetPayload = {
    action: FieldsetPayloadTypes;
    data: unknown;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { calculateMargin, Spacing } from "../../common/styling";
  import { dispatch } from "../../common/utils";

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
    addChildChangeListener();
    bindChannel();
  });

  function bindChannel() {
    _rootEl.addEventListener("msg", (e: Event) => {
      const payload = (e as CustomEvent<FieldsetPayload>).detail;
      console.log("fieldset incoming message:", payload);
      switch (payload.action) {
        case "set:fieldset":
          onData(payload.data);
          break;
        case "__resetErrors":
          onErrorReset();
          break;
        case "_validate":
          onValidate(payload.data);
          break;
        case "error":
          onError(payload.data);
          break;
        case "form-item:mounted":
          onFormItemMount(payload.data);
          break;
        case "fieldset:mounted":
          onFieldsetMount(payload.data);
          break;
        case "fieldset:toggle-active":
          onToggleActiveState(payload.data);
          break;
      }
    });
  }

  // Dispatch handlers

  function onToggleActiveState(detail: unknown) {
    const { first, active } = detail as { first: boolean; active: boolean };
    _firstElement = first;
    _active = active;
  }

  function onFormItemMount(detail: unknown) {
    const { id, el } = detail as { id: string; el: HTMLElement };
    _formItems[id] = el;
  }

  function onFieldsetMount(detail: unknown) {
    const { name, el } = detail as { name: string; el: HTMLElement };
    console.log("setting form fields", name, el);
    _formFields[name] = el;
  }

  type ErrorMsg = {
    error: string;
  };
  function onError(detail: unknown) {
    console.log('onError', detail)
    const { name, msg } = detail as {name: string, msg: string};
    _errors[name] = msg;

    // dispatch error down to form items and fields
    dispatch<ErrorMsg>(
      _formFields[name],
      "set:error",
      {
        error: msg,
      },
      { bubbles: true },
    );
  }

  function onErrorReset() {
    _errors = {};
  }

  function onValidate(detail: unknown) {
    const { name, valid, msg } = detail as Record<string, string>;
    if (!valid) {
      _errors[name] = msg;
    }
  }

  // Set the child form elements values
  function onData(detail: unknown) {
    const data = detail as Record<string, Record<string, string>>;
    setTimeout(() => {
      for (const [_, values] of Object.entries(data)) {
        for (const [propName, value] of Object.entries(values)) {
          if (Object.keys(_formFields).includes(propName)) {
            // set internal state
            _fieldState[propName] = value as string;
            // dispatch to form field component
            _formFields[propName].dispatchEvent(
              new CustomEvent("set:value", {
                composed: true,
                detail: {
                  name: propName,
                  value,
                },
              }),
            );
          }
        }
      }
    }, 100);
  }

  // Functions

  function addChildChangeListener() {
    _rootEl.addEventListener("_change", (e: Event) => {
      const { name, value } = (e as CustomEvent).detail;
      console.log("receiving change enve", name, value);
      _fieldState[name] = value;
    });
  }

  function dispatchBindMsg() {
    setTimeout(() => {
      dispatch(_rootEl, "fieldset:bind", _detail, { bubbles: true });
    }, 10);
  }

  function handleClick() {
    dispatch(_rootEl, "_continue", { el: _rootEl, state: _fieldState }, { bubbles: true });
  }

  function handleSubmit() {
    dispatch(_rootEl, "__submit", {}, { bubbles: true });
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
