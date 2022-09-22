import React, { FC, ReactNode, useEffect, useRef } from 'react';
import './button.css';
import { GoAIconType } from '../icons';
import { useCustomEvent, useCustomEvents } from '../../common/eventBinding';

export type ButtonType = 'primary' | 'submit' | 'secondary' | 'tertiary' | 'start';
export type ButtonSize = 'compact' | 'normal';
export type ButtonVariant = 'normal' | 'destructive'

interface WCProps {
  type?: ButtonType;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean
  leadingicon?: string;
  trailingicon?: string;
  ref: React.RefObject<HTMLElement>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements {
      'goa-button': WCProps & React.HTMLAttributes<HTMLElement>
    }
  }
}

type ButtonProps = {
  type?: ButtonType;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  leadingIcon?: GoAIconType;
  trailingIcon?: GoAIconType;
  onClick: (e: Event) => void;
  children?: ReactNode;
};

export const GoAButton: FC<ButtonProps> = ({
  disabled = false,
  type = 'primary',
  size,
  variant,
  leadingIcon,
  trailingIcon,
  onClick,
  children,
}) => {
  const el = useRef<HTMLElement>(null);

  useCustomEvent("_click", onClick, el)

  return (
    <goa-button
      ref={el}
      type={type}
      size={size}
      variant={variant}
      disabled={disabled}
      leadingicon={leadingIcon}
      trailingicon={trailingIcon}
    >
      {children}
    </goa-button>
  );
};

export default GoAButton;
