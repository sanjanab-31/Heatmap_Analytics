import { requestConsent } from "./consent";
import { HeatmapTracker } from "./tracker";

export async function initHeatmapTracker(options = {}) {
  const tracker = new HeatmapTracker(options);
  const consentGranted = options.requireConsent === false ? true : await requestConsent(options.consent || {});

  if (!consentGranted) {
    return {
      started: false,
      start: () => {},
      stop: () => {},
      tracker,
    };
  }

  tracker.start();

  return {
    started: true,
    start: () => tracker.start(),
    stop: () => tracker.stop(),
    tracker,
  };
}

if (typeof window !== "undefined") {
  window.HeatmapTracker = {
    init: initHeatmapTracker,
  };
}
