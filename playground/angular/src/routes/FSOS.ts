import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";

type Status = "Not started" | "Incomplete" | "Completed";

type Data = {
  supportOrderDetails?: Record<string, unknown>;
  priorRegistrations?: Record<string, unknown>;
  otherPartProfile?: Record<string, unknown>;
};

type State = {
  hasChildSupport?: boolean;
}

@Component({
  standalone: true,
  selector: "abgov-fsos",
  templateUrl: "./FSOS.html",
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FSOS implements OnInit {
  state: State = {}
  data: Data = {};

  status: Record<string, Status> = {
    "support-order-details": "Not started",
    "prior-registrations": "Not started",
    "other-party-profile": "Not started",
  };

  ngOnInit() {
    try {
      this.data.supportOrderDetails = this.getData("support-order-details");
      this.data.otherPartProfile = this.getData("other-party-profile");
      this.data.priorRegistrations = this.getData("previous-registrations");
    } catch (e) {
      console.error(e);
    }

    this.setState();
  }

  setState() {
    this.state.hasChildSupport = 
      "Yes" === this.getValue(this.data.supportOrderDetails, "do-you-receive-support", "support");

    this.status["support-order-details"] = this.convertToStatus(this.data.supportOrderDetails?.["status"]);
  }

  convertToStatus(status: unknown): Status {
    switch (status) {
      case "incomplete":
        return "Incomplete";
      case "complete":
        return "Completed";
      default:
        return "Not started";
    }
  }

  getValue(data: unknown | undefined, section: string, id: string) {
    if (!data) return;
    // @ts-ignore
    return data["form"][section]?.[id].value;
  }

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
