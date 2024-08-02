// ====
// Form
// ====

export const FormResetErrorsMsg = "form::reset:errors";
export const FormSetFieldsetMsg = "form::set:fieldset";
export const FormSetValueMsg = "form::set:value";

export type FormFieldMountRelayDetail = {
  name: string;
  el: HTMLElement;
};

export type FormSetFieldsetRelayDetail = {
  name: string;
  value: Record<string, string>;
};

export type FormSetValueRelayDetail = {
  name: string;
  value: string;
};

// ========
// Fieldset
// ========
export const FieldsetToggleActiveMsg = "fieldset:toggle-active";
export const FieldsetResetErrorsMsg = "fieldset::reset:errors";
export const FieldsetBindMsg = "fieldset::bind";
export const FieldsetSubmitMsg = "fieldset::submit";
export const FieldsetSetErrorMsg = "fieldset::set:error";

export type FieldsetBindRelayDetail = {
  id: string;
  heading: string;
  el: HTMLElement;
};

export type FieldsetErrorRelayDetail = {
  error: string;
};

export type FieldsetToggleActiveRelayDetail = {
  first: boolean;
  active: boolean;
};

// ========
// FormItem
// ========

export const FormItemMountMsg = "form-item::mount";

export type FormItemMountRelayDetail = {
  id: string;
  el: HTMLElement;
};

// ========
// External
// ========

export const ExternalSetErrorMsg = "external::set:error";
export const ExternalContinueMsg = "external::continue";

export type ExternalContinueRelayDetail = {
  next: string;
};

export type ExternalErrorRelayDetail = {
  name: string;
  msg: string;
};

// =========
// FormField
// =========

export const FormFieldMountMsg = "form-field::mount";
