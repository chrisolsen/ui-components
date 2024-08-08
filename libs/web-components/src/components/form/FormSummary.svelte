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
  }

  function changePage(pageId: string) {
    relay<FormSummaryEditPageRelayDetail>(_rootEl, FormSummaryEditPageMsg, { id: pageId }, { bubbles: true })
  }

  function format(value: string): string {
    if (!value) return "";

    const str = value.replace(/-/g, " ");
    return str[0].toUpperCase() + str.slice(1);
  }
  
</script>

<div bind:this={_rootEl}>
  {#if _state}
    {#each _state.history as page}
      {#if _state.form[page]}
        <goa-container>
          <goa-block>
            <div class="page">{format(page)}</div>
            <goa-spacer hspacing="fill" />
            <goa-button type="tertiary" size="compact" leadingicon="pencil" on:_click={() => changePage(page)}>Change</goa-button>
          </goa-block>
          {#each Object.entries(_state.form[page]) as [_, value] }
            <dl>
              <dt>{value.label}</dt>
              <dd>{value.value}</dd>
            </dl>
          {/each}
        </goa-container>
      {/if}
    {/each}
  {/if}
</div>

<style>
  .page {
    color: var(--goa-color-greyscale-700);
  }
    
  dl {
    margin: 0.5rem 0;
  }
  dt {
    display: inline-block;  
    width: 50%;
    font: var(--goa-typography-heading-s);
  }
  dd {
    display: inline-block;  
  }
</style>
