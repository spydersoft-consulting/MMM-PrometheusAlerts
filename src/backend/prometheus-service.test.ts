import { Response } from "node-fetch";
import { Logger } from "../utilities/logging";
import { PrometheusService } from "./prometheus-service";

jest.mock("../utilities/logging", () => {
  return {
    Logger: jest.fn().mockImplementation(() => {
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
          prometheusUrl: "http://localhost:8080/",
          updateInterval: 1000
        },
        new Logger("TEST", undefined)
      );

      expect(service.checkFetchStatus(testResponse)).toBe(testResponse);
    });
  });
});
