import { MutableRefObject, useEffect } from "react";

export function useCustomEvent(event: string, fn: (e: Event) => void, el: MutableRefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!el || !el.current) return;
    const _el = el.current;
    _el.addEventListener(event, fn);
    return () => {
      _el.removeEventListener(event, fn);
    }
  }, [el, event, fn])
}

export function useCustomEvents(bindings: { [event: string]: (e: Event) => void }, el: MutableRefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!el || !el.current) return;
    const _el = el.current;

    for (const [event, fn] of Object.entries(bindings)) {
      _el.addEventListener(event, fn);
    }

    return () => {
      for (const [event, fn] of Object.entries(bindings)) {
        _el.removeEventListener(event, fn);
      }
    }
  }, [el, bindings])
}
