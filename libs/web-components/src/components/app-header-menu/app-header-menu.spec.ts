import AppHeaderMenuWrapper from "./AppHeaderMenuWrapper.test.svelte";

import { render, waitFor, screen, cleanup } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { tick } from "svelte";

let user: UserEvent;

beforeEach(() => {
  cleanup();
  user = userEvent.setup();
});

describe("Desktop", () => {
  let heading: string;
  let container: HTMLElement;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1200,
    });

    heading = "Some links";
    const result = render(AppHeaderMenuWrapper, {
      heading,
      leadingicon: "add",
    });

    container = result.container;
  });

  it("renders on desktop", async () => {

    const popover = container.querySelector("goa-popover");
    const button = container.querySelector("button");
    const leadingIcon = container.querySelector("button goa-icon[type=add]");
    const chevronIcon = container.querySelector("button goa-icon[type=chevron-down]");
    const links = container.querySelectorAll("a");

    expect(popover).toBeTruthy();
    expect(button).toBeTruthy();
    expect(leadingIcon).toBeTruthy();
    expect(chevronIcon).toBeTruthy();

    expect(popover?.getAttribute("maxwidth")).toBe("16rem");
    expect(popover?.getAttribute("minwidth")).toBe("8rem");
    expect(button?.innerHTML).toContain(heading);

    // The links will exist for the desktop since the show/hide logic is contained
    // within the popover; so the links will be visible as the they are passed into
    // the default slot
    await waitFor(() => {
      expect(links).toBeTruthy();
      expect(links.length).toBe(4);
    });
  });

  it("listen to appheader:current:change event and set link to be active", async () => {
    const rootEl = screen.queryByTestId("rootEl");

    // Listen to parent GoAAppHeader to dispatch event current:change
    rootEl?.dispatchEvent(
      new CustomEvent("app-header:changed", {
        detail: "#seniors",
      }),
    );

    await waitFor(() => {
      const currentLink = container.querySelector("a.current");
      expect(currentLink?.getAttribute("href")).toBe("#seniors");
      // We should make sure when router link is changed, the app-header-menu is closed
      const popover = container.querySelector("goa-popover");
      expect(popover?.getAttribute("open")).toBe("false");
    });

    // When parent dispatch event with empty link, means no link should be highlighted, we should remove the current class
    rootEl?.dispatchEvent(
      new CustomEvent("app-header:changed", {
        detail: "",
      }),
    );

    await waitFor(() => {
      const currentLink = container.querySelector("a.current");
      expect(currentLink).toBeNull();
    });

    // When parent dispatch an event with parent's link, means no link under app-header-menu should be highlighted
    rootEl?.dispatchEvent(
      new CustomEvent("app-header:changed", {
        detail: "parent-link",
      }),
    );

    await waitFor(() => {
      const currentLink = container.querySelector("a.current");
      expect(currentLink).toBeNull();
    });
  });

  it.only("close the menu when clicking on something that doesn't navigate to a new page", async () => {
    // const link = container.querySelector("a[href='#special']");
    const link = screen.queryByText(/Test/);
    const popover = container.querySelector("goa-popover");
    const input = container.querySelector("input");
    const spy = vi.fn();

    expect(link).toBeTruthy();

    link?.addEventListener("click", () => {
      spy();
    });

    // clicking the following link doesn't open the menu, but rather perform the logic within
    // the assigned event handler
    link && (await user.click(link));
    input && (await user.type(input, "hello"));
    expect(popover?.getAttribute("open")).toBe("false");
    expect(spy).toHaveBeenCalled();
    expect(input?.value).toBe("hello");

    // Functionality is handled as usual
    const text = container.querySelector("[data-testid=test-without-loading]");
    console.log(text, "foo");
    await waitFor(() => {
      expect(text?.innerHTML).toBe("Test without loading");
    });
  });
});

