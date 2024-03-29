import { ModuleNotification } from "./types/ModuleNotification";
import { DataConfig, isDataConfig } from "./types/Config";
import { Summary } from "./types/Display";
import { LogWrapper } from "./utilities/LogWrapper";
import { PrometheusService } from "./backend/PrometheusService";
import * as Log from "logger";
import * as NodeHelper from "node_helper";

const logger = new LogWrapper("MMM-PrometheusAlerts", Log);

module.exports = NodeHelper.create({
  service: {} as PrometheusService,

  start: function () {
    logger.info("Starting node_helper for: " + this.name);
  },

  socketNotificationReceived: function (notification: string, payload: unknown) {
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
            this.sendSocketNotification(ModuleNotification.ERROR, {});
          }
        });
      }
    }
  }
});
