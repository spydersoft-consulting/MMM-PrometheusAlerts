import * as Log from "logger";

export class LogWrapper {
  logger?: typeof Log;
  moduleName: string;

  constructor(moduleName: string, logInstance: typeof Log | undefined) {
    this.logger = logInstance;
    this.moduleName = moduleName;
  }

  error(message: string) {
    this.logger?.error(this.formatMessage(message));
  }

  warn(message: string) {
    this.logger?.warn(this.formatMessage(message));
  }

  info(message: string) {
    this.logger?.info(this.formatMessage(message));
  }

  log(message: string) {
    this.logger?.log(this.formatMessage(message));
  }

  formatMessage(message: string) {
    return `[${this.moduleName}] - ${message}`;
  }
}
