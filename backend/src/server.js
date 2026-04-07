require("dotenv").config();

const cors = require("cors");
const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 3000;

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

app.use((_req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
	const statusCode = err.statusCode || err.status || 500;
	const message = statusCode >= 500 ? "Internal server error" : err.message;

	res.status(statusCode).json({ error: message });
});

app.listen(port, () => {
	console.log(`Heatmap backend listening on port ${port}`);
});
