<svelte:options customElement="goa-simple-form-summary" />

<script lang="ts">
  import { onMount } from "svelte";
  import {
    FormDispatchStateMsg,
    FormDispatchStateRelayDetail,
    FormState,
    FormSummaryBindMsg,
    FormSummaryBindRelayDetail,
    FormSummaryEditPageMsg,
    FormSummaryEditPageRelayDetail,
  } from "../../types/relay-types";
  import { receive, relay } from "../../common/utils";

  let _rootEl: HTMLElement;
  let _state: FormState;
  
  onMount(() => {
    addRelayListener();

    relay<FormSummaryBindRelayDetail>(
      _rootEl,
      FormSummaryBindMsg,
      { el: _rootEl },
      { bubbles: true, timeout: 100 },
    );
  });

  function addRelayListener() {
    receive(_rootEl, (action, data) => {
      switch (action) {
        case FormDispatchStateMsg:
          onFormDispatch(data as FormDispatchStateRelayDetail);
          break;
      }
    });
  }

  function onFormDispatch(detail: FormDispatchStateRelayDetail) {
    _state = detail
    console.log(_state)
  }

  function changePage(pageId: string) {
    relay<FormSummaryEditPageRelayDetail>(_rootEl, FormSummaryEditPageMsg, { id: pageId }, { bubbles: true })
  }
  
</script>

<div bind:this={_rootEl}>

  {#if _state}
    {#each _state.history as page}
      {#if _state.form[page]}
        {#each Object.entries(_state.form[page]) as [key, value] }
          {key} - {value} 
        {/each}
        <goa-button type="tertiary" on:_click={() => changePage(page)}>Change</goa-button>
        <br />
      {/if}
    {/each}
  {/if}

</div>
