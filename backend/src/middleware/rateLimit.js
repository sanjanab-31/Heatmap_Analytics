const rateLimit = require("express-rate-limit");

const tooManyRequestsHandler = (_req, res) => {
	res.status(429).json({ message: "Too many requests" });
};

const eventIngestionLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	handler: tooManyRequestsHandler
});

const getRoutesLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 60,
	standardHeaders: true,
	legacyHeaders: false,
	handler: tooManyRequestsHandler
});

module.exports = {
	eventIngestionLimiter,
	getRoutesLimiter
};
