import { ReactNode } from "react";
import { Margins, Spacing } from "../../common/styling";

// TODO: move these types into the common lib for the upcoming major release

interface WCProps extends Margins {
  as?: TextElement;
  size?: Size;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements {
      "goa-text": WCProps & React.HTMLAttributes<HTMLElement>;
    }
  }
}

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

  
interface GoATextProps extends Margins {
  as?: TextElement;
  size?: Size;
  children: ReactNode;
}

export function GoAText(props: GoATextProps): JSX.Element {
  return (
    <goa-text as={props.as} size={props.size} mt={props.mt} mb={props.mb} ml={props.ml} mr={props.mr}>
      {props.children}
    </goa-text>
  );
}
