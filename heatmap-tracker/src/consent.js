const STORAGE_KEY = "heatmap_tracking_consent";

export function hasConsent() {
  return localStorage.getItem(STORAGE_KEY) === "granted";
}

export function setConsent(value) {
  localStorage.setItem(STORAGE_KEY, value ? "granted" : "denied");
}

export function getConsentState() {
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === "granted" || value === "denied") {
    return value;
  }

  return "unknown";
}

export function requestConsent(options = {}) {
  const state = getConsentState();
  if (state !== "unknown") {
    return Promise.resolve(state === "granted");
  }

  const message = options.message || "Help us improve this site by allowing anonymous usage tracking.";
  const allowLabel = options.allowLabel || "Allow";
  const denyLabel = options.denyLabel || "No thanks";

  return new Promise((resolve) => {
    const banner = document.createElement("div");
    banner.style.cssText = [
      "position:fixed",
      "left:16px",
      "right:16px",
      "bottom:16px",
      "z-index:99999",
      "padding:12px 14px",
      "border-radius:10px",
      "background:#111",
      "color:#fff",
      "display:flex",
      "gap:12px",
      "align-items:center",
      "justify-content:space-between",
      "font-family:system-ui,-apple-system,sans-serif",
      "font-size:14px",
    ].join(";");

    const text = document.createElement("span");
    text.textContent = message;

    const actions = document.createElement("div");
    actions.style.cssText = "display:flex;gap:8px;flex-shrink:0";

    const makeButton = (label, primary) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.style.cssText = [
        "border:0",
        "cursor:pointer",
        "padding:8px 12px",
        "border-radius:8px",
        "font-weight:600",
        primary ? "background:#2ea043;color:#fff" : "background:#30363d;color:#fff",
      ].join(";");
      return button;
    };

    const allowButton = makeButton(allowLabel, true);
    const denyButton = makeButton(denyLabel, false);

    allowButton.addEventListener("click", () => {
      setConsent(true);
      banner.remove();
      resolve(true);
    });

    denyButton.addEventListener("click", () => {
      setConsent(false);
      banner.remove();
      resolve(false);
    });

    actions.appendChild(denyButton);
    actions.appendChild(allowButton);

    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);
  });
}
