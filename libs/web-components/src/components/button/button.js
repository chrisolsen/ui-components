import Button from "./Button.svelte";

class GoAButton extends Button {
  static formAssociated = true;
  constructor(){
    super();
    this.internals = this.attachInternals();
  }
}
customElements.define("goa-button", GoAButton);
