import { useEffect, useRef } from "react";

type Anchor = "bottom" | "left" | "right";

interface WCProps {
  open: boolean;
  anchor: Anchor;
  heading: string;
  maxsize: string;
  testid?: string;
  ref: React.RefObject<HTMLElement>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements {
      "goa-drawer": WCProps & React.HTMLAttributes<HTMLElement>;
    }
  }
}

export interface GoADrawerProps {
  open: boolean;
  anchor: Anchor;
  heading: string;
  maxSize: string;
  testId?: string;
  onClose: () => void;
}

export function GoADrawer({ open, anchor, heading, maxSize, testId, onClose}: GoADrawerProps): JSX.Element {
  const el = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!el?.current || !onClose) {
      return;
    }
    el.current?.addEventListener("_close", onClose)
    return () => {
      el.current?.removeEventListener("_close", onClose)
    }
  }, [el, onClose])

  return (
    <goa-drawer
      ref={el}
      open={open}
      anchor={anchor}
      heading={heading}
      maxsize={maxSize}
      testid={testId}
    />
  );
}


