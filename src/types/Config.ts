export interface PrometheusInstance {
  url: string;
  headers?: Record<string, string>;
}

export interface DataConfig {
  instances: PrometheusInstance[];
  updateInterval: number;
}

export const isDataConfig = (obj: unknown): boolean => {
  if (typeof obj === "object" && obj) {
    if ("instances" in obj && Array.isArray(obj.instances) && "updateInterval" in obj && typeof obj.updateInterval === "number") {
      return obj.instances.every((instance: unknown) => typeof instance === "object" && instance !== null && "url" in instance && typeof instance.url === "string");
    }
  }
  return false;
};

export interface AppearanceConfig {
  useHeader: boolean;
  headerText?: string;
  maxWidth?: string;
  animationSpeed?: number;
  initialLoadDelay?: number;
}

export interface Config extends DataConfig, AppearanceConfig {}
