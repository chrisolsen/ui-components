<svelte:options customElement="goa-text" />

<script lang="ts" context="module">
  export type TextProps = {
    as?: TextElement;
    mt?: Spacing;
    mb?: Spacing;
    ml?: Spacing;
    mr?: Spacing;
  }

  export type TextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "span" | "div";

  export type Size 
    = "heading-xl"
    | "heading-l"
    | "heading-m"
    | "heading-s"
    | "heading-xs"
    | "body-l"
    | "body-m"
    | "body-s"
    | "body-xs";
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import { calculateMargin, Spacing } from "../../common/styling";
  import { styles } from "../../common/utils";

  export let as: TextElement = "div";
  export let size: Size

  export let mt: Spacing = null;
  export let mr: Spacing = null;
  export let mb: Spacing = "m";
  export let ml: Spacing = null;

  const sizeMap: Record<string, Size> = {
    h1: "heading-xl",
    h2: "heading-l",
    h3: "heading-m",
    h4: "heading-s",
    h5: "heading-xs",
  }

  onMount(() => {
    console.log("here")
    if (!size) {
      size = sizeMap[as];  
    }
  })
</script>

<svelte:element 
  this={as}
  style={styles(
    `font: var(--goa-typography-${size})`,
    calculateMargin(mt, mr, mb, ml),
  )}
>
  <slot />
</svelte:element>

<style>
  :global(h1, h2, h3, h4, h5) {
    margin: 0;
  }
</style>
