<svelte:options customElement="goa-form-loop" />

<script lang="ts">
  import { onMount } from "svelte";
  import { dispatch, receive, relay } from "../../common/utils";
  import {
    FieldsetChangeMsg,
    FieldsetChangeRelayDetail,
    FieldsetToggleActiveMsg,
    FormLoopBreakMsg,
    FormLoopChangeRelayDetail,
    FormLoopPauseHistory,
  } from "../../types/relay-types";

  export let id: string = "";
  export let breakmsg: string = "";

  let _hasActiveChild: boolean = false;

  let _dispatcher: HTMLElement;
  let _data: FormLoopChangeRelayDetail = {
    id: "",
    state: [],
  };

  onMount(() => {
    receive(_dispatcher, (action, data, e) => {
      // console.log(`  RECEIVE(FormLoop => ${action}):`, data);

      switch (action) {
        case FieldsetChangeMsg:
          handleFieldsetChange(data as FieldsetChangeRelayDetail);
          e.stopPropagation();
          break;

        case breakmsg:
          handleBreak();
          break;

        case FieldsetToggleActiveMsg:
          handleActiveChild();
          e.stopPropagation();
          break;
      }
    });
  });

  // =========
  // Functions
  // =========

  // When an active child exists a message needs to be sent to the Form, telling it to pause
  // recording of the history, which will prevent recording of the loop.
  function handleActiveChild() {
    _hasActiveChild = true;
    relay(_dispatcher, FormLoopPauseHistory, null, { bubbles: true })
  }

  // 1. Store data locally for later _change relay
  // 2. Dispatch data to allow for display (this data needs to be restructured for easy use)
  function handleFieldsetChange(detail: FieldsetChangeRelayDetail) {  
    // Don't include the data if there is no state
    if (Object.keys(detail.state).length === 0) {
      return;
    }

    // Remap the Fieldset data and dispatch to web app to allow data to be displayed
    const items = Object.entries(detail.state) // Record<string, {name, value, label}
      .map((entry) => entry[1]) // {name, value, label}
      .reduce((acc, item) => {
        return { ...acc, [item.name]: item.value };
      }, {});

    dispatch(_dispatcher, "_change", items, { bubbles: true });

    _data.id = id;
    _data.state.push({...detail.state});
  }

  function handleBreak() {
    // dispatch data list
    relay(_dispatcher, FormLoopBreakMsg, _data, { bubbles: true });

    // unpause history
    relay(_dispatcher, FormLoopPauseHistory, null, { bubbles: true });
  }
</script>

<div bind:this={_dispatcher}>
  <slot />
</div>
