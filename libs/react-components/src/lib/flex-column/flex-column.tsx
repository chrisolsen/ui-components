import React, { FC } from "react";

interface WCProps {
  gap?: 'small' | 'medium' | 'large';
}


declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'goa-flex-col': WCProps & React.HTMLAttributes<HTMLElement>
    }
  }
}


export interface Props {
  gap?: 'small' | 'medium' | 'large';
};


export const GoAFlexCol: FC<Props> = ({ gap, children }) => {
  return (
    <goa-flex-col gap={gap}>{children}</goa-flex-col>
  );
}

export default GoAFlexCol;
