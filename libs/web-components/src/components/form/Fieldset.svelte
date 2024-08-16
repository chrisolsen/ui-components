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
    FieldsetContinueMsg,
    FieldsetErrorRelayDetail,
    FieldsetMountFormItemMsg,
    FieldsetMountFormRelayDetail,
    FieldsetResetErrorsMsg,
    FieldsetSetErrorMsg,
    FieldsetSubmitMsg,
    FieldsetToggleActiveMsg,
    FieldsetToggleActiveRelayDetail,
    FieldsetValidationRelayDetail,
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

  // ======
  // Public
  // ======
  
  export let id: string = "";
  export let heading: string = "";
  export let buttonText: string = "";
  export let mt: Spacing = null;
  export let mr: Spacing = null;
  export let mb: Spacing = null;
  export let ml: Spacing = null;
  export let first: boolean = false;
  export let last: boolean = false;

  let _rootEl: HTMLElement;
  let _active: boolean = false;
  let _editting: boolean = false;
  let _detail: FieldsetBindRelayDetail;

  let _errors: Record<string, string> = {};
  let _fieldState: Record<string, string> = {};
  let _formItems: Record<string, { label: string; el: HTMLElement }> = {};
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
      // console.log(`  RECEIVE(Fieldset => ${action}):`, data);
      switch (action) {
        // case FormSetFieldsetMsg:
        //   onSetFieldset(data as FormSetFieldsetRelayDetail);
        //   break;
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
    // allow customization of form if user has jumped back to a question (editting mode)
    _editting = detail.editting === id;
  }

  // Set the child form elements values
  // function onSetFieldset(detail: FormSetFieldsetRelayDetail) {
  //   const { name, value: values } = detail;

  //   if (name !== id) return;
  //   if (!values) return;

  //   setTimeout(() => {
  //     for (const [propName, value] of Object.entries(values)) {
  //       if (Object.keys(_formFields).includes(propName)) {
  //         _fieldState[name] = value;
  //       }
  //     }
  //   }, 100);
  // }

  function onErrorReset() {
    // FIXME: these values are occasionally empty
    // console.log("in fieldset resetting errors", _formFields, _formItems)
    // fieldset error summar
    _errors = {};

    // reset children
    for (const [_, el] of Object.entries(_formFields)) {
      relay(el, FieldsetResetErrorsMsg, null);
    }
    for (const [_, {el}] of Object.entries(_formItems)) {
      relay(el, FieldsetResetErrorsMsg, null);
    }
  }

  function onToggleActiveState(detail: FieldsetToggleActiveRelayDetail) {
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

    // dispatch error down to fields
    relay<FieldsetErrorRelayDetail>(
      _formFields[detail.name],
      FieldsetSetErrorMsg,
      {
        error: detail.msg,
      },
    );

    // dispatch error down to form items
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
  function onSaveAndContinue() {
    dispatch<FieldsetValidationRelayDetail>(
      _rootEl,
      FieldsetContinueMsg,
      { el: _rootEl, state: _fieldState },
      { bubbles: true },
    );
  }

  function onSubmit() {
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

  function jumpToFormItem(e: Event, id: string) {
    _formFields[id].focus();
    e.preventDefault();
  }
</script>

<section bind:this={_rootEl}>
  <fieldset
    style={styles(
      calculateMargin(mt, mr, mb, ml),
      `display: ${_active ? "block" : "none"}`,
    )}
  >
    {#if !first && !_editting && !last}
      <goa-link-button leadingicon="chevron-back" mb="2xl" on:_click={handleBack}>
        Back
      </goa-link-button>
    {/if}

    {#if Object.keys(_errors).length}
      <goa-callout
        type="emergency"
        heading="Please correct the following errors on this page:"
      >
        <ul class="errors">
          {#each Object.keys(_errors) as key}
            <li>
              <a
                class="error"
                href={`#${key}`}
                on:click={(e) => jumpToFormItem(e, key)}>{_errors[key]}</a
              >
            </li>
          {/each}
        </ul>
      </goa-callout>
    {/if}

    {#if heading}
      <goa-text as="h2" size="heading-l">{heading}</goa-text>
    {/if}

    <slot />

    {#if false}
      <goa-block mt="xl">
        <goa-button on:_click={onSubmit} type="primary">
          {buttonText || "Confirm"}
        </goa-button>
      </goa-block>
    {:else}
      <goa-block mt="xl">
        <goa-button on:_click={onSaveAndContinue} type="primary">
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

  .errors li::marker,
  a.error,
  a.error:visited {
    color: var(--goa-color-emergency-dark);
  }
</style>
