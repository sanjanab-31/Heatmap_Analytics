const DEFAULT_ENDPOINT = "/api/heatmap-events";

export class EventSender {
  constructor(options = {}) {
    this.endpoint = options.endpoint || DEFAULT_ENDPOINT;
    this.maxBatchSize = Number(options.maxBatchSize || 25);
    this.flushIntervalMs = Number(options.flushIntervalMs || 5000);
    this.headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    this.queue = [];
    this.timerId = null;
  }

  start() {
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => {
      this.flush();
    }, this.flushIntervalMs);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    return this.flush();
  }

  enqueue(event) {
    this.queue.push(event);
    if (this.queue.length >= this.maxBatchSize) {
      return this.flush();
    }

    return Promise.resolve();
  }

  async flush() {
    if (this.queue.length === 0) {
      return;
    }

    const payload = this.queue.splice(0, this.maxBatchSize);
    const body = JSON.stringify({ events: payload });

    // Prefer Beacon for page unload resilience.
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon(this.endpoint, blob);
      if (sent) {
        return;
      }
    }

    await fetch(this.endpoint, {
      method: "POST",
      headers: this.headers,
      body,
      keepalive: true,
    });
  }
}
