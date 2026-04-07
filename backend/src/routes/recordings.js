const express = require("express");

const Event = require("../models/Event");

const router = express.Router();

const SESSION_GAP_MS = 30 * 60 * 1000;
const MAX_EVENTS = 5000;
const DEFAULT_LIMIT = 10;

const clampLimit = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_LIMIT;
  }
  return Math.max(1, Math.min(50, Math.round(parsed)));
};

const formatDuration = (seconds) => {
  const safe = Math.max(0, Math.round(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const buildEventLabel = (event) => {
  if (event.eventType === "click") {
    return `Click at (${Math.round(event.x || 0)}, ${Math.round(event.y || 0)})`;
  }

  return `Scroll depth ${Math.round(event.scrollDepth || 0)}%`;
};

const normalizePageUrl = (eventPageUrl, fallbackPageUrl) => eventPageUrl || fallbackPageUrl || "";

router.get("/", async (req, res, next) => {
  try {
    const { projectId, pageUrl } = req.query;
    const limit = clampLimit(req.query.limit);

    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ error: "projectId query parameter is required" });
    }

    if (pageUrl !== undefined && pageUrl !== null && typeof pageUrl !== "string") {
      return res.status(400).json({ error: "pageUrl must be a string when provided" });
    }

    const filter = { projectId };
    if (pageUrl) {
      filter.pageUrl = pageUrl;
    }

    const events = await Event.find(filter)
      .sort({ timestamp: 1 })
      .limit(MAX_EVENTS)
      .select({
        _id: 0,
        eventType: 1,
        x: 1,
        y: 1,
        xPercent: 1,
        yPercent: 1,
        scrollDepth: 1,
        pageUrl: 1,
        timestamp: 1
      })
      .lean();

    if (events.length === 0) {
      return res.status(200).json({ sessions: [] });
    }

    const sessions = [];
    let current = [];

    for (const event of events) {
      const previous = current[current.length - 1];
      if (!previous) {
        current.push(event);
        continue;
      }

      const gap = new Date(event.timestamp).getTime() - new Date(previous.timestamp).getTime();
      if (gap > SESSION_GAP_MS) {
        sessions.push(current);
        current = [event];
      } else {
        current.push(event);
      }
    }

    if (current.length > 0) {
      sessions.push(current);
    }

    const now = Date.now();

    const response = sessions
      .slice(-limit)
      .reverse()
      .map((sessionEvents, index) => {
        const startAt = new Date(sessionEvents[0].timestamp);
        const endAt = new Date(sessionEvents[sessionEvents.length - 1].timestamp);
        const durationSec = Math.max(1, Math.round((endAt.getTime() - startAt.getTime()) / 1000));

        const timeline = sessionEvents.map((event, eventIndex) => {
          const eventTimeSec = Math.max(
            0,
            Math.round((new Date(event.timestamp).getTime() - startAt.getTime()) / 1000)
          );

          return {
            id: `${startAt.getTime()}_${eventIndex}`,
            type: event.eventType,
            time: eventTimeSec,
            timestamp: new Date(event.timestamp).toISOString(),
            label: buildEventLabel(event),
            x: event.x,
            y: event.y,
            xPercent: event.xPercent,
            yPercent: event.yPercent,
            scrollDepth: event.scrollDepth,
            pageUrl: normalizePageUrl(event.pageUrl, pageUrl)
          };
        });

        return {
          id: `sess_${startAt.getTime()}_${index}`,
          user: `Visitor #${String((startAt.getTime() % 10000) + index).padStart(4, "0")}`,
          duration: formatDuration(durationSec),
          durationSec,
          interactions: sessionEvents.length,
          timestamp: startAt.toISOString(),
          location: "Unknown",
          browser: "Unknown",
          os: "Unknown",
          pages: new Set(sessionEvents.map((event) => normalizePageUrl(event.pageUrl, pageUrl))).size,
          status: now - endAt.getTime() <= 60 * 1000 ? "live" : "completed",
          pageUrl: normalizePageUrl(sessionEvents[sessionEvents.length - 1].pageUrl, pageUrl),
          events: timeline
        };
      });

    return res.status(200).json({ sessions: response });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;