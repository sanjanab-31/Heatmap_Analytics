const express = require("express");

const Event = require("../models/Event");
const { validateQuery } = require("../middleware/validate");

const router = express.Router();

const buildDateMatch = (startDate, endDate) => {
	if (!startDate && !endDate) {
		return null;
	}

	const dateMatch = {};
	if (startDate) {
		dateMatch.$gte = new Date(startDate);
	}
	if (endDate) {
		dateMatch.$lte = new Date(endDate);
	}

	return dateMatch;
};

router.get("/", validateQuery, async (req, res, next) => {
	try {
		const { projectId, pageUrl, startDate, endDate } = req.query;
		const dateMatch = buildDateMatch(startDate, endDate);

		const baseMatch = {
			projectId,
			pageUrl
		};

		if (dateMatch) {
			baseMatch.timestamp = dateMatch;
		}

		const totalsPipeline = [
			{ $match: baseMatch },
			{
				$group: {
					_id: null,
					totalClicks: {
						$sum: {
							$cond: [{ $eq: ["$eventType", "click"] }, 1, 0]
						}
					},
					totalScrollEvents: {
						$sum: {
							$cond: [{ $eq: ["$eventType", "scroll"] }, 1, 0]
						}
					},
					scrollDepthSum: {
						$sum: {
							$cond: [
								{ $eq: ["$eventType", "scroll"] },
								{ $ifNull: ["$scrollDepth", 0] },
								0
							]
						}
					},
					maxScrollDepth: {
						$max: {
							$cond: [
								{ $eq: ["$eventType", "scroll"] },
								{ $ifNull: ["$scrollDepth", 0] },
								0
							]
						}
					}
				}
			}
		];

		const clicksPerHourPipeline = [
			{ $match: { ...baseMatch, eventType: "click" } },
			{
				$group: {
					_id: { $hour: "$timestamp" },
					count: { $sum: 1 }
				}
			},
			{ $project: { _id: 0, hour: "$_id", count: 1 } },
			{ $sort: { hour: 1 } }
		];

		const topPagesMatch = {
			projectId,
			eventType: "click"
		};
		if (dateMatch) {
			topPagesMatch.timestamp = dateMatch;
		}

		const topPagesPipeline = [
			{ $match: topPagesMatch },
			{
				$group: {
					_id: "$pageUrl",
					clicks: { $sum: 1 }
				}
			},
			{ $project: { _id: 0, pageUrl: "$_id", clicks: 1 } },
			{ $sort: { clicks: -1 } },
			{ $limit: 10 }
		];

		const [totalsResult, clicksPerHourResult, topPagesResult] = await Promise.all([
			Event.aggregate(totalsPipeline),
			Event.aggregate(clicksPerHourPipeline),
			Event.aggregate(topPagesPipeline)
		]);

		const totals = totalsResult[0] || {
			totalClicks: 0,
			totalScrollEvents: 0,
			scrollDepthSum: 0,
			maxScrollDepth: 0
		};

		const avgScrollDepth = totals.totalScrollEvents
			? totals.scrollDepthSum / totals.totalScrollEvents
			: 0;

		const countsByHour = new Map(
			clicksPerHourResult.map((item) => [item.hour, item.count])
		);

		const clicksPerHour = Array.from({ length: 24 }, (_, hour) => ({
			hour,
			count: countsByHour.get(hour) || 0
		}));

		return res.status(200).json({
			totalClicks: totals.totalClicks || 0,
			totalScrollEvents: totals.totalScrollEvents || 0,
			avgScrollDepth,
			maxScrollDepth: totals.maxScrollDepth || 0,
			clicksPerHour,
			topPages: topPagesResult
		});
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
