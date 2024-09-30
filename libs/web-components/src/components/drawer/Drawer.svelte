<svelte:options customElement="goax-drawer" />

<script lang="ts">
  import noscroll from "../../common/no-scroll";
  import { onDestroy, onMount, tick } from "svelte";
  import { style, styles } from "../../common/utils";

  // TODO:
  // * add in tokens
  // * refactor html struct

  // ******
  // Public
  // ******

  export let open: boolean = false;
  export let anchor: "bottom" | "left" | "right" | undefined = undefined;
  export let heading: string = "";
  export let maxSize: string = "";

  // *******
  // Private
  // *******

  // element refs
  let _rootEl: HTMLElement | null = null;

  // computes the required absolute position offset to hide the drawer when not shown
  let _drawerSize: number;

  // ========
  // Reactive
  // ========

  $: maxSize = maxSize || anchor === "bottom" ? "80vh" : "500px";

  // *****
  // Hooks
  // *****

  onMount(async () => {
    await tick();

    if (anchor === "bottom") {
      _drawerSize = _rootEl?.getBoundingClientRect().height ?? 0;
    } else {
      _drawerSize = _rootEl?.getBoundingClientRect().width ?? 0;
    }

    // event listeners
    window.addEventListener("keydown", onInputKeyDown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", onInputKeyDown);
  });

  // *********
  // Functions
  // *********

  function close(e: Event) {
    _rootEl?.dispatchEvent(new CustomEvent("_close", { composed: true }));
    e.stopPropagation();
  }

  const onInputKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        close(e);
        e.preventDefault();
        break;
    }
  };

  function scrollableHeight() {
    return anchor === "bottom"
      ? maxSize // bottom uses user-set/default maxSize
      : $$slots.actions // left/right have to calculate max size
        ? "calc(100vh - 12.5rem - 1px)" // actions bar = 6.5rem + 1px (border)
        : "calc(100vh - 6rem)"; // no actions bar just heading and padding
  }
</script>

<div
  class="background"
  style={styles(
    style("visibility", open ? "visible" : "hidden"),
    style("opacity", open ? "1" : "0"),
  )}
>
  <div
    use:noscroll={{ enable: open }}
    style={styles(
      style("--drawer-offset", `-${_drawerSize}px`),
      style("height", anchor === "bottom" ? "unset" : "100vh"),
      style("max-width", anchor === "bottom" ? "unset" : maxSize),
      style("width", anchor !== "bottom" ? maxSize : "100%"),
    )}
    class={`drawer drawer-${anchor}`}
    class:drawer-open-bottom={anchor === "bottom" && open}
    class:drawer-open-right={anchor === "right" && open}
    class:drawer-open-left={anchor === "left" && open}
    bind:this={_rootEl}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="topbar">
      <div class="heading">
        {heading}
      </div>
      <goa-icon-button
        data-ignore-focus="true"
        data-testid="drawer-close-button"
        arialabel="Close the drawer"
        variant="dark"
        icon="close"
        on:click={close}
      />
    </div>

    <div data-testid="drawer-content" class="drawer-content">
      <goa-scrollable direction="vertical" maxheight={scrollableHeight()}>
        <slot />
      </goa-scrollable>
    </div>

    {#if $$slots.actions}
      <section class="drawer-actions">
        <slot name="actions" />
      </section>
    {/if}
  </div>
</div>

<style>
  :host * {
    --goa-drawer-bg-color: rgba(0,0,0,0.3);
    --goa-drawer-bottom-shadow: 0 -4px 12px rgba(0,0,0,0.2);
    --goa-drawer-left-shadow: 4px 0 12px rgba(0,0,0,0.2);
    --goa-drawer-right-shadow: -4px 0 12px rgba(0,0,0,0.2);
    --goa-drawer-transition-time: 200ms;
    --goa-drawer-padding: --goa-space-xl;
  
    box-sizing: border-box;
  }

  .background {
    position: fixed;
    inset: 0;
    z-index: 999;
    background-color: var(--goa-drawer-bg-color);
    transition: opacity 200ms ease-out;
  }

  .drawer {
    font-family: var(--goa-font-family-sans);
    position: fixed;
    z-index: 9999;
    transition: all var(--goa-drawer-transition-time) ease-out;
    display: flex;
    flex-direction: column;
    background-color: #f8f8f8;
  }

  .topbar {
    border-bottom: 1px solid var(--goa-color-greyscale-200);
    display: flex;
    padding: var(--goa-space-m);
    justify-content: space-between;
  }

  .heading {
    font: var(--goa-typography-heading-s);
  }

  .drawer-content {
    padding: var(--goa-space-m);
    flex: 0 1 auto;
  }

  .drawer-actions {
    width: 100%;
    padding: var(--goa-space-l) var(--goa-space-xl) var(--goa-space-xl);
    border-top: var(--goa-border-width-s) solid var(--goa-color-greyscale-200);
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    background: var(--goa-color-greyscale-white);
  }

  .drawer-close {
    padding-left: var(--goa-space-m);
    margin-top: var(--goa-space-2xs);
  }

  /* Bottom */

  .drawer-bottom {
    bottom: var(--drawer-offset);
    width: 100%;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    box-shadow: var(--goa-drawer-bottom-shadow);
  }
  .drawer-open-bottom {
    bottom: 0;
  }

  /* Right */

  .drawer-right {
    right: var(--drawer-offset);
    height: 100%;
    box-shadow: var(--goa-drawer-right-shadow);
  }
  .drawer-open-right {
    right: 0;
  }

  /* Left */

  .drawer-left {
    left: var(--drawer-offset);
    height: 100%;
    box-shadow: var(--goa-drawer-left-shadow);
  }
  .drawer-open-left {
    left: 0;
  }
</style>
