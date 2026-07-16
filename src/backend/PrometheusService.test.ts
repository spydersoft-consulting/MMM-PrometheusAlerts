import { Response } from "node-fetch";
import { LogWrapper } from "../utilities/LogWrapper";
import { PrometheusService, normalizeAlertState } from "./PrometheusService";
import { AlertState } from "../types/Display";

jest.mock("../utilities/LogWrapper", () => {
  return {
    LogWrapper: jest.fn().mockImplementation(() => {
      return {
        error: jest.fn().mockImplementation(),
        warn: jest.fn().mockImplementation(),
        info: jest.fn().mockImplementation(),
        log: jest.fn().mockImplementation(),
        formatMessage: jest.fn()
      };
    })
  };
});

describe("Functions in prometheus-service", function () {
  describe("checkFetchStatus", function () {
    it(`for a string should return an array`, function () {
      const testResponse: Response = new Response('{ data: { name: "Test Response" }      }"', {
        status: 200
      });
      const service = new PrometheusService(
        {
          instances: [
            {
              url: "http://localhost:8080"
            }
          ],
          updateInterval: 1000
        },
        new LogWrapper("TEST", undefined)
      );

      expect(service.checkFetchStatus(testResponse)).toBe(testResponse);
    });
  });

  describe("normalizeAlertState", function () {
    it.each([
      ["firing", AlertState.FIRING],
      ["pending", AlertState.PENDING],
      ["Alerting", AlertState.FIRING],
      ["Pending", AlertState.PENDING],
      ["Alerting (NoData)", AlertState.FIRING],
      ["Pending (Error)", AlertState.PENDING]
    ])(`maps raw state %s to %s`, function (rawState, expected) {
      expect(normalizeAlertState(rawState)).toBe(expected);
    });

    it.each(["Normal", "Normal (NoData)", "inactive", "Normal (Error)"])(`filters out non-alerting state %s`, function (rawState) {
      expect(normalizeAlertState(rawState)).toBeUndefined();
    });
  });
});
