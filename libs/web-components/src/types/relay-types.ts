export type FormState = {
  form: Record<string, Record<string, { label: string; value: string }>>;
  history: string[];
  editting: string;
  lastModified?: Date;
};

// ====
// Form
// ====

export const FormResetErrorsMsg = "form::reset:errors";
export const FormSetFieldsetMsg = "form::set:fieldset";
export const FormSetValueMsg = "form::set:value";
export const FormDispatchStateMsg = "form::dispatch:state";

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

export type FormDispatchStateRelayDetail = FormState;

// ========
// Fieldset
// ========

export const FieldsetToggleActiveMsg = "fieldset:toggle-active";
export const FieldsetResetErrorsMsg = "fieldset::reset:errors";
export const FieldsetBindMsg = "fieldset::bind";
export const FieldsetSubmitMsg = "fieldset::submit";
export const FieldsetSetErrorMsg = "fieldset::set:error";
// Sent after fieldset handles _change events from goa input-like components
export const FieldsetChangeMsg = "fieldset::change";
// Sent to form containing the name and el of the bound child, along with the fieldset id
export const FieldsetMountFormItemMsg = "fieldset::bind:form-item";

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

export type FieldsetChangeRelayDetail = {
  id: string;
  name: string;
  value: string;
  label: string;
};

export type FieldsetMountFormRelayDetail = {
  id: string;
  name: string;
  el: HTMLElement;
};

// ========
// FormItem
// ========

export const FormItemMountMsg = "form-item::bind";

export type FormItemMountRelayDetail = {
  id: string;
  label: string;
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

export const FormFieldMountMsg = "form-field::bind";

// ===========
// FormSummary
// ===========

export const FormSummaryBindMsg = "form-summary::bind";
export const FormSummaryEditPageMsg = "form-summary::edit:page";

export type FormSummaryBindRelayDetail = {
  el: HTMLElement;
};

export type FormSummaryEditPageRelayDetail = {
  id: string;
};
