const STORAGE_KEY = "heatmap_consent";
const ACCEPTED_VALUE = "accepted";
const DECLINED_VALUE = "declined";
const BANNER_ID = "heatmap-consent-banner";
const BANNER_TEXT = "We use anonymous analytics to improve this website. No personal data is collected.";

function getStorage() {
  try {
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

function canUseDom() {
  return typeof document !== "undefined" && typeof window !== "undefined";
}

function setConsent(value) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    if (value) {
      storage.setItem(STORAGE_KEY, ACCEPTED_VALUE);
    } else {
      storage.setItem(STORAGE_KEY, DECLINED_VALUE);
    }
  } catch (error) {
    // Ignore storage failures in restricted browser environments.
  }
}

export function hasConsent() {
  const storage = getStorage();
  if (!storage) {
    return false;
  }

  try {
    return storage.getItem(STORAGE_KEY) === ACCEPTED_VALUE;
  } catch (error) {
    return false;
  }
}

export function clearConsent() {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Ignore storage failures in restricted browser environments.
  }
}

export function showConsentBanner(onAccept, onDecline) {
  if (!canUseDom()) {
    return;
  }

  const existingBanner = document.getElementById(BANNER_ID);
  if (existingBanner) {
    existingBanner.remove();
  }

  const banner = document.createElement("div");
  banner.id = BANNER_ID;
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.style.cssText = [
    "position:fixed",
    "left:0",
    "right:0",
    "bottom:0",
    "z-index:2147483647",
    "display:flex",
    "align-items:center",
    "justify-content:space-between",
    "gap:12px",
    "padding:14px 16px",
    "background:#111827",
    "color:#f9fafb",
    "border-top:1px solid rgba(255,255,255,0.12)",
    "box-shadow:0 -8px 24px rgba(0,0,0,0.18)",
    "font:14px/1.5 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif",
  ].join(";");

  const message = document.createElement("div");
  message.textContent = BANNER_TEXT;
  message.style.cssText = "flex:1 1 auto;min-width:0";

  const actions = document.createElement("div");
  actions.style.cssText = "display:flex;gap:8px;flex:0 0 auto";

  const createButton = (label, primary) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.style.cssText = [
      "border:0",
      "border-radius:999px",
      "padding:10px 14px",
      "cursor:pointer",
      "font:600 13px/1 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif",
      primary ? "background:#22c55e;color:#052e16" : "background:#374151;color:#f9fafb",
    ].join(";");
    return button;
  };

  const acceptButton = createButton("Accept", true);
  const declineButton = createButton("Decline", false);

  acceptButton.addEventListener("click", () => {
    setConsent(true);
    banner.remove();
    if (typeof onAccept === "function") {
      onAccept();
    }
  });

  declineButton.addEventListener("click", () => {
    setConsent(false);
    banner.remove();
    if (typeof onDecline === "function") {
      onDecline();
    }
  });

  actions.appendChild(declineButton);
  actions.appendChild(acceptButton);
  banner.appendChild(message);
  banner.appendChild(actions);

  (document.body || document.documentElement).appendChild(banner);
}
