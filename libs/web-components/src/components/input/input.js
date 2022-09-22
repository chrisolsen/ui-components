import Input from "./Input.svelte";

class GoAInput extends Input {
  static formAssociated = true;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._input = this.shadowRoot.querySelector("input")
  }

  get name() { return this.getAttribute('name')};
  set name(v) { this.setAttribute('name', v)};

  get value() { return this.getAttribute('value')};
  set value(v) { this.setAttribute('value', v)};

  connectedCallback() {
    this._internals.setFormValue(this.value);
    this._input.addEventListener("keyup", (e) => {
      console.log("keyup", e.target.value)
      this._internals.setFormValue(e.target.value);
      this.value = e.target.value;
    })
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    console.log("attributeChangedCallback", name, newValue)
    this._input[name] = newValue;
    // if (name === "value") {
    //   this._internals.setFormValue(newValue);
    // }
  }
}

customElements.define("goa-input", GoAInput);
