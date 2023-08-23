export interface DataConfig {
  prometheusUrl: string;
  updateInterval: number;
}

export const isDataConfig = (obj: unknown): boolean => {
  if (typeof obj === "object" && obj) {
    return "prometheusUrl" in obj && "updateInterval" in obj;
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
