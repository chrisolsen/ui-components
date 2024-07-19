import { FormValidator } from "./validators";

export type FormState = {
  form: Record<string, any>;
  errors: Record<string, string>;
  history: string[];
  lastModified?: Date;
};

export class Form {
  constructor(
    private name: string,
    private state: FormState,
    private setState: (state: FormState) => void,
  ) {}

  validate(validator: FormValidator): boolean {
    const errors = validator.validate(this.state.form);
    this.setState({
      ...this.state,
      errors,
    });
    return !Object.keys(errors).length;
  }

  validateRequired(name: string, msg: string): boolean {
    if (!this.state.form[name]) {
      this.setState({
        ...this.state,
        errors: {
          [name]: msg,
        },
      });
      return false;
    }
    return true;
  }

  onContinue(next: string) {
    const newState = {
      ...this.state,
      history: [...this.state.history, next],
      errors: {},
    };
    this.setState(newState);
    this.saveState(newState);
  }

  updateState(name: string, value: string) {
    this.setState({
      ...this.state,
      form: { ...this.state.form, [name]: value },
      lastModified: new Date(),
    });
  }

  onPopState() {
    const history = [...this.state.history];
    history.pop();
    this.setState({
      ...this.state,
      errors: {},
      history,
    });
  }

  saveState(state: FormState) {
    localStorage.setItem(this.name, JSON.stringify(state));
  }

  restoreState() {
    const state = localStorage.getItem(this.name);
    // TODO: prompt the user to restore state?
    if (state) {
      this.setState(JSON.parse(state));
    }
  }

  resetState() {
    localStorage.removeItem(this.name);
    this.setState({
      form: {},
      errors: {},
      history: ["name"],
      lastModified: undefined,
    });
  }
}
