# Heatmap Backend

Express + MongoDB backend API for the Heatmap Analytics Platform.

## Features

- Ingest click and scroll events in batches
- Store events in MongoDB with 90-day TTL cleanup
- Serve heatmap point data for a selected page
- Serve analytics metrics with aggregation pipelines
- Apply request validation and route-level rate limiting
- Return JSON responses for all endpoints

## Project Structure

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

## Setup

1. Open terminal in the backend folder.
2. Install dependencies.
3. Copy environment file.
4. Update MongoDB URI in `.env`.
5. Run the server.

### Exact terminal commands

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

For PowerShell copy command:

```powershell
Copy-Item .env.example .env
```

## Environment Variables

Use `.env.example` as a template:

```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/heatmap
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## MongoDB Atlas Setup (Free)

1. Go to the MongoDB Atlas website and create a free account.
2. Create a new project.
3. Create a new free cluster (M0).
4. In Database Access, create a database user (username/password).
5. In Network Access, add your current IP address (or `0.0.0.0/0` for hackathon testing only).
6. In Clusters, click Connect and choose Drivers.
7. Copy the connection string and replace `<user>`, `<pass>`, and database name.
8. Put the final URI in `MONGODB_URI` inside `.env`.

Example:

```
MONGODB_URI=mongodb+srv://myUser:myPassword@cluster0.xxxxx.mongodb.net/heatmap?retryWrites=true&w=majority
```

## API Endpoints

### Health

- `GET /health`
- Returns service status and timestamp

### Events Ingestion

- `POST /api/events`
- Validates payload (`projectId`, `events[]`, max 50)
- Sanitizes unknown fields before insert
- Inserts using `insertMany`

### Heatmap

- `GET /api/heatmap?projectId=...&pageUrl=...&startDate=...&endDate=...`
- Filters click events only
- Optional date range support
- Returns max 10,000 points

### Analytics

- `GET /api/analytics?projectId=...&pageUrl=...&startDate=...&endDate=...`
- Returns click and scroll totals, avg/max scroll depth
- Returns clicksPerHour with all 24 hours
- Returns topPages by click count

## Exact curl Test Commands

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

## Rate Limits

- `POST /api/events`: 100 requests/minute/IP
- GET routes: 60 requests/minute/IP
- Rate limit response: `429 { "message": "Too many requests" }`

## Privacy and Security Notes

- Request bodies are never logged
- Logs include only method, route, status, response time
- Unknown event fields are stripped before database insert
- CORS is open in development and restricted by `ALLOWED_ORIGINS` in production

## Authentication

Authentication is intentionally not included in this version (hackathon v1).

TODO in `src/server.js` notes authentication/API key validation for v2.

## MongoDB Atlas Free Tier Limits (Hackathon Fit)

Typical Atlas M0 free tier limits include:

- Shared cluster (not dedicated compute)
- Storage cap around 512 MB
- No guaranteed high-throughput performance under heavy load
- Basic monitoring and limited backup capabilities

Is it enough for a hackathon?

- Yes, for demos and moderate event traffic it is usually sufficient.
- If event volume spikes significantly, archive old data, reduce retention window, or move to a paid tier.
