import { DataConfig } from "../types/Config";
import fetch, { Response } from "node-fetch";
import { formatDistanceToNow, toDate } from "date-fns";
import { PrometheusAlert } from "../types/Prometheus";
import * as Display from "../types/Display";
import { LogWrapper } from "../utilities/LogWrapper";

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
    const url = this.dataConfig.prometheusUrl + "/api/v1/alerts";
    return fetch(url, {
      method: "get"
    })
      .then(this.checkFetchStatus)
      .then((response) => response.json())
      .then((responseData) => {
        const alerts: Display.Alert[] = [];
        responseData.data.alerts.forEach((alert: PrometheusAlert) => {
          const activeAt: Date = toDate(Date.parse(alert.activeAt));
          alerts.push({
            labels: alert.labels,
            annotations: alert.annotations,
            state: alert.state as Display.AlertState,
            value: alert.value,
            age: formatDistanceToNow(activeAt, {}),
            activeAt: activeAt
          });
        });

        const summaryData: Display.Summary = {
          title: "Alerts",
          alerts: alerts
        };

        this.logger.info(`Sending Summary Data: Alert Count = ${summaryData.alerts.length}`);
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

  checkFetchStatus(response: Response) {
    if (response.ok) {
      return response;
    } else {
      throw Error(response.statusText);
    }
  }
}
