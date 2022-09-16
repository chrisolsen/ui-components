import Input from "./Input.svelte";

class GoAInput extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<input />`;
    this._internals = this.attachInternals();

    this._input = this.shadowRoot.querySelector("input")
    this._input.addEventListener("input", (e) => {
      console.log("updating value", e.target.value)
      this._internals.setFormValue(e.target.value);
    })
  }
}

class GoAInput2 extends Input {
  static formAssociated = true;
  static observedAttributes = ['name', 'value'];

  constructor() {
    super();
    this._internals = this.attachInternals();

    this._input = this.shadowRoot.querySelector("input")
    this._internals.setFormValue(this.value);
    this._input.addEventListener("change", (e) => {
      this._internals.setFormValue(e.target.value);
    })
  }

  get form() { return this._internals.form; }

  get name() { return this.getAttribute('name')};
  set name(v) { return this.setAttribute('name', v)};

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("callback", name, newValue)
    this._input[name] = newValue;
  }
  get value() { return this._input.value; }
  set value(v) { this._input.value = v; }
}

// customElements.define("goa-input", GoAInput);
customElements.define("goa-input", GoAInput2);
