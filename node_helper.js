(function (global, factory) {
	typeof exports === "object" && typeof module !== "undefined"
		? factory(require("node-fetch"), require("date-fns"))
		: typeof define === "function" && define.amd
		? define(["node-fetch", "date-fns"], factory)
		: ((global = typeof globalThis !== "undefined" ? globalThis : global || self), factory(global.fetch, global.dateFns));
})(this, function (fetch, dateFns) {
	"use strict";

	var ModuleNotification;
	(function (ModuleNotification) {
		ModuleNotification["RETRIEVE"] = "GET_PROMTHEUS_ALERTS";
		ModuleNotification["CONFIG"] = "CONFIGURE_PROMETHEUS";
		ModuleNotification["RESULTS"] = "PROMTHEUSALERT_RESULT";
		ModuleNotification["ERROR"] = "PROMTHEUSALERT_RETRIEVE_ERROR";
	})(ModuleNotification || (ModuleNotification = {}));

	const isDataConfig = (obj) => {
		if (typeof obj === "object" && obj) {
			return "prometheusUrl" in obj && "updateInterval" in obj;
		}
		return false;
	};

	class Logger {
		logger;
		moduleName;
		constructor(moduleName, logInstance) {
			this.logger = logInstance;
			this.moduleName = moduleName;
		}
		error(message) {
			this.logger.error(this.formatMessage(message));
		}
		warn(message) {
			this.logger.warn(this.formatMessage(message));
		}
		info(message) {
			this.logger.info(this.formatMessage(message));
		}
		log(message) {
			this.logger.log(this.formatMessage(message));
		}
		formatMessage(message) {
			return `[${this.moduleName}] - ${message}`;
		}
	}

	class PrometheusService {
		pending = false;
		dataConfig;
		logger;
		constructor(config, logger) {
			this.dataConfig = config;
			this.logger = logger;
		}
		async getPrometheusAlerts() {
			if (this.pending) {
				return;
			}
			this.pending = true;
			const url = this.dataConfig.prometheusUrl + "/api/v1/alerts";
			return fetch(url, {
				method: "get"
			})
				.then(this.checkFetchStatus)
				.then((response) => response.json())
				.then((responseData) => {
					const alerts = [];
					responseData.data.alerts.forEach((alert) => {
						const activeAt = dateFns.toDate(Date.parse(alert.activeAt));
						alerts.push({
							labels: alert.labels,
							annotations: alert.annotations,
							state: alert.state,
							value: alert.value,
							age: dateFns.formatDistanceToNow(activeAt, {}),
							activeAt: activeAt
						});
					});
					const summaryData = {
						title: "Alerts",
						alerts: alerts
					};
					this.logger.info("Sending Summary Data");
					this.logger.log(JSON.stringify(summaryData));
					return summaryData;
				})
				.catch((error) => {
					this.logger.error(error);
					return undefined;
				})
				.finally(() => {
					this.pending = false;
				});
		}
		checkFetchStatus(response) {
			if (response.ok) {
				return response;
			} else {
				throw Error(response.statusText);
			}
		}
	}

	/* eslint-disable @typescript-eslint/no-var-requires */
	const Log = require("logger");
	const NodeHelper = require("node_helper");
	/* eslint-enable @typescript-eslint/no-var-requires */
	const logger = new Logger("MMM-PrometheusAlerts", Log);
	module.exports = NodeHelper.create({
		service: {},
		start: function () {
			logger.info("Starting node_helper for: " + this.name);
		},
		socketNotificationReceived: function (notification, payload) {
			//const self = this;
			logger.info(`Processing ${notification} notification`);
			if (notification === ModuleNotification.CONFIG) {
				if (isDataConfig(payload)) {
					this.service = new PrometheusService(payload, logger);
				} else {
					logger.error("Invalid configuration payload");
				}
			}
			if (notification === ModuleNotification.RETRIEVE) {
				if (!this.service) {
					logger.error("No valid service");
				} else {
					this.service.getPrometheusAlerts().then((response) => {
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
});
