const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	projectId: { type: String, required: true, index: true },
	pageUrl: { type: String, required: true, index: true },
	eventType: { type: String, enum: ["click", "scroll"], required: true },
	x: { type: Number },
	y: { type: Number },
	xPercent: { type: Number },
	yPercent: { type: Number },
	scrollDepth: { type: Number },
	timestamp: { type: Date, required: true, index: true },
	createdAt: { type: Date, default: Date.now, expires: 7776000 }
});

module.exports = mongoose.model("Event", eventSchema);
