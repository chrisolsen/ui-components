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

  function submitForm() {
    setShowConfirmationModal(false);
  }

  return (
    <>
      <GoASimpleForm name="react-simple-form" storage="local" onMount={onMount}>

        <GoAFieldset
          id="name"
          first
          heading="What is your name?"
          onContinue={(el, state) => validatePage1(el, state) && continueTo("occupation")}
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
          id="occupation"
          heading="What do you do for work?"
          onContinue={(el, state) => validatePage2(el, state) && continueTo("color")}
        >
          <GoAFormItem id="occupation" label="Occupation">
            <GoAInput id="occupation" name="occupation" />
          </GoAFormItem>
        </GoAFieldset>

        <GoAFieldset
          id="color"
          onContinue={(_, state) => continueTo(state["favcolor"] !== "red" ? "music" : "birthdate")}
        >
          <GoAFormItem id="favcolor" label="Favourite color" mb="l">
            <GoADropdown name="favcolor">
              <GoADropdownItem value="red" label="Red" />
              <GoADropdownItem value="green" label="Green" />
              <GoADropdownItem value="blue" label="Blue" />
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
