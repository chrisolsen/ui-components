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

  onMount(() => {
    restoreState()
    addFieldsetBindListener();
    addWindowPopStateListener();
    addChildChangeListener();
    addChangePageListener();
    addFormSubmitListener();
    addFormFieldListener();

    setTimeout(restoreState, 100);
  });

  function addFormFieldListener() {
    _formEl.addEventListener("form-field:mounted", (e: Event) => {
      // TODO: add CustomEvent typing
      const { el } = (e as CustomEvent).detail;
      _formFields[el.name] = el;
    });
  }

  function addFormSubmitListener() {
    _formEl.addEventListener("__submit", (e: Event) => {
      _formEl.dispatchEvent(
        new CustomEvent("_submit", {
          composed: true,
          bubbles: true,
          detail: {
            form: _state.form,
          },
        }),
      );
      e.stopPropagation();
    });
  }

  // Listening for the event dispatched from the app's form page within the on:continue handler
  function addChangePageListener() {
    _formEl.addEventListener("_next", (e: Event) => {
      const { next } = (e as CustomEvent).detail;

      // clear most recent fieldset's errors 
      resetFieldsetErrors(_state.history[_state.history.length - 1])
      
      _state.history.push(next);
      saveState(_state);
      sendToggleActiveStateMsg(next);
    });
  }

  function resetFieldsetErrors(name: string) {
    _fieldsets[name].el.dispatchEvent(new CustomEvent("__resetErrors", {
      composed: true,
    }))
  }

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

  // listen for child fieldsets
  function addFieldsetBindListener() {
    let lastPage = undefined;
    let historyPageCount = _state.history.length;
    if (historyPageCount) {
      lastPage = _state.history[historyPageCount - 1];
    }
    _formEl.addEventListener("fieldset:bind", (e: Event) => {
      const detail = (e as CustomEvent<FieldsetDetail>).detail;
      _fieldsets[detail.id] = detail;

      // 
        // no previous history and first child event (first child in list)
      if (!lastPage && !_firstElement) {
        _firstElement = detail.id;
        sendToggleActiveStateMsg(detail.id);
        if (_state.history.length === 0) {
          _state.history.push(detail.id);
          saveState(_state)
        }
      } else if (lastPage === detail.id) {
        _firstElement = detail.id;  
        sendToggleActiveStateMsg(detail.id);
      }

      e.stopPropagation();
    });
  }

  // listen to url changes or location back
  function addWindowPopStateListener() {
    window.addEventListener("popstate", (e: PopStateEvent) => {
      const history = [..._state.history];
      history.pop();
      _state.history = history;
      saveState(_state);
      sendToggleActiveStateMsg(history[history.length - 1])
      e.stopPropagation();
    });
  }

  function sendToggleActiveStateMsg(page: string) {
    const keys = Object.keys(_fieldsets);
    keys.map((key) => {
      _fieldsets[key].el.dispatchEvent(
        new CustomEvent("fieldset:toggle-active", {
          composed: true,
          detail: {
            first: key === keys[0],
            active: key === page,
          },
        }),
      );
    });
  }

  function saveState(state: FormState) {
    localStorage.setItem(name, JSON.stringify(state));
  }

  function restoreState() {
    const raw = localStorage.getItem(name);
    if (raw) {
      _state = JSON.parse(raw);
      for (const [name, detail] of Object.entries(_fieldsets)) {
        detail.el.dispatchEvent(
          new CustomEvent("send", {
            composed: true,
            detail: {
              type: "set:fieldset",
              name,
              value: _state.form,
            },
          }),
        );
      }
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
