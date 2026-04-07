const express = require("express");

const Event = require("../models/Event");
const { validateQuery } = require("../middleware/validate");

const router = express.Router();
const MAX_POINTS = 10000;

router.get("/", validateQuery, async (req, res, next) => {
	try {
		const { projectId, pageUrl, startDate, endDate } = req.query;

		const filter = {
			projectId,
			eventType: "click"
		};

		if (pageUrl) {
			filter.pageUrl = pageUrl;
		}

		if (startDate || endDate) {
			filter.timestamp = {};
			if (startDate) {
				filter.timestamp.$gte = new Date(startDate);
			}
			if (endDate) {
				filter.timestamp.$lte = new Date(endDate);
			}
		}

		const points = await Event.find(filter)
			.sort({ timestamp: -1 })
			.limit(MAX_POINTS)
			.select({ _id: 0, x: 1, y: 1, xPercent: 1, yPercent: 1 })
			.lean();

		const formattedPoints = points.map((point) => ({
			x: point.x,
			y: point.y,
			xPercent: point.xPercent,
			yPercent: point.yPercent,
			value: 1
		}));

		return res.status(200).json({
			points: formattedPoints,
			total: formattedPoints.length
		});
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
