import { ReactNode, useEffect, useRef } from "react";
import { Margins } from "../../common/styling";

// TODO: move these types into the common lib for the upcoming major release

interface WCProps extends Margins {
  ref?: React.MutableRefObject<HTMLElement | null>;
  page: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements {
      "goa-form": WCProps & React.HTMLAttributes<HTMLElement>;
    }
  }
}

interface GoAFormProps extends Margins {
  page: string;
  onFormPopState: () => void;
  children: ReactNode;
}

export function GoAForm(props: GoAFormProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.addEventListener("_formPopState", props.onFormPopState);
    return () => {
      ref.current?.removeEventListener("_formPopState", props.onFormPopState);
    }
  }, [props.onFormPopState])

  return (
    <goa-form ref={ref} 
      page={props.page}
      mt={props.mt}
      mr={props.mr}
      mb={props.mb}
      ml={props.ml}
    >
      {props.children}
    </goa-form>
  );
}
