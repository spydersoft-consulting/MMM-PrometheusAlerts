import { ModuleNotification } from "./types/ModuleNotification";
import { DataConfig, isDataConfig } from "./types/Config";
import { Summary } from "./types/Display";
import { LogWrapper } from "./utilities/LogWrapper";
import { PrometheusService } from "./backend/PrometheusService";
import * as Log from "logger";
import NodeHelper from "node_helper";

const logger = new LogWrapper("MMM-PrometheusAlerts", Log);

module.exports = NodeHelper.create({
  service: undefined as PrometheusService | undefined,

  start: function () {
    logger.info("Starting node_helper for: " + this.name);
  },

  socketNotificationReceived: function (notification: string, payload: unknown) {
    logger.info(`Processing ${notification} notification`);

    if (notification === ModuleNotification.CONFIG) {
      logger.info(`Config payload received: ${JSON.stringify(payload, null, 2)}`);
      if (isDataConfig(payload)) {
        this.service = new PrometheusService(payload as DataConfig, logger);
        logger.info("PrometheusService successfully initialized");
      } else {
        logger.error("Invalid configuration payload - does not match DataConfig structure");
        logger.error(`Payload: ${JSON.stringify(payload, null, 2)}`);
      }
    }

    if (notification === ModuleNotification.RETRIEVE) {
      if (!this.service || !this.service.getPrometheusAlerts) {
        logger.error("No valid service initialized");
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
