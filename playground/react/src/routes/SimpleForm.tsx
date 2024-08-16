import { GoABlock, GoAFormItem, GoAInput, GoAFieldset, GoAModal, GoAButtonGroup, GoAButton, GoASimpleForm, GoAText, useSimpleForm, GoASimpleFormSummary, GoADropdownItem, GoADropdown, GoARadioGroup, GoARadioItem, GoADatePicker, GoATextarea, GoATextArea, GoACheckbox } from "@abgov/react-components";
import { useState } from "react";
import { validatePage1, validatePage2 } from "./simple-form";

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
                    onContinue={(el, state) => validatePage2(el, state) && continueTo("summary")}
                >
                    <GoAFormItem id="occupation" label="Occupation">
                        <GoAInput id="occupation" name="occupation" />
                    </GoAFormItem>
                </GoAFieldset>


                <GoAFieldset
                    id="summary"
                    heading="Summary"
                    buttonText="Complete application"
                    onContinue={() => setShowConfirmationModal(true)}
                >
                    <GoASimpleFormSummary />
                </GoAFieldset>


                <GoAFieldset
                    id="color"
                    onContinue={() => continueTo("music")}
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
                    <GoAFormItem id="when" label="Birthdate">
                        <GoADatePicker name="when" />

                        <GoAFieldset
                            id="questions"
                            heading="Additional questions"
                            onContinue={() => continueTo("accept")}
                        >
                            <GoAFormItem id="questions" label="Additional questions you have" mb="l">
                                <GoATextArea name="questions" />
                            </GoAFormItem>
                        </GoAFieldset>

                        <GoAFieldset id="accept" onContinue={() => continueTo("summary")}>
                            <GoAFormItem id="accept" label="Accept the conditions you didn't read?" mb="l">
                                <GoACheckbox name="accept" value="yes">I do</GoACheckbox>
                            </GoAFormItem>
                        </GoAFieldset>
                      </GoAFormItem>
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
            </></>);
}
