/* Magic Mirror
 * Module: MMM-PrometheusAlerts
 *
 * By Matt Gerega
 *
 */
Module.register("MMM-PrometheusAlerts", {
	// Module config defaults.           // Make all changes in your config.js file
	defaults: {
		prometheusUrl: "",
		useHeader: true, // false if you don't want a header
		headerText: null,
		maxWidth: "300px",
		animationSpeed: 1000, // fade speed
		initialLoadDelay: 1500,
		updateInterval: 2 * 60 * 1000 // 2 minutes
	},

	requiresVersion: "2.1.0",

	getStyles: function () {
		return ["MMM-PrometheusAlerts.css"];
	},

	start: function () {
		Log.info("Starting module: " + this.name);

		this.PrometheusAlerts = {};
		this.scheduleUpdate(this.config.initialLoadDelay);
	},

	scheduleUpdate: function (delay) {
		var self = this;
		if (self.isScheduled) {
			return;
		}
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay !== null && delay >= 0) {
			nextLoad = delay;
		}

		self.isScheduled = true;
		setTimeout(function () {
			Log.info("MMM-PrometheusAlerts - Requesting status update");
			self.isScheduled = false;
			self.sendSocketNotification("GET_PROMTHEUS_ALERTS", { prometheusUrl: self.config.prometheusUrl });
		}, nextLoad);
	},

	socketNotificationReceived: function (notification, payload) {
		Log.info("[MMM-PrometheusAlerts] - socket notification received ", notification);
		if (notification === "PROMTHEUSALERT_RESULT") {
			this.processPrometheusAlerts(payload);
			this.updateDom(this.config.animationSpeed);
		}
		// If an error occurs, reschedule an update to try again
		if (notification === "PROMTHEUSALERT_RETRIEVE_ERROR") {
			this.scheduleUpdate();
		}
	},

	processPrometheusAlerts: function (data) {
		Log.info("[MMM-PrometheusAlerts] - processing alert data ", this.PrometheusAlerts);
		this.PrometheusAlerts = data;
		this.loaded = true;
		this.scheduleUpdate();
	},

	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.className = "wrapper";
		wrapper.style.maxWidth = this.config.maxWidth;

		if (!this.loaded) {
			wrapper.innerHTML = "Prometheus Alerts";
			wrapper.classList.add("bright", "light", "small");
			return wrapper;
		}

		//  Header
		if (this.config.useHeader !== false) {
			var header = document.createElement("header");
			header.classList.add("header", "small", "dimmed", "bold");
			var text = document.createElement("span");
			text.innerHTML = this.config.headerText !== null && this.config.headerText !== "" ? this.config.headerText : this.PrometheusAlerts.title;
			header.appendChild(text);
			wrapper.appendChild(header);
		}

		if (this.PrometheusAlerts.alerts.length > 0) {
			this.PrometheusAlerts.alerts.forEach((alert) => {
				wrapper.appendChild(this.getAlertCard(alert));
			});
		}

		return wrapper;
	}, // <-- closes getDom
	getAlertCard: function (alert) {
		var card = document.createElement("div");
		card.classList.add("prom-alert-wrapper");

		var dateWrapper = document.createElement("div");
		dateWrapper.classList.add("status-wrapper");
		card.appendChild(dateWrapper);

		var dataWrapper = document.createElement("div");
		dataWrapper.classList.add("data-wrapper");
		card.appendChild(dataWrapper);

		// Icon
		dateWrapper.appendChild(this.getAlertStatusIcon(alert));

		var title = document.createElement("div");
		title.classList.add("small", "bright", "no-wrap", "title");
		title.innerHTML = alert.annotations.summary;
		dataWrapper.appendChild(title);

		var startDiv = document.createElement("div");
		startDiv.classList.add("xsmall", "no-wrap", "dimmed");
		startDiv.innerText = alert.annotations.description;
		dataWrapper.appendChild(startDiv);

		return card;
	},

	getAlertStatusIcon: function (alert) {
		var icon = document.createElement("i");
		var iconName = "";
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
	}
});
