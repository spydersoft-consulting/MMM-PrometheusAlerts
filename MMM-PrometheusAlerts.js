(function () {
	"use strict";

	var ModuleNotification;
	(function (ModuleNotification) {
		ModuleNotification["RETRIEVE"] = "GET_PROMTHEUS_ALERTS";
		ModuleNotification["CONFIG"] = "CONFIGURE_PROMETHEUS";
		ModuleNotification["RESULTS"] = "PROMTHEUSALERT_RESULT";
		ModuleNotification["ERROR"] = "PROMTHEUSALERT_RETRIEVE_ERROR";
	})(ModuleNotification || (ModuleNotification = {}));

	const getAlertCard = (alert) => {
		const card = document.createElement("div");
		card.classList.add("prom-alert-wrapper");
		const dateWrapper = document.createElement("div");
		dateWrapper.classList.add("status-wrapper");
		card.appendChild(dateWrapper);
		const dataWrapper = document.createElement("div");
		dataWrapper.classList.add("data-wrapper");
		card.appendChild(dataWrapper);
		// Icon
		dateWrapper.appendChild(getAlertStatusIcon(alert));
		const title = document.createElement("div");
		title.classList.add("small", "bright", "no-wrap", "title");
		title.innerHTML = alert.annotations.summary;
		dataWrapper.appendChild(title);
		const startDiv = document.createElement("div");
		startDiv.classList.add("xsmall", "no-wrap", "dimmed");
		startDiv.innerText = alert.annotations.description;
		dataWrapper.appendChild(startDiv);
		return card;
	};
	const getAlertStatusIcon = (alert) => {
		const icon = document.createElement("i");
		let iconName = "";
		switch (alert.state) {
			case "pending":
				iconName = "exclamation-triangle";
				break;
			case "firing":
				iconName = "exclamation-circle";
				break;
		}
		icon.classList.add("fa", "fa-fw", `fa-${iconName}`, "state-" + alert.state);
		return icon;
	};
	const getWrapperElement = (config) => {
		const wrapper = document.createElement("div");
		wrapper.className = "wrapper";
		wrapper.style.maxWidth = config.maxWidth ?? "auto";
		return wrapper;
	};
	const getLoadingView = (config) => {
		const wrapper = getWrapperElement(config);
		wrapper.innerHTML = "Prometheus Alerts";
		wrapper.classList.add("bright", "light", "small");
		return wrapper;
	};
	const getSummaryView = (summary, config) => {
		const wrapper = getWrapperElement(config);
		//  Header
		if (config.useHeader) {
			const header = document.createElement("header");
			header.classList.add("header", "small", "dimmed", "bold");
			const text = document.createElement("span");
			text.innerHTML = config.headerText !== undefined && config.headerText !== "" ? config.headerText : summary.title;
			header.appendChild(text);
			wrapper.appendChild(header);
		}
		if (summary.alerts.length > 0) {
			summary.alerts.forEach((alert) => {
				wrapper.appendChild(getAlertCard(alert));
			});
		}
		return wrapper;
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

	Module.register("MMM-PrometheusAlerts", {
		// Module config defaults.           // Make all changes in your config.js file
		defaults: {
			prometheusUrl: "",
			useHeader: true,
			headerText: undefined,
			maxWidth: "300px",
			animationSpeed: 1000,
			initialLoadDelay: 1500,
			updateInterval: 2 * 60 * 1000 // 2 minutes
		},
		getLogger: function () {
			return new Logger("MMM-PrometheusAlerts module", Log);
		},
		requiresVersion: "2.1.0",
		summaryData: {},
		getStyles: function () {
			return ["MMM-PrometheusAlerts.css"];
		},
		start: function () {
			this.getLogger().info("Starting module: " + this.name);
			this.sendSocketNotification(ModuleNotification.CONFIG, this.config);
			this.scheduleUpdate(this.config.initialLoadDelay);
		},
		scheduleUpdate: function (delay) {
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
		socketNotificationReceived: function (notification, payload) {
			this.getLogger().info("socket notification received ", notification);
			if (notification === ModuleNotification.RESULTS) {
				const summary = payload;
				if (summary) {
					this.summaryData = summary;
					this.getLogger().info("Processing Alert Data ", this.summaryData);
					this.loaded = true;
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
			if (!this.loaded) {
				return getLoadingView(this.config);
			}
			return getSummaryView(this.summaryData, this.config);
		}
	});
})();
