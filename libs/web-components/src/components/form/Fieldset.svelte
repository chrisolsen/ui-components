<svelte:options customElement="goa-fieldset" />

<script lang="ts">
  import { onMount } from "svelte";
  import { calculateMargin, Spacing } from "../../common/styling";
  import { dispatch, receive, relay, styles } from "../../common/utils";
  import {
    ExternalErrorRelayDetail,
    ExternalSetErrorMsg,
    FieldsetBindMsg,
    FieldsetBindRelayDetail,
    FieldsetChangeMsg,
    FieldsetChangeRelayDetail,
    FieldsetErrorRelayDetail,
    FieldsetMountFormItemMsg,
    FieldsetMountFormRelayDetail,
    FieldsetResetErrorsMsg,
    FieldsetSetErrorMsg,
    FieldsetSubmitMsg,
    FieldsetToggleActiveMsg,
    FieldsetToggleActiveRelayDetail,
    FormDispatchStateMsg,
    FormDispatchStateRelayDetail,
    FormFieldMountMsg,
    FormFieldMountRelayDetail,
    FormItemMountMsg,
    FormItemMountRelayDetail,
    FormResetErrorsMsg,
    FormSetFieldsetMsg,
    FormSetFieldsetRelayDetail,
  } from "../../types/relay-types";

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
  let _editting: boolean = false;
  let _detail: FieldsetBindRelayDetail;

  let _errors: Record<string, string> = {};
  let _fieldState: Record<string, string> = {};
  let _formItems: Record<string, {label: string, el: HTMLElement }> = {};
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
    receive(_rootEl, (action, data) => {
      console.log(`  RECEIVE(Fieldset:${action}):`, data);
      switch (action) {
        case FormSetFieldsetMsg:
          onSetFieldset(data as FormSetFieldsetRelayDetail);
          break;
        case FormResetErrorsMsg:
          onErrorReset();
          break;
        case FormDispatchStateMsg:
          onFormDispatch(data as FormDispatchStateRelayDetail);
          break;
        case FormItemMountMsg:
          onFormItemMount(data as FormItemMountRelayDetail);
          break;
        case FormFieldMountMsg:
          onFieldsetMount(data as FormFieldMountRelayDetail);
          break;
        case FieldsetToggleActiveMsg:
          onToggleActiveState(data as FieldsetToggleActiveRelayDetail);
          break;
        case ExternalSetErrorMsg:
          onError(data as ExternalErrorRelayDetail);
          break;
      }
    });
  }

  // *****************
  // Dispatch handlers
  // *****************

  function onFormDispatch(detail: FormDispatchStateRelayDetail) {
    _editting = detail.editting === id;
  }

  // Set the child form elements values
  function onSetFieldset(detail: FormSetFieldsetRelayDetail) {
    const { name, value: values } = detail;

    if (name !== id) return;
    if (!values) return;

    setTimeout(() => {
      for (const [propName, value] of Object.entries(values)) {
        if (Object.keys(_formFields).includes(propName)) {
          _fieldState[name] = value;
        }
      }
    }, 100);
  }

  function onErrorReset() {
    // fieldset error summar
    _errors = {};

    // reset children
    for (const [_, el] of Object.entries(_formFields)) {
      relay(el, FieldsetResetErrorsMsg, null);
    }
  }

  function onToggleActiveState(detail: FieldsetToggleActiveRelayDetail) {
    _firstElement = detail.first;
    _active = detail.active;
  }

  function onFormItemMount(detail: FormItemMountRelayDetail) {
    const { id, label, el } = detail;
    _formItems[id] = { label, el };
  }

  // Collect list of child form item (input, dropdown, etc) elements
  function onFieldsetMount(detail: FormFieldMountRelayDetail) {
    const { name, el } = detail;
    _formFields[name] = el;

    // dispatch to the Form along with the fieldset id
    relay<FieldsetMountFormRelayDetail>(
      _rootEl,
      FieldsetMountFormItemMsg,
      { id, name, el },
      { bubbles: true },
    );
  }

  function onError(detail: ExternalErrorRelayDetail) {
    _errors[detail.name] = detail.msg;

    // dispatch error down to form items and fields
    relay<FieldsetErrorRelayDetail>(
      _formFields[detail.name],
      FieldsetSetErrorMsg,
      {
        error: detail.msg,
      },
    );
    relay<FieldsetErrorRelayDetail>(
      _formItems[detail.name].el,
      FieldsetSetErrorMsg,
      {
        error: detail.msg,
      },
    );
  }

  // **************
  // Event handlers
  // **************

  // Dispatch _continue event to app's level allowing custom validation to be performed
  function handleClick() {
    dispatch(
      _rootEl,
      "_continue",
      { el: _rootEl, state: _fieldState },
      { bubbles: true },
    );
  }

  function handleSubmit() {
    relay(_rootEl, FieldsetSubmitMsg, {}, { bubbles: true });
  }

  function handleBack(e: Event) {
    history.back();
    e.stopPropagation();
  }

  // *********
  // Functions
  // *********

  function addChildChangeListener() {
    _rootEl.addEventListener("_change", (e: Event) => {
      const { name, value } = (e as CustomEvent).detail;
      _fieldState[name] = value;

      const label = _formItems[name].label;

      // redispatch message with value grouped under fieldset name
      relay<FieldsetChangeRelayDetail>(
        _rootEl,
        FieldsetChangeMsg,
        { id, name, value, label },
        { bubbles: true },
      );
    });
  }

  function dispatchBindMsg() {
    relay<FieldsetBindRelayDetail>(_rootEl, FieldsetBindMsg, _detail, {
      bubbles: true,
      timeout: 10,
    });
  }
</script>

<section bind:this={_rootEl}>
  <fieldset
    style={styles(
      calculateMargin(mt, mr, mb, ml),
      `display: ${_active ? "block" : "none"}`,
    )}
  >
    {#if !_firstElement && !_editting}
      <button on:click={handleBack}>
        <goa-link type="tertiary" leadingicon="chevron-back" mb="2xl">
          Back
        </goa-link>
      </button>
    {:else}
      <div style="visibility: hidden">&nbsp;</div>
      <goa-spacer vspacing="2xl" />
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

    {#if heading}
      <goa-text as="h2" size="heading-l">{heading}</goa-text>
    {/if}

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
