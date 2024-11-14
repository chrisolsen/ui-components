import { cleanup, render } from "@testing-library/react";
import { GoabAppHeader } from "./app-header";

beforeEach(() => {
  cleanup()
})

describe("GoAAppHeader", () => {
  it("should render", () => {
    const { baseElement } = render(
      <GoabAppHeader heading="Test heading" url="test" />
    );

    const header = baseElement.querySelector("goa-app-header");
    expect(header).toBeTruthy();
  });

  it("should dispatch onMobileMenuClick if provided", async () => {
    const onMenuClick = vi.fn();
    const result = render(
      <GoabAppHeader heading="Test heading" url="test" onMenuClick={onMenuClick} />
    );

    const el = result.container.querySelector("goa-app-header")
    expect(el).toBeTruthy();
    el?.dispatchEvent(new CustomEvent("_menuClick"));
    expect(onMenuClick).toHaveBeenCalled();
  })
});
