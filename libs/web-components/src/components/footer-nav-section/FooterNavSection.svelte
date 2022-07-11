<svelte:options tag="goa-footer-nav-section" />

<script lang="ts">
  import { onMount, tick } from "svelte";
  import { toBoolean } from "../../common/utils";

  export let name: string = "";
  export let multicol: string = "false";

  let rootEl: HTMLElement;
  let slot: HTMLSlotElement;
  let children: HTMLLinkElement[] = [];

  $: isMultiCol = toBoolean(multicol);

  // Inject styles into host element to allow the flex setting
  // to be set on the child element to the flex parent.
  $: {
    // This is pretty hacky, but the only way I could get access to 
    // the root element and add the required styles
    const style = document.createElement("style") 
    style.innerHTML = `:host { flex-grow: ${isMultiCol ? 2 : 1}}`;
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

  .links {
    display: var(--display-type);
    list-style-type: none;
    padding-left: 0;
    flex-direction: column;
    column-count: 2;
  }
  .links a {
    color: var(--goa-color-text);
    line-height: 2rem;
  }
  .hidden {
    display: none;
  }
</style>

<!-- Template -->
<section bind:this={rootEl}>

  {#if name}
    <h3>{name}</h3>
  {/if}

  <div class="hidden">
    <slot bind:this={slot} />
  </div>

  <ul 
    class="links" 
    style={`
      --display-type: ${isMultiCol ? "block" : "flex"};
    `}>
    {#each children as child}
      <li><a href={child.href}>{child.innerHTML}</a></li>
    {/each}
  </ul>

</section>
