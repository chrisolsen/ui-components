import { ReactNode, useEffect, useRef } from "react";
import { Margins } from "../../common/styling";

// TODO: move these types into the common lib for the upcoming major release

export type FormState = {
  form: Record<string, Record<string, { label: string; value: string }>>;
  history: string[];
  editting: string;
  lastModified?: Date;
};

interface WCProps extends Margins {
  ref?: React.MutableRefObject<HTMLElement | undefined>; 
  name: string;
  storage: "none" | "local" | "session";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements {
      "goa-simple-form": WCProps & React.HTMLAttributes<HTMLElement>;
    }
  }
}

interface GoAFormProps extends Margins {
  children: ReactNode;
  name: string;
  storage: "none" | "local" | "session";
  onMount: (el: HTMLElement) => void;
}

// FIXME: the issue is that we need to relay the message to the Form element and the element 
// available in the `e` is the fieldset
export function continueTo(el: HTMLElement | undefined, next: string) {
  if (!el) {
    console.error("external::continue el is undefined")
  }
  console.log("form el", el)
  relay<{next: string}>(el, "external::continue", {
    next
  })
}

export function relay<T>(
  el: HTMLElement | Element | null | undefined,
  eventName: string,
  data: T,
  opts?: { bubbles?: boolean; },
) {  
  if (!el) {
    console.error("dispatch element is null");
    return;
  }
  el.dispatchEvent(
    new CustomEvent<{action: string, data: T}>("msg", {
      composed: true,
      bubbles: opts?.bubbles,
      detail: {
        action: eventName,
        data
      },
    }),
  );
}

export function GoASimpleForm(props: GoAFormProps) {
  const el = useRef<HTMLElement>();

  useEffect(() => {
    if (el.current) {
      const form = el.current.shadowRoot?.querySelector("form");
      form && props.onMount(form);
    }
  }, [el.current])
  
  return (
    <goa-simple-form ref={el}
      name={props.name}
      storage={props.storage}
      mt={props.mt}
      mr={props.mr}
      mb={props.mb}
      ml={props.ml}
    >
      {props.children}
    </goa-simple-form>
  );
}
