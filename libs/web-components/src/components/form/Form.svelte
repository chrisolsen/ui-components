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
  import { FieldsetDetail, FieldsetPayload, FieldsetPayloadTypes } from "./Fieldset.svelte";
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
      console.log("fielset mounted!")
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
      console.log("next event handler")
      const { next } = (e as CustomEvent).detail;

      // clear most recent fieldset's errors 
      console.log("page change listener")
      resetFieldsetErrors(_state.history[_state.history.length - 1])
      
      _state.history.push(next);
      saveState(_state);
      sendToggleActiveStateMsg(next);
    });
  }

  function resetFieldsetErrors(name: string) {
    // here
    console.log("resetting errors")
    sendMessage(_fieldsets[name].el, "__resetErrors", null)
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
    console.log("fieldset:bind", "adding")
    _formEl.addEventListener("fieldset:bind", (e: Event) => {
      console.log("fieldset:bind", "listening")
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

  function sendToggleActiveStateMsg(page: string) {
    const keys = Object.keys(_fieldsets);
    console.log("sendToggleActiveState", keys)
    keys.map((key) => {
      // here
      sendMessage(_fieldsets[key].el,"fieldset:toggle-active", {
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
      sendToggleActiveStateMsg(history[history.length - 1])
      e.stopPropagation();
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
        // here
        sendMessage(detail.el, "set:fieldset", {
          name,
          value: _state.form,
        })
      }
    }
  }

  // TODO: make this a global method
  function sendMessage(sender: HTMLElement, msg: FieldsetPayloadTypes, data: unknown) {
    console.log("sending message", sender, msg, data)
    sender.dispatchEvent(
      new CustomEvent<FieldsetPayload>("msg", {
        composed: true,
        detail: {
          action: msg,
          data
        },
      }),
    );
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
