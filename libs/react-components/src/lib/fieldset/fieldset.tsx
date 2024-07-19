import { ReactNode, useEffect, useRef } from "react";
import { Margins } from "../../common/styling";

// TODO: move these types into the common lib for the upcoming major release

interface WCProps extends Margins {
  ref?: React.MutableRefObject<HTMLElement | null>;
  id: string;
  heading: string;
  buttontext?: string;
  last?: boolean | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements {
      "goa-fieldset": WCProps & React.HTMLAttributes<HTMLElement>;
    }
  }
}

interface GoAFieldsetProps extends Margins {
  id: string;
  heading: string;
  buttonText?: string;
  errors?: Record<string, string>;
  onContinue?: () => void
  children: ReactNode;
}

export function GoAFieldset({
  heading, 
  buttonText, 
  id, 
  onContinue, 
  children, 
  mt, 
  mr, 
  mb, 
  ml, 
  errors = {} 
}: GoAFieldsetProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (onContinue) {
      ref.current?.addEventListener("_continue", onContinue)
    }
    return () => {
      if (onContinue) {
        ref.current?.removeEventListener("_continue", onContinue)
      }
    }
  }, [ref.current, onContinue])

  return (
    <goa-fieldset
      ref={ref}
      id={id}
      heading={heading}
      buttontext={buttonText}
      mt={mt}
      mr={mr}
      mb={mb}
      ml={ml}
      last={!!onContinue ? null : true}
    >
      <div slot="errors"></div>
      {Object.keys(errors).length > 0 &&
        <>
          <section slot="errors">
            <goa-callout mb="2xl" type="emergency" heading="Please correct the following errors on this page:">
              <ul>
                {Object.keys(errors).map(key => <li key={key}>{errors[key]}</li>)}
              </ul>
            </goa-callout>
          </section>
        </>
      }

      {children}
    </goa-fieldset>
  );
}

export default GoAFieldset;
