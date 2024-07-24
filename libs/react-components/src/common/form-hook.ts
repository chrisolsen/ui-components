import { MutableRefObject, useEffect, useState } from "react";
import { FormValidator } from "./validators";

export type FormState = {
  form: Record<string, string>;
  errors: Record<string, string>;
  history: string[];
  lastModified?: Date;
};

type Form = {
  validate: (validator: FormValidator) => boolean;
  validateRequired: (name: string, msg: string) => boolean;
  push: (next: string) => void;
  change: (name: string, value: string) => void;
  setCustomValue: (name: string, value: string) => void;
  popState: () => void;
  restoreState: () => void;
  resetState: () => void;
};

export function useForm(name: string, formRef?: Element): [Form, FormState] {
  const [state, setState] = useState<FormState>({
    form: {},
    errors: {},
    history: [],
  });

  useEffect(() => {
    initHistory();
  }, []);

  // Initialize the history with the first Fieldset within the Form
  function initHistory() {
    const start = document.querySelector("goa-form > goa-fieldset");
    const startId = start?.getAttribute("id");
    if (startId) {
      setState({ ...state, history: [startId] });
    }
  }

  // const form = new Form(name, state, setState);
  function validate(validator: FormValidator): boolean {
    const errors = validator.validate(state.form);
    setState({
      ...state,
      errors,
    });
    return !Object.keys(errors).length;
  }

  function validateRequired(name: string, msg: string): boolean {
    if (!state.form[name]) {
      setState({
        ...state,
        errors: {
          [name]: msg,
        },
      });
      return false;
    }
    return true;
  }

  /**
    Updates the history
  */
  function push(next: string) {
    const newState = {
      ...state,
      history: [...state.history, next],
      errors: {},
    };
    setState(newState);
    saveState(newState);
  }

  /**
    Update the form state
  */
  function change(name: string, value: string) {
    setState({
      ...state,
      form: { ...state.form, [name]: value },
      lastModified: new Date(),
    });
  }

  function setCustomValue(name: string, value: string) {
    change(name, value);
  }

  function popState() {
    const history = [...state.history];
    history.pop();
    setState({
      ...state,
      errors: {},
      history,
    });
  }

  function saveState(state: FormState) {
    localStorage.setItem(name, JSON.stringify(state));
  }

  function restoreState() {
    const state = localStorage.getItem(name);
    // TODO: prompt the user to restore state?
    if (state) {
      setState(JSON.parse(state));
    }
  }

  function resetState() {
    localStorage.removeItem(name);
    setState({
      form: {},
      errors: {},
      history: ["name"],
      lastModified: undefined,
    });
  }

  const form = {
    validate,
    validateRequired,
    push,
    change,
    setCustomValue,
    popState,
    restoreState,
    resetState,
  };

  return [form, state];
}
