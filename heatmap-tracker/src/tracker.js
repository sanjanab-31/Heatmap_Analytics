import { EventSender } from "./sender";

export class HeatmapTracker {
  constructor(options = {}) {
    this.sender = new EventSender(options.sender || {});
    this.sampleRate = Number(options.sampleRate || 0.15);
    this.scrollDebounceMs = Number(options.scrollDebounceMs || 250);

    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onUnload = this.onUnload.bind(this);

    this.scrollTimeout = null;
    this.running = false;
  }

  start() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.sender.start();

    document.addEventListener("click", this.onClick, { passive: true });
    document.addEventListener("mousemove", this.onMouseMove, { passive: true });
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("beforeunload", this.onUnload);
  }

  stop() {
    if (!this.running) {
      return;
    }

    this.running = false;

    document.removeEventListener("click", this.onClick);
    document.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("beforeunload", this.onUnload);

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }

    this.sender.stop();
  }

  onClick(event) {
    this.sender.enqueue(this.baseEvent("click", event.clientX, event.clientY));
  }

  onMouseMove(event) {
    // Sample high-frequency moves to reduce network noise.
    if (Math.random() > this.sampleRate) {
      return;
    }

    this.sender.enqueue(this.baseEvent("mousemove", event.clientX, event.clientY));
  }

  onScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      const viewportX = Math.round(window.innerWidth / 2);
      const viewportY = Math.round(window.innerHeight / 2);
      this.sender.enqueue(this.baseEvent("scroll", viewportX, viewportY));
    }, this.scrollDebounceMs);
  }

  onUnload() {
    this.sender.stop();
  }

  baseEvent(type, x, y) {
    return {
      type,
      x,
      y,
      pageX: Math.round(x + window.scrollX),
      pageY: Math.round(y + window.scrollY),
      path: window.location.pathname,
      ts: Date.now(),
    };
  }
}