describe("Mobile", () => {
  let heading: string;
  let container: HTMLElement;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 400,
    });

    heading = "Some links";
    const result = render(AppHeaderMenuWrapper, {
      heading,
      leadingicon: "add",
    });

    container = result.container;
  });

  it("renders on mobile", async () => {
    const button = container.querySelector("button");
    const leadingIcon = container.querySelector("button goa-icon[type=add]");
    const chevronIcon = container.querySelector("button goa-icon[type=chevron-down]");

    expect(button?.innerHTML).toContain(heading);
    expect(leadingIcon).toBeTruthy();
    expect(chevronIcon).toBeTruthy();
  });

  it("opens/closes the menu on click", async () => {
    const btn = container.querySelector("button");
    btn && await userEvent?.click(btn);
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(4);
    });

    // close
    btn && await user.click(btn);
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(0);
    });
  });

  it("opens/closes on the space key", async () => {
    const btn = container.querySelector("button");

    btn?.focus();
    // open
    await user.keyboard(" ");
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(4);
    });

    // close
    await userEvent?.keyboard("{enter}");
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(0);
    });
  });

  it("opens/closes on the enter key", async () => {
    const btn = container.querySelector("button");

    btn?.focus();
    // open
    await user.keyboard("{enter}");
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(4);
    });

    //close
    await user.keyboard("{enter}");
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(0);
    });
  });

  it("focuses on the links on `tab`", async () => {
    const btn = container.querySelector("button");

    btn?.focus();
    await user.keyboard("{enter}");
    await waitFor(async () => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(4);

      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(links[0]);
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(links[1]);
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(links[2]);
    });
  });

  it("close the menu if the link handles other function beside navigate to new page", async () => {
    const specialLink = container.querySelector("a[href='#special']");
    specialLink && await user.click(specialLink);
    await tick();
    const links = container.querySelectorAll("a");
    expect(links.length).toBe(0);
  });

  it.skip("follows the link on `enter`", () => {
    /* do nothing */
  });
});

describe("Tablet", () => {
  let heading: string;
  let container: HTMLElement;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 800,
    });

    heading = "Some links";
    const result = render(AppHeaderMenuWrapper, {
      heading,
      leadingicon: "add",
    });

    container = result.container;
  });

  it("renders on tablet", async () => {
    const button = container.querySelector("button");
    const leadingIcon = container.querySelector("button goa-icon[type=add]");
    const chevronIcon = container.querySelector("button goa-icon[type=chevron-down]");

    expect(button?.innerHTML).toContain(heading);
    expect(leadingIcon).toBeTruthy();
    expect(chevronIcon).toBeTruthy();
  });

  it("opens/closes the menu on click", async () => {
    const btn = container.querySelector("button");
    btn && await user.click(btn);
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(4);
    });

    // close
    btn && await user.click(btn);
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(0);
    });
  });

  it("opens/closes on the space key", async () => {
    const btn = container.querySelector("button");

    btn?.focus();
    // open
    await user.keyboard(" ");
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(4);
    });

    // close
    await user.keyboard("{enter}");
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(0);
    });
  });

  it("opens/closes on the enter key", async () => {
    const btn = container.querySelector("button");

    btn?.focus();
    // open
    await user.keyboard("{enter}");
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(4);
    });

    // close
    await user.keyboard("{enter}");
    await waitFor(() => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(0);
    });
  });

  it("focuses on the links on `tab`", async () => {
    const btn = container.querySelector("button");

    btn?.focus();
    await user.keyboard("{enter}");
    await waitFor(async () => {
      const links = container.querySelectorAll("a");
      expect(links.length).toBe(4);

      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(links[0]);
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(links[1]);
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(links[2]);
    });
  });

  it("close the menu if the link handles other function beside navigate to new page", async () => {
    const specialLink = container.querySelector("a[href='#special']");
    specialLink && user.click(specialLink);
    await tick();
    const links = container.querySelectorAll("a");
    expect(links.length).toBe(0);
  });
});
