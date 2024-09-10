<svelte:options customElement="goa-form-loop" />

<script lang="ts">
  import { onMount } from "svelte";
  import { dispatch, receive, relay } from "../../common/utils";
  import {
    FieldsetChangeMsg,
    FieldsetChangeRelayDetail,
    FieldsetContinueMsg,
    FieldsetItemState,
    FieldsetToggleActiveMsg,
    FormDispatchStateMsg,
    FormFormLoopSyncMsg,
    FormFormLoopSyncRelayDetail,
    FormLoopBindMsg,
    FormLoopBindRelayDetail,
    FormLoopBreakMsg,
    FormLoopChangeRelayDetail,
    FormLoopPauseHistory,
    FormLoopPauseRelayDetail,
    PublicFormButtonClick,
  } from "../../types/relay-types";

  export let id: string = "";
  export let breakmsg: string = "";

  let _dispatcher: HTMLElement;
  let _data: FormLoopChangeRelayDetail = {
    id: "",
    state: [],
  };

  onMount(() => {

    bind();

    receive(_dispatcher, (action, data, e) => {
      // console.log(`  RECEIVE(FormLoop => ${action}):`, data);
      switch (action) {
        case FieldsetChangeMsg:
          handleFieldsetChange(data as FieldsetChangeRelayDetail);
          e.stopPropagation();
          break;

        // This is a user defined msg usually associated with the secondary button action to 
        // break out of the loop
        case breakmsg:
          handleBreak();
          break;

        case FieldsetToggleActiveMsg:
          handleActiveChild();
          e.stopPropagation();
          break;

        case FormFormLoopSyncMsg:
          handleSync(data as FormFormLoopSyncRelayDetail);
          break;
      }
    });

    // handle certain button events
    _dispatcher.addEventListener("_click", (e: Event) => {
      const { action, index } = (e as CustomEvent<PublicFormButtonClick>).detail;
      if (!action || !index) return;

      if (action === "remove") {
        _data.state = _data.state.filter((_, i) => i !== index);

        // send data to dev to allow them to display the data
        const data = _data.state.map(item => remapData(item));
        dispatch(_dispatcher, "_bind", data, { bubbles: true});
      }
    })
  });

  // =========
  // Functions
  // =========

  // Dispatches the form loop data to the dev allowing them to show the data contained within
  // the form loop, also provides the ability to add the binding to allow for updates and deletion
  function handleSync(detail: FormFormLoopSyncRelayDetail) {
    // The detail should always be a list for the Form loop, it is a single item for other components
    if (!Array.isArray(detail)) {
      return;
    }

    // set previous stored items
    _data.id = id;
    _data.state = detail;

    // send data to dev to allow them to display the data
    const data = detail.map(item => remapData(item));
    dispatch(_dispatcher, "_bind", data, { bubbles: true});
  }

  // Pass element ref to Form components to allow for later communication
  function bind() {
    relay<FormLoopBindRelayDetail>(_dispatcher, FormLoopBindMsg, { id, el: _dispatcher}, { bubbles: true })  
  }

  // When an active child exists a message needs to be sent to the Form, telling it to pause
  // recording of the history, which will prevent recording of the loop.
  function handleActiveChild() {
    relay<FormLoopPauseRelayDetail>(_dispatcher, FormLoopPauseHistory, { paused: true }, { bubbles: true })
  }

  // 1. Store data locally for later _change relay
  // 2. Dispatch data to allow for display (this data needs to be restructured for easy use)
  function handleFieldsetChange(detail: FieldsetChangeRelayDetail) {  
    // Don't include the data if there is no state
    if (Object.keys(detail.state).length === 0) {
      return;
    }

    // Remap the Fieldset data and dispatch to web app to allow data to be displayed
    const items = remapData(detail.state);
    dispatch(_dispatcher, "_change", items, { bubbles: true });

    _data.id = id;
    _data.state.push({...detail.state});
  }

  function handleBreak() {
    // dispatch data list
    relay(_dispatcher, FormLoopBreakMsg, _data, { bubbles: true });

    // unpause history
    relay<FormLoopPauseRelayDetail>(_dispatcher, FormLoopPauseHistory, { paused: false }, { bubbles: true });

    const data = _data.state.map(item => remapData(item));
    dispatch(_dispatcher, "_bind", data, { bubbles: true});
  }

  function remapData(data: Record<string, FieldsetItemState>) {
    return Object.entries(data) // Record<string, {name, value, label}
      .map((entry) => entry[1]) // {name, value, label}
      .reduce((acc, item) => {
        return { ...acc, [item.name]: item.value };
      }, {});
  }
</script>

<div bind:this={_dispatcher}>
  <slot />
</div>
