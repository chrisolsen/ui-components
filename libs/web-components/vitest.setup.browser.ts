import * as matchers from "vitest-dom/matchers";
import * as moreExpect from "vitest-dom/extend-expect";
// import * as browser from "@vitest/browser/matchers";
import * as webdriver from "@vitest/browser/providers/webdriverio"

import { expect } from "vitest";

expect.extend(matchers);
expect.extend(moreExpect);
// expect.extend(browser);
// expect.extend(webdriver);

// prevent "Could not parse CSS stylesheet" errors from showing up when running tests
const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
  if (!params.find((p) => p.toString().includes(jsDomCssError))) {
    originalConsoleError(...params);
  }
};
