<svelte:options tag="goa-app-footer-nav-section" />

<script lang="ts">
  import { onMount, tick } from "svelte";
  import { toBoolean } from "../../common/utils";

  export let name: string = "";
  export let columncount: number = 1;

  let rootEl: HTMLElement;
  let slot: HTMLSlotElement;
  let children: HTMLLinkElement[] = [];

  // Inject styles into host element to allow the flex setting
  // to be set on the child element to the flex parent.
  $: {
    // This is pretty hacky, but the only way I could get access to 
    // the root element and add the required styles
    const style = document.createElement("style") 
    style.innerHTML = `:host { flex-grow: ${columncount}}`;
    (rootEl?.parentNode as ShadowRoot)?.appendChild(style);
  } 
  
  onMount(async () => {
    await tick();
    children = slot.assignedElements() as HTMLLinkElement[];
  });
</script>

<!-- Styles -->

<style>

  :host {
    /* The flex-grow is set via code above  */
    flex: auto;
  }

  .title {
    font-size: var(--fs-xl);
    line-height: var(--lh-lg);
  }

  .hidden {
    display: none;
  }

  .links {
    display: block;
    list-style-type: none;
    padding-left: 0;
  }

  @media (min-width: 640px) {
    .links {
      display: var(--display-type);
      list-style-type: none;
      padding-left: 0;
      flex-direction: column;
      column-count: var(--column-count);
    }
  }

  a {
    color: var(--goa-color-text);
    line-height: 3rem;
  }

</style>

<!-- Template -->
<section bind:this={rootEl}>
  {#if name}
    <div class="title">{name}</div>
    <goa-divider spacing="small" />
  {/if}

  <div class="hidden">
    <slot bind:this={slot} />
  </div>

  <ul 
    class="links" 
    style={`
      --display-type: ${columncount > 1 ? "block" : "flex"};
      --column-count: ${columncount};
    `}>
    {#each children as child}
      <li><a href={child.href}>{child.innerHTML}</a></li>
    {/each}
  </ul>

</section>
