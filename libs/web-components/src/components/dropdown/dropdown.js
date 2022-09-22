import Dropdown from "./Dropdown.svelte";

class GoADropdown extends Dropdown {
  static formAssociated = true;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._input = this.shadowRoot.querySelector("goa-input");
  }

  get name() { return this.getAttribute('name') };
  set name(v) { this.setAttribute('name', v) };

  connectedCallback() {
    super.connectedCallback();
    this._name = this.name
    this._internals.setFormValue(this.value);

    this._input.addEventListener("_change", (e) => {
      this._internals.setFormValue(e.detail.value);
      this.value = e.detail.value;
    });
  }

  // attributeChangedCallback(attr, oldValue, newValue) {
  //   super.attributeChangedCallback(attr, oldValue, newValue)
  //   this._input[attr] = newValue;
  // }
}

customElements.define("goa-dropdown", GoADropdown);
