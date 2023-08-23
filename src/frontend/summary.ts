import { AppearanceConfig } from "../types/config";
import { Alert, Summary } from "../types/transfer-types";

const getAlertCard = (alert: Alert): HTMLElement => {
  const card = document.createElement("div");
  card.classList.add("prom-alert-wrapper");

  const dateWrapper = document.createElement("div");
  dateWrapper.classList.add("status-wrapper");
  card.appendChild(dateWrapper);

  const dataWrapper = document.createElement("div");
  dataWrapper.classList.add("data-wrapper");
  card.appendChild(dataWrapper);

  // Icon
  dateWrapper.appendChild(getAlertStatusIcon(alert));

  const title = document.createElement("div");
  title.classList.add("small", "bright", "no-wrap", "title");
  title.innerHTML = alert.annotations.summary;
  dataWrapper.appendChild(title);

  const startDiv = document.createElement("div");
  startDiv.classList.add("xsmall", "no-wrap", "dimmed");
  startDiv.innerText = alert.annotations.description;
  dataWrapper.appendChild(startDiv);

  return card;
};

const getAlertStatusIcon = (alert: Alert): HTMLElement => {
  const icon = document.createElement("i");
  let iconName = "";
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
};

const getWrapperElement = (config: AppearanceConfig): HTMLElement => {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  wrapper.style.maxWidth = config.maxWidth ?? "auto";

  return wrapper;
};

export const getLoadingView = (config: AppearanceConfig): HTMLElement => {
  const wrapper = getWrapperElement(config);
  wrapper.innerHTML = "Prometheus Alerts";
  wrapper.classList.add("bright", "light", "small");
  return wrapper;
};

export const getSummaryView = (summary: Summary, config: AppearanceConfig): HTMLElement => {
  const wrapper = getWrapperElement(config);

  //  Header
  if (config.useHeader) {
    const header = document.createElement("header");
    header.classList.add("header", "small", "dimmed", "bold");
    const text = document.createElement("span");
    text.innerHTML = config.headerText !== undefined && config.headerText !== "" ? config.headerText : summary.title;
    header.appendChild(text);
    wrapper.appendChild(header);
  }

  if (summary.alerts.length > 0) {
    summary.alerts.forEach((alert: Alert) => {
      wrapper.appendChild(getAlertCard(alert));
    });
  }

  return wrapper;
};
