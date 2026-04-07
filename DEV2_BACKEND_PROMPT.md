# 🛠️ Developer 2 — Backend API
### Heatmap Analytics Platform | Your Task Brief

> **Copy everything below the line and paste it into Claude (VS Code / Claude Code / any AI coding tool)**

---

---

You are an expert Node.js developer. Build a complete Express.js backend API for a heatmap analytics platform.

---

## PROJECT GOAL
A REST API server that:
- Receives user interaction events from a browser tracker script
- Stores them in MongoDB
- Serves aggregated data to a React dashboard

---

## FOLDER STRUCTURE TO CREATE

```
backend/
├── src/
│   ├── server.js
│   ├── routes/
│   │   ├── events.js
│   │   ├── heatmap.js
│   │   └── analytics.js
│   ├── models/
│   │   └── Event.js
│   └── middleware/
│       ├── validate.js
│       └── rateLimit.js
├── .env.example
├── package.json
└── README.md
```

---

## FILE SPECIFICATIONS

### package.json
- name: "heatmap-backend"
- scripts: start, dev (nodemon), test
- dependencies: express, mongoose, cors, dotenv, express-rate-limit
- devDependencies: nodemon

---

### .env.example
```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/heatmap
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

### src/models/Event.js
Mongoose schema with these exact fields:
- projectId: String, required, indexed
- pageUrl: String, required, indexed
- eventType: String, enum: ["click", "scroll"], required
- x: Number (click X coordinate)
- y: Number (click Y coordinate)
- xPercent: Number
- yPercent: Number
- scrollDepth: Number (scroll percentage 0–100)
- timestamp: Date, required, indexed
- createdAt: Date, default: Date.now, expires: 7776000 (90-day TTL auto-delete)

---

### src/routes/events.js — POST /api/events

The tracker script sends this exact payload:
```json
{
  "projectId": "test-project-001",
  "events": [
    {
      "eventType": "click",
      "x": 540,
      "y": 320,
      "xPercent": 50.2,
      "yPercent": 41.6,
      "pageUrl": "http://localhost/test",
      "timestamp": "2026-04-07T10:23:00.000Z"
    },
    {
      "eventType": "scroll",
      "scrollDepth": 45.5,
      "pageUrl": "http://localhost/test",
      "timestamp": "2026-04-07T10:23:05.000Z"
    }
  ]
}
```

Requirements:
- Validate: projectId must exist, events must be array, max 50 events per batch
- Strip any fields not in the schema (no PII stored)
- Bulk insert into MongoDB using insertMany
- Return 201 on success, 400 on validation error, 429 on rate limit

---

### src/routes/heatmap.js — GET /api/heatmap

Query params: `projectId` (required), `pageUrl` (required), `startDate` (optional), `endDate` (optional)

- Filter only click events (eventType: "click")
- Filter by date range if provided
- Return this exact shape:
```json
{
  "points": [
    { "x": 540, "y": 320, "xPercent": 50.2, "yPercent": 41.6, "value": 1 }
  ],
  "total": 1
}
```
- Cap response at 10,000 data points max
- value is always 1 (heatmap.js uses it for intensity)

---

### src/routes/analytics.js — GET /api/analytics

Query params: `projectId` (required), `pageUrl` (required), `startDate` (optional), `endDate` (optional)

Return this exact shape:
```json
{
  "totalClicks": 0,
  "totalScrollEvents": 0,
  "avgScrollDepth": 0,
  "maxScrollDepth": 0,
  "clicksPerHour": [
    { "hour": 0, "count": 0 },
    { "hour": 1, "count": 0 }
  ],
  "topPages": [
    { "pageUrl": "http://example.com/page", "clicks": 10 }
  ]
}
```
- Use MongoDB aggregation pipeline for all calculations
- clicksPerHour must have all 24 hours (fill missing hours with count: 0)

---

### src/middleware/validate.js
- `validateEvents` middleware: check projectId is string, events is array, length <= 50
- `validateQuery` middleware: check projectId and pageUrl are present in query string
- Return 400 with clear error message on failure

---

### src/middleware/rateLimit.js
- Use express-rate-limit
- POST /api/events: 100 requests per minute per IP
- GET routes: 60 requests per minute per IP
- Return 429 with message "Too many requests" on limit hit

---

### src/server.js
- Load dotenv at top
- Connect to MongoDB via mongoose with retry logic
- Apply CORS — allow origins from ALLOWED_ORIGINS env variable
- Apply JSON body parser with 1mb limit
- Apply rate limiting middleware
- Mount routes:
  - POST /api/events → events router
  - GET /api/heatmap → heatmap router
  - GET /api/analytics → analytics router
  - GET /health → return { status: "ok", timestamp: new Date() }
- Global error handler middleware at the bottom (catch-all)
- Listen on PORT from env (default 3000)

---

### README.md
Include:
- Setup steps (clone, npm install, copy .env.example to .env, fill MongoDB URI)
- How to get a free MongoDB Atlas URI (brief steps)
- All API endpoints documented with example curl commands
- Note that authentication is v2 (not in this version)

---

## REQUIREMENTS
- No authentication for hackathon (add TODO comment in server.js)
- All responses must be JSON with Content-Type: application/json
- CORS must allow the tracker to POST from any origin in development
- Never log request body (privacy — events contain coordinates)
- Log only: request method, route, status code, response time
- MongoDB connection must handle disconnect/reconnect automatically (mongoose does this)
- Return clear error messages for all 400 responses

---

## AFTER GENERATING ALL FILES show me:

1. Exact terminal commands to install dependencies and start the server
2. How to create a free MongoDB Atlas cluster and get the connection URI
3. These exact curl commands to test all endpoints:

```bash
# Test health check
curl http://localhost:3000/health

# Test event ingestion (simulates what the tracker sends)
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"projectId":"test-project-001","events":[{"eventType":"click","x":540,"y":320,"xPercent":50.2,"yPercent":41.6,"pageUrl":"http://localhost/test","timestamp":"2026-04-07T10:23:00.000Z"}]}'

# Test heatmap endpoint
curl "http://localhost:3000/api/heatmap?projectId=test-project-001&pageUrl=http://localhost/test"

# Test analytics endpoint
curl "http://localhost:3000/api/analytics?projectId=test-project-001&pageUrl=http://localhost/test"
```

4. What the MongoDB Atlas free tier limits are and if they are enough for the hackathon
