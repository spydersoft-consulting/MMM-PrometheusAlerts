import { AppearanceConfig } from "../types/Config";
import { getLoadingView } from "./Display";
import { getByText } from "@testing-library/dom";
import "@testing-library/jest-dom";

const displayWithHeader: AppearanceConfig = {
  useHeader: true,
  headerText: "Test Header"
};

const displayWithoutHeader: AppearanceConfig = {
  useHeader: false
};

describe("Functions in display", function () {
  describe("getLoadingView", function () {
    it(`should return the loading view with custom header`, function () {
      const container = getLoadingView(displayWithHeader);

      const title = getByText(container, displayWithHeader.headerText ?? "");
      expect(title).toHaveClass("wrapper");
    });

    it(`should return the loading view without custom header`, function () {
      const container = getLoadingView(displayWithoutHeader);
      const title = getByText(container, "Prometheus Alerts");
      expect(title).toHaveClass("wrapper");
    });
  });
});
