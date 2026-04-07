let activeQueue = null;
let activeEndpoint = "";
let activeProjectId = "";
let activeApiKey = "";
let flushTimer = null;
let isSending = false;
let flushQueued = false;
let originalQueuePush = null;

function buildHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  if (activeApiKey) {
    headers["x-api-key"] = activeApiKey;
  }

  return headers;
}

function buildPayload(events) {
  return JSON.stringify({
    projectId: activeProjectId,
    events,
  });
}

function sendWithBeacon(body) {
  if (!navigator.sendBeacon) {
    return false;
  }

  try {
    return navigator.sendBeacon(activeEndpoint, new Blob([body], { type: "application/json" }));
  } catch (error) {
    return false;
  }
}

async function sendWithFetch(body) {
  await fetch(activeEndpoint, {
    method: "POST",
    headers: buildHeaders(),
    body,
    keepalive: true,
  });
}

async function flushInternal() {
  if (isSending) {
    flushQueued = true;
    return;
  }

  if (!activeQueue || activeQueue.length === 0 || !activeEndpoint) {
    return;
  }

  isSending = true;
  const events = activeQueue.splice(0, activeQueue.length);
  const body = buildPayload(events);

  try {
    const beaconSent = !activeApiKey && sendWithBeacon(body);
    if (!beaconSent) {
      await sendWithFetch(body);
    }
  } catch (error) {
    console.log("heatmap-tracker flush failed", error);
  } finally {
    isSending = false;

    if (flushQueued || (activeQueue && activeQueue.length > 0)) {
      flushQueued = false;
      void flushInternal();
    }
  }
}

function scheduleFlush() {
  if (flushTimer !== null) {
    return;
  }

  flushTimer = window.setInterval(() => {
    void flushInternal();
  }, 5000);
}

export function startSender(queue, endpoint, projectId, apiKey = "") {
  activeQueue = queue;
  activeEndpoint = endpoint;
  activeProjectId = projectId;
  activeApiKey = apiKey;

  if (!originalQueuePush) {
    originalQueuePush = queue.push.bind(queue);
    queue.push = (...events) => {
      const result = originalQueuePush(...events);
      if (queue.length > 20) {
        void flushInternal();
      }
      return result;
    };
  }

  if (flushTimer === null) {
    scheduleFlush();
  }
}

export function stopSender() {
  const queueRef = activeQueue;

  if (flushTimer !== null) {
    clearInterval(flushTimer);
    flushTimer = null;
  }

  void flushInternal();

  activeQueue = null;
  activeEndpoint = "";
  activeProjectId = "";
  activeApiKey = "";
  flushQueued = false;
  isSending = false;

  if (queueRef && originalQueuePush) {
    queueRef.push = originalQueuePush;
  }

  originalQueuePush = null;
}
