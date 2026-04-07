require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const eventsRouter = require("./routes/events");
const heatmapRouter = require("./routes/heatmap");
const analyticsRouter = require("./routes/analytics");
const projectsRouter = require("./routes/projects");
const recordingsRouter = require("./routes/recordings");
const { eventIngestionLimiter, getRoutesLimiter } = require("./middleware/rateLimit");

const app = express();
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/heatmap";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions = {
	origin(origin, callback) {
		if (!origin) {
			return callback(null, true);
		}

		if (process.env.NODE_ENV !== "production") {
			return callback(null, true);
		}

		if (allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		return callback(new Error("Origin not allowed by CORS"));
	}
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

// Privacy-safe request logging: method, route, status code, response time only.
app.use((req, res, next) => {
	const startTime = Date.now();

	res.on("finish", () => {
		const responseTime = Date.now() - startTime;
		const route = req.originalUrl || req.url;
		console.log(`${req.method} ${route} ${res.statusCode} ${responseTime}ms`);
	});

	next();
});

// TODO(v2): Add authentication and API key validation.
app.get("/health", (_req, res) => {
	res.status(200).json({
		status: "ok",
		timestamp: new Date()
	});
});

app.use("/api/events", eventIngestionLimiter, eventsRouter);
app.use("/api/heatmap", getRoutesLimiter, heatmapRouter);
app.use("/api/analytics", getRoutesLimiter, analyticsRouter);
app.use("/api/projects", getRoutesLimiter, projectsRouter);
app.use("/api/recordings", getRoutesLimiter, recordingsRouter);

app.use((_req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
	const statusCode = err.statusCode || err.status || 500;
	const message = statusCode >= 500 ? "Internal server error" : err.message;

	res.status(statusCode).json({ error: message });
});

mongoose.connection.on("connected", () => {
	console.log("MongoDB connected");
});

mongoose.connection.on("disconnected", () => {
	console.warn("MongoDB disconnected; mongoose will continue attempting to reconnect");
});

mongoose.connection.on("error", (error) => {
	console.error("MongoDB connection error:", error.message);
});

const wait = (ms) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

const connectToMongoWithRetry = async () => {
	if (!mongoUri) {
		throw new Error("MONGODB_URI is required in environment variables");
	}

	let retryDelayMs = 2000;
	const maxRetryDelayMs = 30000;

	while (true) {
		try {
			await mongoose.connect(mongoUri);
			return;
		} catch (error) {
			console.error(`MongoDB connect failed. Retrying in ${retryDelayMs}ms`);
			await wait(retryDelayMs);
			retryDelayMs = Math.min(retryDelayMs * 2, maxRetryDelayMs);
		}
	}
};

const startServer = async () => {
	await connectToMongoWithRetry();

	app.listen(port, () => {
		console.log(`Heatmap backend listening on port ${port}`);
	});
};

startServer().catch((error) => {
	console.error("Failed to start server:", error.message);
	process.exit(1);
});
