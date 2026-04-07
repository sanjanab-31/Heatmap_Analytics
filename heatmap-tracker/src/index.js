import { clearConsent, hasConsent, showConsentBanner } from "./consent";
import { startSender, stopSender } from "./sender";
import { startTracking, stopTracking } from "./tracker";

let activeDestroy = null;
const CONSENT_KEY = "heatmap_consent";

function startRuntime(queue, endpoint, projectId, apiKey) {
  startTracking(queue);
  startSender(queue, endpoint, projectId, apiKey);
}

export function init({ apiKey = "", endpoint = "", projectId = "" } = {}) {
  if (typeof activeDestroy === "function") {
    activeDestroy();
  }

  const queue = [];
  let isActive = false;

  const destroy = () => {
    if (!isActive) {
      return;
    }

    stopTracking();
    stopSender();
    isActive = false;
  };

  const start = () => {
    if (isActive) {
      return;
    }

    startRuntime(queue, endpoint, projectId, apiKey);
    isActive = true;
  };

  if (hasConsent()) {
    start();
  } else {
    let consentState = null;

    try {
      consentState = window.localStorage.getItem(CONSENT_KEY);
    } catch (error) {
      consentState = null;
    }

    if (consentState === null) {
      clearConsent();
      showConsentBanner(
        () => {
          start();
        },
        () => {
          destroy();
        }
      );
    }
  }

  activeDestroy = destroy;
  return destroy;
}
