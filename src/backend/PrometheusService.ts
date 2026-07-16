import { DataConfig, PrometheusInstance } from "../types/Config";
import fetch, { Response } from "node-fetch";
import { formatDistanceToNow } from "date-fns";
import { AlertResponse, PrometheusAlert } from "../types/Prometheus";
import * as Display from "../types/Display";
import { LogWrapper } from "../utilities/LogWrapper";

// Grafana's compatible endpoint returns every rule (e.g. "Normal (NoData)", "Alerting"); undefined means "not actively pending/firing", so callers filter it out.
export const normalizeAlertState = (rawState: string): Display.AlertState | undefined => {
  const baseState = rawState.split(" ")[0].toLowerCase();

  switch (baseState) {
    case "firing":
    case "alerting":
      return Display.AlertState.FIRING;
    case "pending":
      return Display.AlertState.PENDING;
    default:
      return undefined;
  }
};

export class PrometheusService {
  pending: boolean = false;
  dataConfig: DataConfig;
  logger: LogWrapper;

  constructor(config: DataConfig, logger: LogWrapper) {
    this.dataConfig = config;
    this.logger = logger;
  }

  async getPrometheusAlerts(): Promise<Display.Summary | undefined> {
    if (this.pending) {
      return;
    }
    this.pending = true;

    try {
      const alertPromises = this.dataConfig.instances.map((instance) => this.fetchAlertsFromInstance(instance));

      const alertsFromAllInstances = await Promise.all(alertPromises);
      const allAlerts: Display.Alert[] = alertsFromAllInstances.filter((alerts) => alerts !== undefined).flat() as Display.Alert[];

      const summaryData: Display.Summary = {
        title: "Alerts",
        alerts: allAlerts
      };

      this.logger.info(`Sending Summary Data: Alert Count = ${summaryData.alerts.length}`);
      return summaryData;
    } catch (error) {
      this.logger.error(String(error));
      return undefined;
    } finally {
      this.pending = false;
    }
  }

  private async fetchAlertsFromInstance(instance: PrometheusInstance): Promise<Display.Alert[] | undefined> {
    const url = instance.url + "/api/v1/alerts";
    const headers = instance.headers || {};

    try {
      const response = await fetch(url, {
        method: "get",
        headers: headers
      });

      this.checkFetchStatus(response);
      const responseData = (await response.json()) as AlertResponse;
      const alerts: Display.Alert[] = [];

      responseData.data.alerts.forEach((alert: PrometheusAlert) => {
        const state = normalizeAlertState(alert.state);
        if (state === undefined) {
          return;
        }

        const activeAt: Date = new Date(Date.parse(alert.activeAt));
        alerts.push({
          labels: alert.labels,
          annotations: alert.annotations,
          state,
          value: alert.value,
          age: formatDistanceToNow(activeAt, {}),
          activeAt: activeAt
        });
      });

      this.logger.info(`Fetched ${alerts.length} alerts from ${instance.url}`);
      return alerts;
    } catch (error) {
      this.logger.error(`Error fetching from ${instance.url}: ${error}`);
      return undefined;
    }
  }

  checkFetchStatus(response: Response) {
    if (response.ok) {
      return response;
    } else {
      throw Error(response.statusText);
    }
  }
}
