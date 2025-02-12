export type Query = (q: string) => HTMLElement | null;
export type QueryAll = (q: string) => NodeListOf<HTMLElement>;

type Selectors = {
  $: Query;
  $$: QueryAll;
  $t: Query;
};

export function getSelectors(el: HTMLElement): Selectors {
  const $ = (selector: string): HTMLElement | null => el.querySelector(selector);
  const $$ = (selector: string): NodeListOf<HTMLElement> => el.querySelectorAll(selector);
  const $t = (selector: string): HTMLElement | null => {
    return el.querySelector(`[data-testid=${selector}]`);
  };

  return { $, $$, $t };
}
