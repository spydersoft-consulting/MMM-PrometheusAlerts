export type AlertResponse = {
  data: AlertResponseData;
};

export type AlertResponseData = {
  alerts: PrometheusAlert[];
};

export type PrometheusAlert = {
  labels: Record<string, string>;
  annotations: Record<string, string>;
  state: string;
  activeAt: string;
  value: number;
};
