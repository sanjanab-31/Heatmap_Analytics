let activeQueue = null;
let clickHandler = null;
let scrollHandler = null;
let scrollThrottleTimer = null;
let isTracking = false;

function getDocumentHeight() {
  const documentElement = document.documentElement;
  const body = document.body;

  return Math.max(
    documentElement ? documentElement.scrollHeight : 0,
    documentElement ? documentElement.offsetHeight : 0,
    body ? body.scrollHeight : 0,
    body ? body.offsetHeight : 0
  );
}

function enqueue(event) {
  if (activeQueue) {
    activeQueue.push(event);
  }
}

function createClickEvent(event) {
  const x = event.clientX;
  const y = event.clientY;

  return {
    x,
    y,
    xPercent: window.innerWidth > 0 ? (x / window.innerWidth) * 100 : 0,
    yPercent: window.innerHeight > 0 ? (y / window.innerHeight) * 100 : 0,
    pageUrl: window.location.href,
    eventType: "click",
    timestamp: new Date().toISOString(),
  };
}

function createScrollEvent() {
  const documentHeight = getDocumentHeight();
  const viewportHeight = window.innerHeight || 0;
  const scrollableDistance = Math.max(documentHeight - viewportHeight, 0);
  const scrollDepth = scrollableDistance > 0 ? (window.scrollY / scrollableDistance) * 100 : 0;

  return {
    scrollDepth,
    pageUrl: window.location.href,
    eventType: "scroll",
    timestamp: new Date().toISOString(),
  };
}

function onClick(event) {
  enqueue(createClickEvent(event));
}

function emitScrollEvent() {
  scrollThrottleTimer = null;
  enqueue(createScrollEvent());
}

function onScroll() {
  if (scrollThrottleTimer !== null) {
    return;
  }

  scrollThrottleTimer = window.setTimeout(emitScrollEvent, 500);
}

export function startTracking(queue) {
  if (isTracking) {
    return;
  }

  activeQueue = queue;
  clickHandler = onClick;
  scrollHandler = onScroll;
  isTracking = true;

  document.addEventListener("click", clickHandler, { passive: true });
  window.addEventListener("scroll", scrollHandler, { passive: true });
}

export function stopTracking() {
  if (!isTracking) {
    activeQueue = null;
    return;
  }

  document.removeEventListener("click", clickHandler);
  window.removeEventListener("scroll", scrollHandler);

  if (scrollThrottleTimer !== null) {
    clearTimeout(scrollThrottleTimer);
    scrollThrottleTimer = null;
  }

  activeQueue = null;
  clickHandler = null;
  scrollHandler = null;
  isTracking = false;
}
