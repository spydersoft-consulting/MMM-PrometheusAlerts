import { DataConfig } from "../types/config";
import fetch, { Response } from "node-fetch";
import { formatDistanceToNow, toDate } from "date-fns";
import { PrometheusAlert } from "../types/prometheus";
import { Alert, Summary } from "../types/transfer-types";
import { LogWrapper } from "../utilities/logging";

export class PrometheusService {
  pending: boolean = false;
  dataConfig: DataConfig;
  logger: LogWrapper;

  constructor(config: DataConfig, logger: LogWrapper) {
    this.dataConfig = config;
    this.logger = logger;
  }

  async getPrometheusAlerts(): Promise<Summary | undefined> {
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
        const alerts: Alert[] = [];
        responseData.data.alerts.forEach((alert: PrometheusAlert) => {
          const activeAt: Date = toDate(Date.parse(alert.activeAt));
          alerts.push({
            labels: alert.labels,
            annotations: alert.annotations,
            state: alert.state,
            value: alert.value,
            age: formatDistanceToNow(activeAt, {}),
            activeAt: activeAt
          });
        });

        const summaryData: Summary = {
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
