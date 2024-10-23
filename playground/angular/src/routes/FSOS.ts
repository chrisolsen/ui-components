import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";

type Status = "Not started" | "Completed";

type State = {
  supportOrderDetails?: Record<string, unknown>;
  priorRegistrations?: Record<string, unknown>;
  otherPartProfile?: Record<string, unknown>;
};

@Component({
  standalone: true,
  selector: "abgov-fsos",
  templateUrl: "./FSOS.html",
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FSOS implements OnInit {
  state: State = {};

  ngOnInit() {
    try {
      this.state.supportOrderDetails = this.getData("support-order-details");
      this.state.otherPartProfile = this.getData("other-party-profile");
      this.state.priorRegistrations = this.getData("previous-registrations");
    } catch (e) {
      console.log(e);
    }
    console.log(this.state);
  }

  status: Record<string, Status> = {
    "support-order-details": "Not started",
    "prior-registrations": "Not started",
    "other-party-profile": "Not started",
  };

  getData(key: string): Record<string, unknown> {
    const raw = localStorage.getItem(key);
    if (!raw) {
      throw "Unable to get " + key;
    }
    return JSON.parse(raw);
  }

  getType(content: string) {
    switch (content) {
      case "Not started":
        return "information";
      case "Completed":
        return "success";
      default:
        return "";
    }
  }
}
