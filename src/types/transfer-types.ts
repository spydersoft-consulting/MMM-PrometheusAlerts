export type Alert = {
  labels: Record<string, string>;
  annotations: Record<string, string>;
  state: string;
  activeAt: Date;
  age: string;
  value: number;
};

export type Summary = {
  title: string;
  alerts: Alert[];
};
