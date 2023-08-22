import { ModuleNotification } from "./constants/ModuleNotification";
import { DataConfig, isDataConfig } from "./types/config";
import { Summary } from "./types/transfer-types";
import { Logger } from "./utilities/logging";
import { PrometheusService } from "./backend/prometheus-service";

/* eslint-disable @typescript-eslint/no-var-requires */
const Log = require("logger");
const NodeHelper = require("node_helper");
/* eslint-enable @typescript-eslint/no-var-requires */

const logger = new Logger("MMM-PrometheusAlerts", Log);

module.exports = NodeHelper.create({
  service: {} as PrometheusService,

  start: function () {
    logger.info("Starting node_helper for: " + this.name);
  },

  socketNotificationReceived: function (notification: ModuleNotification, payload: unknown) {
    //const self = this;
    logger.info(`Processing ${notification} notification`);

    if (notification === ModuleNotification.CONFIG) {
      if (isDataConfig(payload)) {
        this.service = new PrometheusService(payload as DataConfig, logger);
      } else {
        logger.error("Invalid configuration payload");
      }
    }

    if (notification === ModuleNotification.RETRIEVE) {
      if (!this.service) {
        logger.error("No valid service");
      } else {
        this.service.getPrometheusAlerts().then((response: Summary | undefined) => {
          if (response) {
            this.sendSocketNotification(ModuleNotification.RESULTS, response);
          } else {
            this.sendSocketNotification(ModuleNotification.ERROR);
          }
        });
      }
    }
  }
});
