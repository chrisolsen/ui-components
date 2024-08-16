import { Component, OnInit } from "@angular/core";

@Component({
  selector: "abgov-root",
  templateUrl: "./app.component.html",
  styles: ``,
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    const link = document.querySelector("#link");
    link?.addEventListener("click", (e) => {
      console.log("the click listener works");
      e.preventDefault();
    });
  }
  title = "angular";
  colors = [
    { value: "red", mount: "append" },
    { value: "green", mount: "append" },
    { value: "blue", mount: "append" },
  ];

  addColors(mount: string) {
    const newColors = [
      { value: "cyan", mount: mount },
      { value: "violet", mount: mount },
    ];
    if (mount === "prepend") {
      newColors.reverse();
    }
    this.colors = [...this.colors, ...newColors];
  }
}
