<svelte:options customElement="goa-simple-form" />

<script lang="ts" context="module">
  export type FormState = {
    form: Record<string, string>;
    history: string[];
    lastModified?: Date;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { calculateMargin, Spacing } from "../../common/styling";
  import { dispatch, receive, relay } from "../../common/utils";
  import {
    ExternalContinueMsg,
    ExternalContinueRelayDetail,
    FieldsetBindMsg,
    FieldsetBindRelayDetail,
    FieldsetSubmitMsg,
    FieldsetToggleActiveMsg,
    FieldsetToggleActiveRelayDetail,
    FormFieldMountMsg,
    FormFieldMountRelayDetail,
    FormResetErrorsMsg,
    FormSetFieldsetMsg,
    FormSetFieldsetRelayDetail,
    FormSetValueMsg,
    FormSetValueRelayDetail,
  } from "../../types/relay-types";

  // Required
  export let name: string;

  // Optional
  export let storage: "none" | "local" | "session" = "none";
  export let mt: Spacing = null;
  export let mr: Spacing = null;
  export let mb: Spacing = null;
  export let ml: Spacing = null;

  // Private
  let _formEl: HTMLFormElement;
  let _fieldsets: Record<string, FieldsetBindRelayDetail> = {};
  let _formFields: Record<string, HTMLElement> = {};
  let _firstElement: string;
  let _state: FormState = {
    form: {},
    history: [],
    lastModified: undefined,
  };

  let lastPage: string;

  onMount(() => {
    restoreState();

    addWindowPopStateListener();
    addChildChangeListener();
    addRelayListener();

    setTimeout(bindChildren, 100);
  });

  // TODO: move message types into a single file for easy import at the source and destination
  function addRelayListener() {
    receive(_formEl, (type, data) => {
      // console.log(`  RECEIVE(Form:${type}):`, type, data);
      switch (type) {
        case FormFieldMountMsg:
          onFormFieldMount(data as FormFieldMountRelayDetail);
          break;
        case FieldsetBindMsg:
          onFieldsetBind(data as FieldsetBindRelayDetail);
          break;
        case ExternalContinueMsg:
          onChangePage(data as ExternalContinueRelayDetail);
          break;
        case FieldsetSubmitMsg:
          onFormSubmit();
      }
    });
  }

  // ***************
  // Relay listeners
  // ***************

  function onFormFieldMount(detail: FormFieldMountRelayDetail) {
    const { name, el } = detail;
    _formFields[name] = el;
  }

  // listen for child fieldsets
  function onFieldsetBind(detail: FieldsetBindRelayDetail) {
    _fieldsets[detail.id] = detail;

    // no previous history and first child event (first child in list)
    if (!lastPage && !_firstElement) {
      _firstElement = detail.id;
      sendToggleActiveStateMsg(detail.id);
      if (_state.history.length === 0) {
        _state.history.push(detail.id);
        saveState(_state);
      }
    } else if (lastPage === detail.id) {
      _firstElement = detail.id;
      sendToggleActiveStateMsg(detail.id);
    }
  }

  // Listening for the event dispatched from the app's form page within the on:continue handler
  function onChangePage(props: ExternalContinueRelayDetail) {
    const { next } = props;

    // clear most recent fieldset's errors
    const page = _state.history[_state.history.length - 1];
    resetFieldsetErrors(page);

    _state.history.push(next);
    saveState(_state);
    sendToggleActiveStateMsg(next);
  }

  function onFormSubmit() {
    dispatch(_formEl, "_submit", { form: _state.form }, { bubbles: true });
  }

  // ****************
  // Native listeners
  // ****************

  // listen to `_change` events by input elemented nested within fieldsets and update the state
  function addChildChangeListener() {
    _formEl.addEventListener("_change", (e: Event) => {
      const { name, value } = (
        e as CustomEvent<{ name: string; value: string }>
      ).detail;

      _state.form[name] = value;
      _state.lastModified = new Date();
      saveState(_state);

      e.stopPropagation();
    });
  }

  // *********
  // Functions
  // *********

  function resetFieldsetErrors(name: string) {
    relay(_fieldsets[name].el, FormResetErrorsMsg, null);
  }

  function sendToggleActiveStateMsg(page: string) {
    const keys = Object.keys(_fieldsets);
    keys.map((key) => {
      relay<FieldsetToggleActiveRelayDetail>(
        _fieldsets[key].el,
        FieldsetToggleActiveMsg,
        {
          first: key === keys[0],
          active: key === page,
        },
      );
    });
  }

  // listen to url changes or location back
  function addWindowPopStateListener() {
    window.addEventListener("popstate", (e: PopStateEvent) => {
      const history = [..._state.history];
      history.pop();
      _state.history = history;
      saveState(_state);
      sendToggleActiveStateMsg(history[history.length - 1]);
      e.stopPropagation();
    });
  }

  function getStorage(): Storage | null {
    if (storage === "none") return null;
    return storage === "local" ? localStorage : sessionStorage;
  }

  function saveState(state: FormState) {
    const storage = getStorage();
    storage?.setItem(name, JSON.stringify(state));
  }

  function restoreState() {
    const storage = getStorage();
    const raw = storage?.getItem(name);

    if (!raw) {
      return;
    }

    _state = JSON.parse(raw);

    // initialize history with first page if history is empty
    let historyPageCount = _state.history.length;
    if (historyPageCount > 0) {
      lastPage = _state.history[historyPageCount - 1];
    }
  }

  function bindChildren() {
    // restore state in fieldsets
    for (const [name, detail] of Object.entries(_fieldsets)) {
      relay<FormSetFieldsetRelayDetail>(detail.el, FormSetFieldsetMsg, {
        name,
        value: _state.form,
      });
    }

    // restore state in form items
    for (const [name, el] of Object.entries(_formFields)) {
      relay<FormSetValueRelayDetail>(el, FormSetValueMsg, {
        name,
        value: _state.form[name],
      });
    }
  }

  // TODO: talk to Tom to when form first loads, and storage data exists, whether a modal should
  // ask user whether or not to restore the previous data
  function resetState() {
    const storage = getStorage();
    if (!storage) return;

    storage.removeItem(name);
    _state = {
      form: {},
      history: [_fieldsets[0]?.id],
      lastModified: undefined,
    };
  }
</script>

<form bind:this={_formEl} style={calculateMargin(mt, mr, mb, ml)}>
  <slot />
</form>
