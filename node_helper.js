/* Magic Mirror
 * Module: MMM-PrometheusAlerts
 *
 */

const { formatDistanceToNow } = require("date-fns");
const NodeHelper = require("node_helper");
const fetch = require("node-fetch");
const Log = require("logger");
const { json } = require("express");

module.exports = NodeHelper.create({
	start: function () {
		Log.info("MMM-PrometheusAlerts - Starting node_helper for: " + this.name);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "GET_PROMTHEUS_ALERTS" && payload.prometheusUrl !== null) {
			Log.info(`[MMM-PrometheusAlerts] - Processing GET_PROMTHEUS_ALERTS notification for ${payload.prometheusUrl}`);
			this.getPrometheusAlerts(payload.prometheusUrl);
		}
	},

	inGroup: function (comp, group = null) {
		return comp.group_id === group;
	},

	hasIncident: function (incidents, comp) {
		return incidents.findIndex((inc) => inc.componentId === comp.id) !== -1;
	},

	ignoreComponent: function (componentsToIgnore, compId) {
		return componentsToIgnore.findIndex((comp) => comp === compId) !== -1;
	},

	getPrometheusAlerts: function (prometheusUrl) {
		let self = this;
		if(self.pending) {
			return;
		}
		self.pending = true;
		var url = prometheusUrl + "/api/v1/alerts";
		fetch(url, {
			method: "get"
		})
			.then(self.checkFetchStatus)
			.then((response) => response.json())
			.then((responseData) => {
				var alerts = [];
				responseData.data.alerts.forEach((alert) => {
					var activeAt = Date.parse(alert.activeAt);
					alerts.push({
						labels: alert.labels,
						annotations: alert.annotations,
						state: alert.state,
						value: alert.value,
						age: formatDistanceToNow(activeAt, {}),
						activeAt: activeAt
					});
				});

				var summaryData = {
					title: "Alerts",
					alerts: alerts
				};

				Log.info("[MMM-PrometheusAlerts] - Sending Summary Data");
				Log.debug("[MMM-PrometheusAlerts] - " + JSON.stringify(summaryData));
				self.sendSocketNotification("PROMTHEUSALERT_RESULT", summaryData);
			})
			.catch((error) => {
				self.logError(error);
				self.sendSocketNotification("PROMTHEUSALERT_RETRIEVE_ERROR");
			})
			.finally(() => {
				self.pending = false;
			});
	},

	checkFetchStatus: function (response) {
		if (response.ok) {
			return response;
		} else {
			throw Error(response.statusText);
		}
	},
	logError: function (error) {
		Log.error(`[MMM-PrometheusAlerts]: ${error}`);
	}
});
