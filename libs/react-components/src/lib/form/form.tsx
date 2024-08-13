import { ReactNode, useEffect, useRef } from "react";
import { Margins } from "../../common/styling";
import { relay } from "../../common/validators";

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
  onMount: (fn: (next: string) => void) => void;
}

export function GoASimpleForm(props: GoAFormProps) {
  const el = useRef<HTMLElement>();

  useEffect(() => {
    const _continueTo = (el: HTMLElement | undefined, next: string) => {
      console.log("_continueTo being called")
      if (!el) {
        console.error("external::continue el is undefined")
      }
      console.log("relaying to", el)
      relay<{next: string}>(el, "external::continue", {
        next
      })
    }

    if (el.current) {
      const form = el.current.shadowRoot?.querySelector("form");
      if (!form) return;

      const onContinue = (next: string) => {
        _continueTo(form, next)  
      }
      props.onMount(onContinue);
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
