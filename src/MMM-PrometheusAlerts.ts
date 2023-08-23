import { ModuleNotification } from "./constants/ModuleNotification";
import { getLoadingView, getSummaryView } from "./frontend/summary";
import { Config } from "./types/config";
import { Summary } from "./types/transfer-types";
import { LogWrapper } from "./utilities/logging";
import * as Log from "logger";

import "./frontend/summary.scss";

Module.register<Config>("MMM-PrometheusAlerts", {
  // Module config defaults.           // Make all changes in your config.js file
  defaults: {
    prometheusUrl: "",
    useHeader: true, // false if you don't want a header
    headerText: undefined,
    maxWidth: "300px",
    animationSpeed: 1000, // fade speed
    initialLoadDelay: 1500,
    updateInterval: 2 * 60 * 1000 // 2 minutes
  },

  getLogger: function (): LogWrapper {
    return new LogWrapper("MMM-PrometheusAlerts module", Log);
  },

  isLoaded: false,

  requiresVersion: "2.1.0",

  summaryData: {} as Summary,

  getStyles: function () {
    return ["MMM-PrometheusAlerts.css"];
  },

  start: function () {
    this.getLogger().info("Starting module: " + this.name);
    this.sendSocketNotification(ModuleNotification.CONFIG, this.config);
    this.scheduleUpdate(this.config.initialLoadDelay);
  },

  scheduleUpdate: function (delay?: number) {
    if (this.isScheduled) {
      return;
    }
    let nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay !== undefined && delay >= 0) {
      nextLoad = delay;
    }

    this.isScheduled = true;
    setTimeout(() => {
      this.getLogger().info("Requesting status update");
      this.isScheduled = false;
      this.sendSocketNotification(ModuleNotification.RETRIEVE, {});
    }, nextLoad);
  },

  socketNotificationReceived: function (notification: string, payload) {
    this.getLogger().info("socket notification received ", notification);
    if (notification === ModuleNotification.RESULTS) {
      const summary: Summary = payload as Summary;
      if (summary) {
        this.summaryData = summary;
        this.getLogger().info(`Processing Alert Data: Alert Count = ${summary.alerts.length}`, this.summaryData);
        this.isLoaded = true;
        this.scheduleUpdate();
        this.updateDom(this.config.animationSpeed);
      } else {
        this.getLogger().warn("Summary data not formatted correctly.");
      }
    }
    // If an error occurs, reschedule an update to try again
    if (notification === "PROMTHEUSALERT_RETRIEVE_ERROR") {
      this.scheduleUpdate();
    }
  },

  getDom: function () {
    if (!this.isLoaded) {
      return getLoadingView(this.config);
    }
    return getSummaryView(this.summaryData, this.config);
  }
});
