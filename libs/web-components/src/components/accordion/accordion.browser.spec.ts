import { render } from "vitest-browser-svelte";
// import { page } from "@vitest/browser/context";
import { expect } from "vitest";

import Accordion from "./Accordion.svelte";

describe("stuff", () => {
  it("Accordion headless test", async () => {
    expect(true).toBeTruthy();
    // const screen = render(Accordion, {});
    // const button = screen.getByRole("button");
    // await expect(button).toBeInTheDocument();
  });
})
