const express = require("express");

const Event = require("../models/Event");
const { validateEvents } = require("../middleware/validate");

const router = express.Router();

const isValidDate = (value) => !Number.isNaN(new Date(value).getTime());
const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

const sanitizeEvent = (event, projectId) => {
	if (!event || typeof event !== "object" || Array.isArray(event)) {
		return { error: "Each event must be an object" };
	}

	const { eventType, pageUrl, timestamp } = event;

	if (eventType !== "click" && eventType !== "scroll") {
		return { error: "eventType must be either click or scroll" };
	}

	if (!pageUrl || typeof pageUrl !== "string") {
		return { error: "pageUrl is required for each event" };
	}

	if (!timestamp || !isValidDate(timestamp)) {
		return { error: "timestamp must be a valid ISO date for each event" };
	}

	const sanitized = {
		projectId,
		pageUrl,
		eventType,
		timestamp: new Date(timestamp)
	};

	if (eventType === "click") {
		if (!isNumber(event.x) || !isNumber(event.y)) {
			return { error: "click events must include numeric x and y" };
		}

		sanitized.x = event.x;
		sanitized.y = event.y;

		if (event.xPercent !== undefined) {
			if (!isNumber(event.xPercent)) {
				return { error: "xPercent must be a number when provided" };
			}
			sanitized.xPercent = event.xPercent;
		}

		if (event.yPercent !== undefined) {
			if (!isNumber(event.yPercent)) {
				return { error: "yPercent must be a number when provided" };
			}
			sanitized.yPercent = event.yPercent;
		}
	}

	if (eventType === "scroll") {
		if (!isNumber(event.scrollDepth)) {
			return { error: "scroll events must include numeric scrollDepth" };
		}

		if (event.scrollDepth < 0 || event.scrollDepth > 100) {
			return { error: "scrollDepth must be between 0 and 100" };
		}

		sanitized.scrollDepth = event.scrollDepth;
	}

	return { sanitized };
};

router.post("/", validateEvents, async (req, res, next) => {
	try {
		const { projectId, events } = req.body;
		const sanitizedEvents = [];

		for (const event of events) {
			const result = sanitizeEvent(event, projectId);
			if (result.error) {
				return res.status(400).json({ error: result.error });
			}
			sanitizedEvents.push(result.sanitized);
		}

		await Event.insertMany(sanitizedEvents);

		return res.status(201).json({
			message: "Events ingested successfully",
			insertedCount: sanitizedEvents.length
		});
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
