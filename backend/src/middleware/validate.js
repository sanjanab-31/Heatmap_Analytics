const validateEvents = (req, res, next) => {
	const { projectId, events } = req.body || {};

	if (!projectId || typeof projectId !== "string") {
		return res.status(400).json({ error: "projectId must be a non-empty string" });
	}

	if (!Array.isArray(events)) {
		return res.status(400).json({ error: "events must be an array" });
	}

	if (events.length === 0) {
		return res.status(400).json({ error: "events array cannot be empty" });
	}

	if (events.length > 50) {
		return res.status(400).json({ error: "events array cannot exceed 50 items" });
	}

	return next();
};

const validateQuery = (req, res, next) => {
	const { projectId, pageUrl, startDate, endDate } = req.query || {};

	if (!projectId || typeof projectId !== "string") {
		return res.status(400).json({ error: "projectId query parameter is required" });
	}

	if (pageUrl !== undefined && pageUrl !== null && typeof pageUrl !== "string") {
		return res.status(400).json({ error: "pageUrl must be a string when provided" });
	}

	if (startDate && Number.isNaN(new Date(startDate).getTime())) {
		return res.status(400).json({ error: "startDate must be a valid ISO date" });
	}

	if (endDate && Number.isNaN(new Date(endDate).getTime())) {
		return res.status(400).json({ error: "endDate must be a valid ISO date" });
	}

	if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
		return res.status(400).json({ error: "startDate cannot be later than endDate" });
	}

	return next();
};

module.exports = {
	validateEvents,
	validateQuery
};
