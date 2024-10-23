import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import {
  AppState,
  continueTo,
  FieldsetState,
  requiredValidator,
  validate,
} from "@abgov/angular-components";
import { Router } from "@angular/router";

type Page = "previous-registrations" | "summary";

@Component({
  standalone: true,
  selector: "abgov-prior-registrations",
  templateUrl: "./PriorRegistrations.html",
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PriorRegistrations {
  constructor(private router: Router) {}

  // =====
  // Props
  // =====

  _state: AppState = { form: {}, history: [], editting: "" };
  _formData?: Record<string, string> = undefined;
  _formRef?: HTMLElement = undefined;

  // =========
  // Functions
  // =========

  saveFormRef(e: Event) {
    this._formRef = (e as CustomEvent).detail.el;
  }

  updateState(e: Event) {
    const state = (e as CustomEvent).detail;
    this._state = { ...this._state, form: state.form };
  }

  onComplete(_e: Event) {
    this.router.navigate(["/fsos"]);
  }

  // ======
  // Events
  // ======

  onPageChange(e: Event, from?: Page) {
    if (!this._formRef) {
      console.error("Missing _formRef");
      return;
    }

    const { el, state } = (e as CustomEvent).detail;

    let dest: Page | undefined = undefined;
    switch (from) {
      case "previous-registrations":
        dest = this.validatePreviousRegistration(el, state);
        break;
    }

    // update api with state

    if (dest) {
      continueTo(this._formRef, dest);
    }
  }

  // ===========
  // Validations
  // ===========

  validatePreviousRegistration(el: HTMLElement, state: FieldsetState): Page | undefined {
    const [ok] = validate("previous-registration", el, state, [requiredValidator()]);
    if (!ok) {
      return;
    }

    return "summary";
  }
}
