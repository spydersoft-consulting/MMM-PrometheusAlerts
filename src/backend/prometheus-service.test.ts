import { Response } from "node-fetch";
import { Logger } from "../utilities/logging";
import { PrometheusService } from "./prometheus-service";

describe("Functions in node_helper.js", function () {
  describe("checkFetchStatus", function () {
    it(`for a string should return an array`, function () {
      const testResponse: Response = {
        ok: true,
        data: {
          name: "Test Response"
        }
      };
      const service = new PrometheusService(
        {
          prometheusUrl: "http://localhost:8080/",
          updateInterval: 1000
        },
        new Logger("TEST", {})
      );

      expect(service.checkFetchStatus(testResponse)).toBe(testResponse);
    });
  });
});
