import { within } from "@testing-library/react";

export const tabNames = (container: HTMLElement) =>
  within(container)
    .getAllByRole("tab")
    .map((tab) => tab.textContent);
