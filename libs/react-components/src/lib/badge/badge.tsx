import React, { FC } from "react";
import { Margins } from "../../common/styling";

export type GoABadgeType =
  | "information"
  | "success"
  | "important"
  | "emergency"
  | "dark"
  | "midtone"
  | "light";

interface WCProps extends Margins {
  type: GoABadgeType;
  icon?: boolean;
  content?: string;
  arialabel?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements {
      "goa-badge": WCProps & React.HTMLAttributes<HTMLElement>;
    }
  }
}

export interface GoABadgeProps extends Margins {
  type: GoABadgeType;
  icon?: boolean;
  content?: string;
  testId?: string;
  ariaLabel?: string;
}

export const GoABadge: FC<GoABadgeProps> = ({
  type,
  content,
  icon,
  testId,
  mt,
  mr,
  mb,
  ml,
  ariaLabel,
}: GoABadgeProps) => {
  return (
    <goa-badge
      type={type}
      content={content}
      icon={icon}
      data-testid={testId}
      arialabel={ariaLabel}
      mt={mt}
      mr={mr}
      mb={mb}
      ml={ml}
    />
  );
};

/**
 * @deprecated
 */
export const GoAInfoBadge: FC<GoABadgeProps> = ({
  content,
  testId,
  icon,
  mt,
  mr,
  mb,
  ml,
  ariaLabel,
}: GoABadgeProps) => {
  return (
    <GoABadge
      type="information"
      icon={icon}
      content={content}
      testId={testId}
      ariaLabel={ariaLabel}
      mt={mt}
      mr={mr}
      mb={mb}
      ml={ml}
    />
  );
};

/**
 * @deprecated
 */
export const GoASuccessBadge: FC<GoABadgeProps> = ({
  content,
  testId,
  icon,
  mt,
  mr,
  mb,
  ml,
  ariaLabel,
}: GoABadgeProps) => {
  return (
    <GoABadge
      type="success"
      icon={icon}
      content={content}
      ariaLabel={ariaLabel}
      testId={testId}
      mt={mt}
      mr={mr}
      mb={mb}
      ml={ml}
    />
  );
};

/**
 * @deprecated
 */
export const GoAImportantBadge: FC<GoABadgeProps> = ({
  content,
  testId,
  icon,
  mt,
  mr,
  mb,
  ml,
  ariaLabel,
}: GoABadgeProps) => {
  return (
    <GoABadge
      type="important"
      icon={icon}
      content={content}
      testId={testId}
      ariaLabel={ariaLabel}
      mt={mt}
      mr={mr}
      mb={mb}
      ml={ml}
    />
  );
};

/**
 * @deprecated
 */
export const GoAEmergencyBadge: FC<GoABadgeProps> = ({
  content,
  testId,
  icon,
  mt,
  mr,
  mb,
  ml,
  ariaLabel,
}: GoABadgeProps) => {
  return (
    <GoABadge
      type="emergency"
      icon={icon}
      content={content}
      testId={testId}
      ariaLabel={ariaLabel}
      mt={mt}
      mr={mr}
      mb={mb}
      ml={ml}
    />
  );
};
