import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  PublicFormController,
  requiredValidator,
} from "@abgov/angular-components";
import { NgFor, NgIf } from "@angular/common";

type Page =
  // | "what-is-your-role"
  // | "contact"
  // | "optional"
  | "children-subform"
  // | "address"
  // | "do-you-receive-support"
  // | "recalculated"
  | "summary";

type ChildPage = "name";

@Component({
  standalone: true,
  selector: "abgov-fsos",
  templateUrl: "./SupportOrderDetails.html",
  imports: [NgFor, NgIf],
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SupportOrderDetailsComponent implements OnInit {
  _childFormController: PublicFormController<ChildPage>;
  _mainFormController: PublicFormController<Page>;

  continueButtonVisibility: "visible" | "hidden" = "hidden";
  showDeleteModal = false;

  _total: number = 0;

  children(): Record<string, string>[] {
    return this._childFormController.getStateList();
  }

  constructor(private router: Router) {
    this._mainFormController = new PublicFormController("details");
    this._childFormController = new PublicFormController("list");
  }

  ngOnInit(): void {
    console.log("init");
    // const raw = `{"uuid":"5392ed7b-9fdb-42b9-a230-62b28a4a85d0","form":{"what-is-your-role":{"heading":"","data":{"type":"details","fieldsets":{"role":{"name":"role","value":"Recipient","label":"Role","order":1}}},"skipSummary":false},"contact":{"skipSummary":false,"heading":""},"optional":{"skipSummary":false,"heading":"Alternate names"},"children-subform":{"data":{"type":"list","items":[{"uuid":"af271613-c7b5-4e94-9c65-abbd62fb0917","form":{"name":{"heading":"","data":{"type":"details","fieldsets":{"firstName":{"name":"firstName","value":"Chris","label":"First name","order":1},"lastName":{"name":"lastName","value":"Olsen","label":"Last name","order":2}}}},"alternate-name":{"skipSummary":false,"heading":""},"dob":{"skipSummary":false,"heading":""},"summary":{"skipSummary":true,"heading":""}},"history":["name","summary"],"editting":"","lastModified":"2025-01-09T18:58:58.822Z","status":"not-started"},{"uuid":"d18eaf4c-f252-4b7c-aed2-009c233331aa","form":{"name":{"heading":"","data":{"type":"details","fieldsets":{"firstName":{"name":"firstName","value":"asd","label":"First name","order":1},"lastName":{"name":"lastName","value":"asd","label":"Last name","order":2}}}},"alternate-name":{"skipSummary":false,"heading":""},"dob":{"skipSummary":false,"heading":""},"summary":{"skipSummary":true,"heading":""}},"history":["name","summary"],"editting":"","lastModified":"2025-01-09T20:33:14.465Z","status":"not-started"}]}},"address":{"heading":"Current address","data":{"type":"details","fieldsets":{"address":{"name":"address","value":"123-45st","label":"Address","order":2},"city":{"name":"city","value":"Edmonton","label":"","order":3},"postal-code":{"name":"postal-code","value":"T5W 1O3","label":"","order":4}}},"skipSummary":false},"do-you-receive-support":{"heading":"","data":{"type":"details","fieldsets":{"support":{"name":"support","value":"Yes","label":"Support?","order":1}}},"skipSummary":false},"recalculated":{"heading":"","data":{"type":"details","fieldsets":{"recalculated":{"name":"recalculated","value":"Yes","label":"Recalculated?","order":1}}},"skipSummary":false},"summary":{"skipSummary":true,"heading":"Review your answers"},"":{"skipSummary":false,"heading":""}},"history":["what-is-your-role","optional","children-subform","address","do-you-receive-support","recalculated","summary"],"editting":"","status":"not-started"}`;
    // const data = JSON.parse(raw) as AppState<Page>;
    // this._mainFormController.initState(data);
    this.continueButtonVisibility = this.children().length > 0 ? "visible" : "hidden";
  }

  updateState(e: Event) {
    this._mainFormController.updateObjectState(e);

    this.continueButtonVisibility = this.children().length > 0 ? "visible" : "hidden";

    console.log("updateState", this._mainFormController.state);

    // DEV ONLY: saving the state to local storage
    localStorage.setItem(
      "support-order-details",
      JSON.stringify(this._mainFormController.state),
    );

    // if (this._mainFormComponent.state?.currentFieldset?.dispatchType === "continue") {
    //   return;
    // }

    // switch (this._mainFormComponent.state?.currentFieldset?.id) {
    //   case "what-is-your-role":
    //     this._total =
    //       (parseFloat(
    //         this._mainFormComponent.getStateValue("what-is-your-role", "amount1"),
    //       ) || 0) +
    //       (parseFloat(
    //         this._mainFormComponent.getStateValue("what-is-your-role", "amount2"),
    //       ) || 0);
    //     break;
    // }
  }

  deleteIndex = -1;

  showModal(index: number) {
    this.showDeleteModal = true;
    this.deleteIndex = index;
  }

  updateChildrenState(e: Event) {
    this._childFormController.updateListState(e);
  }

  onComplete() {
    (async () => {
      await this.router.navigate(["/fsos"]);
    })();
  }

  onDeleteCancel() {
    this.showDeleteModal = false;
  }

  onDeleteConfirm() {
    this.showDeleteModal = false;
    this._childFormController.remove(this.deleteIndex);
  }

  onPageChange(e: Event, from: Page) {
    let dest: Page | undefined = undefined;
    switch (from) {
      // case "what-is-your-role":
      //   dest = this.handleRole(e);
      //   break;
      // case "contact":
      //   dest = this.handleContact(e);
      //   break;
      // case "optional":
      //   dest = this.handleOptional();
      //   break;
      case "children-subform":
        // no validation required here
        dest = "summary";
        break;
      // case "address":
      //   dest = this.handleAddress(e);
      //   break;
      // case "do-you-receive-support":
      //   dest = this.handleSupport(e);
      //   break;
      // case "recalculated":
      //   dest = this.handleRecalculated(e);
      //   break;
      case "summary":
        break;
      default:
        console.warn("Unhandled page", from);
        break;
    }

    if (dest) {
      this._mainFormController.continueTo(dest);
    }
  }

  onChildPageChange(e: Event, from: ChildPage) {
    let dest: ChildPage | undefined = undefined;
    switch (from) {
      // case "child-list":
      //   dest = "name";
      //   break;
      case "name":
        dest = this.handleChildrenNames(e);
        break;
      // case "alternate-name":
      //   dest = this.handleChildrenAlternateName(e);
      //   break;
      // case "dob":
      //   dest = this.handleChildDateOfBirth(e);
      //   break;
      // case "summary":
      //   dest = "child-list";
      //   break;
      default:
        console.warn("Unhandled page", from);
        break;
    }

    if (dest) {
      this._childFormController.continueTo(dest);
    }
  }

  // Child form is complete when the user clicks the "Continue" button with it
  // onChildComplete(e: Event) {
  //   e.stopPropagation();
  //   this._mainFormController.continueTo("address");
  // }

  // ===========
  // Validations
  // ===========

  // handleRole(e: Event): Page | undefined {
  //   const [ok, value] = this._mainFormController.validate("role", e, [
  //     requiredValidator("Role is required"),
  //   ]);
  //   if (!ok) {
  //     return;
  //   }
  //
  //   if (value === "Payor") {
  //     return "recalculated";
  //   }
  //
  //   return "contact";
  // }

  // handleContact(e: Event): Page | undefined {
  //   const [phoneOk] = this._mainFormController.validate("phone-number", e, [
  //     requiredValidator("Phone number is require"),
  //   ]);
  //
  //   if (!phoneOk) {
  //     return;
  //   }
  //
  //   return "optional";
  // }
  //
  // handleOptional(): Page | undefined {
  //   return "children-subform";
  // }

  // handleAddress(e: Event): Page | undefined {
  //   const [cityOk] = this._mainFormController.validate("city", e, [requiredValidator()]);
  //   const [addressOk] = this._mainFormController.validate("address", e, [
  //     requiredValidator(),
  //   ]);
  //   const [postalCodeOk] = this._mainFormController.validate("postal-code", e, [
  //     requiredValidator(),
  //   ]);
  //
  //   if (!cityOk || !addressOk || !postalCodeOk) {
  //     return;
  //   }
  //
  //   return "do-you-receive-support";
  // }

  // handleSupport(e: Event): Page | undefined {
  //   const [ok] = this._mainFormController.validate("support", e, [
  //     requiredValidator("Support response is required"),
  //   ]);
  //   if (!ok) return;
  //
  //   return "recalculated";
  // }
  //
  // handleRecalculated(e: Event): Page | undefined {
  //   const [ok] = this._mainFormController.validate("recalculated", e, [
  //     requiredValidator(),
  //   ]);
  //   if (!ok) return;
  //
  //   return "summary";
  // }

  // Children

  handleChildrenNames(e: Event): ChildPage | undefined {
    const [firstNameOk] = this._childFormController.validate("firstName", e, [
      requiredValidator(),
    ]);
    const [lastNameOk] = this._childFormController.validate("lastName", e, [
      requiredValidator(),
    ]);
    if (!firstNameOk || !lastNameOk) return;

    // return "summary";
    return;
  }
}
