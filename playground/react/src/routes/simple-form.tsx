import { GoABlock, GoAFormItem, GoAInput, GoAFieldset, FormValidator, requiredValidator, regexValidator, GoAModal, GoAButtonGroup, GoAButton, lengthValidator, GoASimpleForm, GoAText, relayErrors, useSimpleForm, GoASimpleFormSummary, GoADropdownItem, GoADropdown, GoARadioGroup, GoARadioItem, GoADatePicker, GoATextarea, GoACheckbox } from "@abgov/react-components";
import { useState } from "react";

// ===========
// Validations
// ===========

const page1Validation = new FormValidator({
  firstname: [requiredValidator("First name is required")],
  lastname: [requiredValidator("Last name is required")],
});

const page2Validation = new FormValidator({
  occupation: [
    requiredValidator("Occupation is required"),
    lengthValidator({ min: 8, minMsg: "Occupation must be 8 characters or more" }),
    regexValidator(/^[a-z A-Z]*$/, "Occupation should be letters and spaces only"),
  ]
});

function validatePage1(el: HTMLElement, state: Record<string, string>): boolean {
  const { errors, valid } = page1Validation.validate(state);
  relayErrors(el, errors);
  console.log("continuing", valid, errors)
  return valid;
}

function validatePage2(el: HTMLElement, state: Record<string, string>): boolean {
  const { errors, valid } = page2Validation.validate(state);
  relayErrors(el, errors);
  return valid;
}

// =========
// Component
// =========

export function SimpleForm() {

  const { onMount, continueTo } = useSimpleForm();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  const [colors, setColors] = useState<string[]>([]);

  function submitForm() {
    setShowConfirmationModal(false);
  }

  function onStateChange(id: string, state: Record<string, Record<string, {label: string, value: string}>>) {
    console.log("state change", id, state)
    const data = state[id];
    switch (id) {
      case "income": {
        const salary = parseInt(data["salary"].value);
        const colors = salary > 1e5 ? ["brown", "red"] : ["green", "blue"];
        setColors(colors)
        console.log("setting color", salary, colors)
        break;
      }
    }
  }

  return (
    <>
      <GoASimpleForm 
        name="react-simple-form" 
        storage="local" 
        onMount={onMount} 
        onStateChange={onStateChange}>

        <GoAFieldset
          id="name"
          first
          heading="What is your name?"
          onContinue={(el, state) => validatePage1(el, state) && continueTo("income")}
        >
          <GoABlock direction="column" gap="l">
            <GoAFormItem id="firstname" label="First name">
              <GoAInput id="firstname" name="firstname" />
            </GoAFormItem>
            <GoAFormItem id="lastname" label="Last name">
              <GoAInput id="lastname" name="lastname" />
            </GoAFormItem>
          </GoABlock>
        </GoAFieldset>

        <GoAFieldset
          id="income"
          heading="What is your yearly salary?"
          onContinue={() => continueTo("color")}
        >
          <GoAFormItem id="salary" label="Salary">
            <GoAInput id="salary" name="salary" />
          </GoAFormItem>
        </GoAFieldset>

        <GoAFieldset
          id="color"
          onContinue={(_, state) => continueTo(state["favcolor"] !== "red" ? "music" : "birthdate")}
        >
          <GoAFormItem id="favcolor" label="Favourite color" mb="l">
            {colors}
            {JSON.stringify(colors)}
            <GoADropdown name="favcolor">
              {colors.map(color =>              
                <GoADropdownItem key={color} value={color} label={color} />
              )}
            </GoADropdown>
          </GoAFormItem>
        </GoAFieldset>

        <GoAFieldset
          id="music"
          onContinue={() => continueTo("birthdate")}
        >
          <GoAFormItem id="favmusic" label="Favourite music" mb="l">
            <GoARadioGroup name="favmusic">
              <GoARadioItem value="rock" />
              <GoARadioItem value="punk" />
              <GoARadioItem value="classical" />
            </GoARadioGroup>
          </GoAFormItem>
        </GoAFieldset>

        <GoAFieldset id="birthdate" onContinue={() => continueTo("questions")}>
          <GoAFormItem id="when" label="Birthdate" labelSize="large">
            <GoADatePicker name="when" />
          </GoAFormItem>
        </GoAFieldset>

        <GoAFieldset
          id="questions"
          heading="Additional questions"
          onContinue={() => continueTo("accept")}
        >
          <GoAFormItem id="questions" label="Additional questions you have" mb="l">
            <GoATextarea name="questions" />
          </GoAFormItem>
        </GoAFieldset>

        <GoAFieldset id="accept" heading="Accept terms" onContinue={() => continueTo("summary")}>
          <GoAFormItem id="accept" label="Accept the conditions you didn't read?" mb="l">
            <GoACheckbox name="accept" value="yes">I do</GoACheckbox>
          </GoAFormItem>
        </GoAFieldset>

        <GoAFieldset
          id="summary"
          last
          heading="Summary"
          buttonText="Complete application"
          onContinue={() => setShowConfirmationModal(true)}
        >
          <GoASimpleFormSummary />
        </GoAFieldset>

      </GoASimpleForm>

      <GoAModal open={showConfirmationModal} heading="Submit application?">
        <GoAText>
          Are you sure?
        </GoAText>
        <GoAButtonGroup alignment="end">
          <GoAButton type="tertiary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </GoAButton>
          <GoAButton type="primary" onClick={submitForm}>
            Submit
          </GoAButton>
        </GoAButtonGroup>
      </GoAModal>
    </>
  )
}

export default SimpleForm;
