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
  import {
    FieldsetDetail,
    FieldsetPayload,
    FieldsetPayloadTypes,
  } from "./Fieldset.svelte";
  import { calculateMargin, Spacing } from "../../common/styling";
  import { dispatch, receive, relay } from "../../common/utils";

  // Required
  export let name: string;

  // Optional
  export let mt: Spacing = null;
  export let mr: Spacing = null;
  export let mb: Spacing = null;
  export let ml: Spacing = null;

  // Private
  let _formEl: HTMLFormElement;
  let _fieldsets: Record<string, FieldsetDetail> = {};
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

    // js events
    addWindowPopStateListener();
    addChildChangeListener();

    addRelayListener();

    setTimeout(restoreState, 100);
  });

  // TODO: move message types into a single file for easy import at the source and destination
  function addRelayListener() {
    receive(_formEl, (type, data) => {
      console.log(`  RECEIVE(Form:${type}):`, type, data);
      switch (type) {
        case "form-field::on:mount":
          onFormFieldMount(data);
          break;
        case "fieldset::on:bind":
          onFieldsetBind(data);
          break;
        case "_next":
          onChangePage(data);
          break;
        case "__submit":
          onFormSubmit();
      }
    });
  }

  // ***************
  // Relay listeners
  // ***************

  function onFormFieldMount(d: unknown) {
    const { name, el } = d as { name: string; el: HTMLElement };
    _formFields[name] = el;
  }

  // listen for child fieldsets
  function onFieldsetBind(d: unknown) {
    const detail = d as { id: string; heading: string; el: HTMLElement };

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
  function onChangePage(d: unknown) {
    const { next } = d as { next: string };

    // clear most recent fieldset's errors
    resetFieldsetErrors(_state.history[_state.history.length - 1]);

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

  // listen to `_change` events by input elemented nested within fieldsets
  // and update the state
  function addChildChangeListener() {
    _formEl.addEventListener("_change", (e: Event) => {
      const { name, value } = (e as CustomEvent<ChangeEvent>).detail;

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
    relay(_fieldsets[name].el, "form::reset:errors", null);
  }

  function sendToggleActiveStateMsg(page: string) {
    const keys = Object.keys(_fieldsets);
    keys.map((key) => {
      relay(_fieldsets[key].el, "fieldset:toggle-active", {
        first: key === keys[0],
        active: key === page,
      });
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

  function saveState(state: FormState) {
    localStorage.setItem(name, JSON.stringify(state));
  }

  function restoreState() {
    const raw = localStorage.getItem(name);
    if (!raw) {
      return;
    }

    _state = JSON.parse(raw);

    // restore state in fieldsets
    for (const [name, detail] of Object.entries(_fieldsets)) {
      relay(detail.el, "form::set:fieldset", {
        name,
        value: _state.form,
      });
    }

    // restore state in form items
    console.log("formfields", _formFields)
    for (const [name, el] of Object.entries(_formFields)) {
      relay(el, "form::set:value", {
        name,
        value: _state.form[name],
      });
    }

    // initialize history with first page if history is empty
    let historyPageCount = _state.history.length;
    if (historyPageCount === 0) {
      lastPage = _state.history[historyPageCount - 1];
    }
  }

  // function resetState() {
  //   localStorage.removeItem(name);
  //   state = {
  //     form: {},
  //     history: ["name"],
  //     lastModified: undefined,
  //   };
  // }
</script>

<form bind:this={_formEl} style={calculateMargin(mt, mr, mb, ml)}>
  <slot />
</form>
