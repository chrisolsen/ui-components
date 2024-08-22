<script lang="ts">

  let _formEl: HTMLElement;
  let _children: Record<string, string>[] = [];

  function collectChildren(e: Event) {
    const detail = (e as CustomEvent<Record<string, string>>).detail;
    _children = [..._children, detail];
    console.log("collectChildren", detail)
    e.stopPropagation();
  }

  type Validator = (
    name: string,
    el: HTMLElement,
    state: Record<string, string>,
  ) => boolean;

  function validateRequired(msg: string): Validator {
    return (name: string, el: HTMLElement, state: Record<string, string>): boolean => {
      if (!state[name]) {
        dispatchError(el, name, msg);
        return false;
      }
      return true;
    };
  }

  function validateLength(msg: string): Validator {
    return (name: string, el: HTMLElement, state: Record<string, string>): boolean => {
      if (state[name].length <= 1) {
        dispatchError(el, name, msg);
        return false;
      }
      return true;
    };
  }

  function dispatchError(el: HTMLElement, name: string, msg: string) {
    el.dispatchEvent(
      new CustomEvent("msg", {
        composed: true,
        detail: {
          action: "external::set:error",
          data: {
            name,
            msg,
          }
        },
      }),
    );
  }
  
  export function dispatch<T>(
    el: HTMLElement | Element | null | undefined,
    eventName: string,
    detail: T,
    opts: { bubbles?: boolean; },
  ) {
    if (!el) {
      console.error("dispatch element is null");
      return;
    }
    el.dispatchEvent(
      new CustomEvent<T>(eventName, {
        composed: true,
        bubbles: opts.bubbles,
        detail: detail,
      }),
    );
  }
  
  export function relay<T>(
    el: HTMLElement | Element | null | undefined,
    eventName: string,
    data: T,
    opts?: { bubbles?: boolean; },
  ) {  
    if (!el) {
      console.error("dispatch element is null");
      return;
    }
    // console.log(`RELAY(${eventName}):`, data, el);
    el.dispatchEvent(
      new CustomEvent<{action: string, data: T}>("msg", {
        composed: true,
        bubbles: opts?.bubbles,
        detail: {
          action: eventName,
          data
        },
      }),
    );
  }

  // TODO: Logic simular to this needs to be done on the React side as well i.e. an initial onMount
  // event that passes a ref to the form, 
  function onContinue(name: string) {
    const form = _formEl.shadowRoot?.querySelector("form");
    relay<{next: string}>(form, "external::continue", {
      next: name
    })
  }

  function validate(
    field: string,
    fieldsetEl: HTMLElement,
    fieldsetState: Record<string, string>,
    validators: Validator[]
  ): boolean {
    for (const _validate of validators) {
      const valid = _validate(field, fieldsetEl, fieldsetState)
      if (!valid) return false;
    }
    return true;
  }

  function nameValidation(e: Event) {
    const { el: fieldset, state } = (e as CustomEvent).detail;
    const firstNameValid = validate("firstname", fieldset, state, [
      validateRequired("First name is required"),
      validateLength("First name must be longer than 1 character")
    ]);
    const lastNameValid = validate("lastname", fieldset, state, [
      validateRequired("Last name is required")
    ]);

    if (firstNameValid && lastNameValid) {
      onContinue("occupation");
    }
  }

  function occupationValidation(e: Event) {
    const { el, state } = (e as CustomEvent).detail;
    const occupationValid = validate("occupation", el, state, [
      validateRequired("Occupation is required")
    ]);

    if (state.occupation !== "dev") {
      onContinue("ineligible");
      return;
    }
    if (occupationValid) {
      onContinue("favcolor");
    }
  }

  function submitForm(e: Event) {
    const { form } = (e as CustomEvent).detail;
    console.log("submitting", form)
  }

</script>

<goa-simple-form name="public-form-1" bind:this={_formEl} on:_submit={submitForm} storage="local">

  <!-- First / last name -->

  <goa-fieldset id="name" first heading="What is your name?" on:_continue={() => onContinue("children")}>
    <goa-block direction="column" gap="l">
      <goa-form-item id="firstname" label="First name">
        <goa-input name="firstname" />
      </goa-form-item>
      <goa-form-item id="lastname" label="Last name">
        <goa-input name="lastname" />
      </goa-form-item>
    </goa-block>
  </goa-fieldset>

  <!-- Children -->

  <goa-form-loop id="children" breakmsg="_break" on:_change={collectChildren}>
  
    <goa-fieldset
      id="children"
      buttonText="Add child"
      secondaryButtonText="Done"
      secondaryButtonEvent="_break"
      on:_secondaryClick={() => onContinue("music")}
      on:_continue={() => onContinue("child-form")}
    >
      <goa-table>
        {#each _children as child}
          <tr>
            <td>{child["child-firstname"]}</td>
            <td>{child["child-lastname"]}</td>
          </tr>
        {/each}
        <span/>
      </goa-table>
    </goa-fieldset>

    <goa-fieldset
      id="child-form"
      on:_continue={() => onContinue("children")}
    >
      <goa-block direction="column" gap="l">
        <goa-form-item id="child-firstname" label="First name">
          <goa-input name="child-firstname" />
        </goa-form-item>
        <goa-form-item id="child-lastname" label="Last name">
          <goa-input name="child-lastname" />
        </goa-form-item>
        <!--
        <goa-form-item id="child-age" label="Age">
          <goa-input name="age" type="number" />
        </goa-form-item>
        -->
      </goa-block>
    </goa-fieldset>

  </goa-form-loop>

  <!-- Birthdate -->
  
  <goa-fieldset
    id="music"
    on:_continue={() => onContinue("birthdate")}
  >
    <goa-form-item id="favmusic" label="Favourite music" mb="l">
      <goa-radio-group name="favmusic">
        <goa-radio-item value="rock" />
        <goa-radio-item value="punk" />
        <goa-radio-item value="classical" />
      </goa-radio-group>
    </goa-form-item>
  </goa-fieldset>

  <!-- Questions -->

  <goa-fieldset id="birthdate" on:_continue={() => onContinue("questions")}>
    <goa-form-item id="when" label="Birthdate">
      <goa-date-picker name="when" />
    <goa-form-item>
  </goa-fieldset>

  <!-- Questions -->
  
  <goa-fieldset
    id="questions"
    on:_continue={() => onContinue("accept")}
  >
    <goa-form-item id="questions" label="Additional questions you have" labelsize="large" mb="l">
      <goa-textarea name="questions" />
    </goa-form-item>
  </goa-fieldset>

  <!-- Accept -->

  <goa-fieldset id="accept" heading="Accept the conditions you didn't read?"  on:_continue={() => onContinue("summary")}>
    <goa-form-item id="accept" label mb="l">
      <goa-checkbox name="accept" value="yes">I do</goa-checkbox>
    </goa-form-item>
  </goa-fieldset>

  <!-- Summary -->

  <goa-fieldset id="summary" heading="Review your answers" last on:_continue={submitForm}>
    <goa-simple-form-summary />  
  </goa-fieldset>
    
  <!-- Ineligible -->

  <goa-fieldset id="ineligible" heading="You are not eligible" last>
    :(
  </goa-fieldset>



</goa-simple-form>
