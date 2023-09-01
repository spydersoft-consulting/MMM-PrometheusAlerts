import { AppearanceConfig } from "../types/Config";
import { getLoadingView, getAlertStatusIcon } from "./Display";
import * as Display from "../types/Display";
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

  describe("getAlertStatusIcon", function () {
    it(`should return an icon for firing alerts`, function () {
      const icon = getAlertStatusIcon(Display.AlertState.FIRING);
      expect(icon).toHaveClass("fa", "fa-fw", "fa-exclamation-circle", "state-firing");
    });

    it(`should return an icon for pending alerts`, function () {
      const icon = getAlertStatusIcon(Display.AlertState.PENDING);
      expect(icon).toHaveClass("fa", "fa-fw", "fa-exclamation-triangle", "state-pending");
    });

    it(`should return an icon for resolved alerts`, function () {
      const icon = getAlertStatusIcon(Display.AlertState.RESOLVED);
      expect(icon).toHaveClass("fa", "fa-fw", "fa-check", "state-resolved");
    });
  });
});
