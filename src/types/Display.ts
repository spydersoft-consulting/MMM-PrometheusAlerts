export enum AlertState {
  PENDING = "pending",
  FIRING = "firing",
  RESOLVED = "resolved"
}

export type Alert = {
  labels: Record<string, string>;
  annotations: Record<string, string>;
  state: AlertState;
  activeAt: Date;
  age: string;
  value: number;
};

export type Summary = {
  title: string;
  alerts: Alert[];
};
