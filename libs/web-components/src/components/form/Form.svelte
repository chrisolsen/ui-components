<svelte:options customElement="goa-simple-form" />

<script lang="ts">
  import { onMount } from "svelte";
  import { calculateMargin, Spacing } from "../../common/styling";
  import { dispatch, receive, relay } from "../../common/utils";
  import {
    ExternalContinueMsg,
    ExternalContinueRelayDetail,
    FieldsetBindMsg,
    FieldsetBindRelayDetail,
    FieldsetChangeMsg,
    FieldsetChangeRelayDetail,
    FieldsetMountFormItemMsg,
    FieldsetMountFormRelayDetail,
    FieldsetSubmitMsg,
    FieldsetToggleActiveMsg,
    FieldsetToggleActiveRelayDetail,
    FormDispatchStateMsg,
    FormDispatchStateRelayDetail,
    FormResetErrorsMsg,
    FormSetFieldsetMsg,
    FormSetFieldsetRelayDetail,
    FormSetValueMsg,
    FormSetValueRelayDetail,
    FormState,
    FormSummaryBindMsg,
    FormSummaryBindRelayDetail,
    FormSummaryEditPageMsg,
    FormSummaryEditPageRelayDetail,
  } from "../../types/relay-types";

  // Don't remove this, otherwise the summary doesn't render
  import FormSummary from "./FormSummary.svelte";

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
  let _formFields: Record<string, Record<string, HTMLElement>> = {};
  let _formSummary: HTMLElement;
  let _firstElement: string;
  let _state: FormState = {
    form: {},
    history: [],
    editting: "",
    lastModified: undefined,
  };

  let lastPage: string;

  onMount(() => {
    restoreState();

    addWindowPopStateListener();
    addRelayListener();

    setTimeout(bindChildren, 100);
  });

  function addRelayListener() {
    receive(_formEl, (type, data) => {
      console.log(`  RECEIVE(Form:${type}):`, type, data);
      switch (type) {
        case FieldsetBindMsg:
          onFieldsetBind(data as FieldsetBindRelayDetail);
          break;
        case FieldsetChangeMsg:
          onFieldsetChange(data as FieldsetChangeRelayDetail);
          break;
        case FieldsetMountFormItemMsg:
          onFieldsetMountFormItem(data as FieldsetMountFormRelayDetail);
          break;
        case FormSummaryBindMsg:
          onFormSummaryBind(data as FormSummaryBindRelayDetail);
          break;
        case ExternalContinueMsg:
          onContinue(data as ExternalContinueRelayDetail);
          break;
        case FormSummaryEditPageMsg:
          onSetPage(data as FormSummaryEditPageRelayDetail);
          break;
        case FieldsetSubmitMsg:
          onFormSubmit();
          break;
      }
    });
  }

  // ***************
  // Relay listeners
  // ***************

  function onFormSummaryBind(detail: FormSummaryBindRelayDetail) {
    _formSummary = detail.el;
    syncFormSummaryState();
  }

  function onFieldsetMountFormItem(detail: FieldsetMountFormRelayDetail) {
    const { name, el, id } = detail;
    const old = _formFields[id] || {};
    _formFields[id] = { ...old, [name]: el };
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

  // listen to `_change` events by input elemented nested within fieldsets and update the state
  function onFieldsetChange(detail: FieldsetChangeRelayDetail) {
    const { id, name, label, value } = detail;
    const old = _state.form[id] || {};

    _state.form[id] = { ...old, [name]: { label, value } };
    _state.lastModified = new Date();

    saveState(_state);
  }

  // Listening for the event dispatched from the app's form page within the on:continue handler
  function onContinue(detail: ExternalContinueRelayDetail) {
    const { next } = detail;

    // clear most recent fieldset's errors
    const page = _state.history[_state.history.length - 1];
    resetFieldsetErrors(page);

    // if no page is currently being editted just go to the next page
    if (!_state.editting) {
      _state.history.push(next);
      sendToggleActiveStateMsg(next);
    } else {
      // when editting a previous value, we need to determine if the `next` page is in the same
      // "direction" as was previously followed, and if so send them back to the last page in their
      // history (summary). If the `next` is different then the previous history must be cleared
      // from that point on.
      const oldNextIndex = _state.history.indexOf(_state.editting) + 1;

      // user input did not affect their path, so forward them back to the end, otherwise the user
      // has altered their path and the history must be clear from this point forward
      if (_state.history[oldNextIndex] === next) {
        const last = _state.history[_state.history.length - 1];
        sendToggleActiveStateMsg(last);
      } else {
        _state.history = [..._state.history.slice(0, oldNextIndex), next];
        saveState(_state);
        sendToggleActiveStateMsg(next);
        sendEdittingStateMsg();
      }
      _state.editting = "";
    }

    syncFormSummaryState();
    saveState(_state);
  }

  function syncFormSummaryState() {
    relay<FormDispatchStateRelayDetail>(
      _formSummary,
      FormDispatchStateMsg,
      _state,
    );
  }

  function onSetPage(detail: FormSummaryEditPageRelayDetail) {
    _state.editting = detail.id; // editting mode is an ephemoral value and is *not* saved to local storage

    sendToggleActiveStateMsg(detail.id);
    sendEdittingStateMsg();
  }

  // notify fieldsets of editting state to allow it to not show the `back` link
  function sendEdittingStateMsg() {
    for (const fieldset of Object.values(_fieldsets)) {
      relay<FormDispatchStateRelayDetail>(
        fieldset.el,
        FormDispatchStateMsg,
        _state,
      );
    }
  }

  function onFormSubmit() {
    dispatch(_formEl, "_submit", { form: _state.form }, { bubbles: true });
  }

  // *********
  // Functions
  // *********

  function resetFieldsetErrors(name: string) {
    relay(_fieldsets[name].el, FormResetErrorsMsg, null);
  }

  function sendToggleActiveStateMsg(page: string) {
    const keys = Object.keys(_fieldsets);
    keys.forEach((key) => {
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
      const fieldset = _state.form[name];
      if (fieldset)
        relay<FormSetFieldsetRelayDetail>(detail.el, FormSetFieldsetMsg, {
          name,
          value: fieldset["value"],
        });
    }

    // restore state in form items
    for (const id of Object.keys(_formFields)) {
      for (const [name, el] of Object.entries(_formFields[id])) {
        const data = _state.form[id]?.[name];
        if (data) {
          relay<FormSetValueRelayDetail>(el, FormSetValueMsg, {
            name,
            value: data["value"],
          });
        }
      }
    }
  }

  function resetState() {
    const storage = getStorage();
    if (!storage) return;

    storage.removeItem(name);
    _state = {
      form: {},
      history: [_fieldsets[0]?.id],
      editting: "",
      lastModified: undefined,
    };
  }
</script>

<form bind:this={_formEl} style={calculateMargin(mt, mr, mb, ml)}>
  <slot />
</form>
