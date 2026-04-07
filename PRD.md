# Real-Time Heatmap Analytics Platform
### Project Requirements Document

> **Version:** 1.0 | **Date:** April 2026 | **Status:** Draft | **Stack:** MERN (MongoDB, Express, React, Node.js)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Scope](#2-project-scope)
3. [Stakeholders & User Roles](#3-stakeholders--user-roles)
4. [System Architecture](#4-system-architecture)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Privacy & Compliance](#7-privacy--compliance)
8. [Technology Stack](#8-technology-stack)
9. [Milestones & Delivery Plan](#9-milestones--delivery-plan)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Success Metrics](#11-success-metrics)
12. [Glossary](#12-glossary)

---

## 1. Executive Summary

The **Real-Time Heatmap Analytics Platform** is a developer-focused analytics tool that enables website owners to understand how their users interact with their pages. By installing a single npm package, website owners gain access to real-time click and scroll tracking, visualised as interactive heatmaps and charts in a dedicated dashboard.

Unlike heavyweight analytics suites, this platform is designed to be **lightweight**, **privacy-first**, and **plug-and-play** — requiring minimal configuration while delivering maximum insight.

> 💡 **One-Line Pitch**
>
> *"A lightweight npm-based analytics platform that allows developers to track user interactions and visualise them as real-time heatmaps using a MERN architecture."*

---

## 2. Project Scope

### 2.1 In Scope

- NPM tracker package for client-side event capture
- Express.js REST API backend for data ingestion and retrieval
- MongoDB database for storing interaction events
- React dashboard with heatmap and chart visualisations
- Consent-based, anonymous tracking (GDPR / DPDPA 2023 compliant)
- Real-time data updates from tracker to dashboard

### 2.2 Out of Scope

- User authentication and multi-tenant account management *(v2)*
- Session replay or video recording of user sessions
- A/B testing or experimentation features
- Native mobile app SDKs (iOS / Android)
- Email or Slack reporting integrations

---

## 3. Stakeholders & User Roles

| Role | Description | Primary Actions |
|---|---|---|
| **Website Owner** | Installs the tracker and owns the dashboard | View heatmaps, configure projects |
| **End User** | Visits the tracked website (data subject) | Clicks, scrolls, navigates pages |
| **Developer** | Integrates and maintains the npm package | `npm install`, initialise tracker |
| **System Admin** | Manages the backend server and database | Deploy, monitor, scale services |

---

## 4. System Architecture

The platform follows a four-layer MERN architecture. Each layer is independently deployable and communicates over well-defined REST APIs.

### 4.1 Component Overview

| Component | Technology | Deployment | Responsibility |
|---|---|---|---|
| **NPM Tracker** | Vanilla JS | Client browser | Capture and transmit events |
| **Backend API** | Node.js + Express | Cloud server | Validate, store, serve data |
| **Database** | MongoDB | Atlas / self-hosted | Persist interaction events |
| **Dashboard** | React + Chart.js | CDN / static host | Visualise heatmaps and analytics |

### 4.2 Full System Flow

```
[NPM Tracker]  →  [User Browser]  →  [Express API]  →  [MongoDB]  →  [React Dashboard]  →  [Heatmap + Charts]
```

### 4.3 Data Flow — Step by Step

| Step | Action |
|---|---|
| **Step 1** | Website owner installs the npm package and adds one initialisation line to their app |
| **Step 2** | The tracker script loads when a user visits the website; a consent banner is displayed |
| **Step 3** | The user interacts — clicks, scrolls, and navigates pages |
| **Step 4** | The tracker captures X/Y coordinates, page URL, timestamp, and event type |
| **Step 5** | Captured events are batched and sent to the Express backend via HTTP POST |
| **Step 6** | The backend validates the payload, attaches the project ID, and stores it in MongoDB |
| **Step 7** | The website owner logs into the React dashboard and selects a project and page |
| **Step 8** | The dashboard fetches aggregated data and renders heatmaps and analytics charts in real time |

---

## 5. Functional Requirements

### 5.1 NPM Tracker Package

| ID | Requirement | Description |
|---|---|---|
| TR-01 | Click tracking | Capture click events with X, Y coordinates relative to the viewport |
| TR-02 | Scroll tracking | Capture scroll depth as a percentage of page height at regular intervals |
| TR-03 | Page URL capture | Record the full page URL for each event to enable page-level filtering |
| TR-04 | Timestamp logging | Attach an ISO 8601 timestamp to every event at the moment of capture |
| TR-05 | Batch transmission | Queue events locally and dispatch them in batches to reduce network overhead |
| TR-06 | Consent gate | Suppress all tracking until the end user grants consent via the banner |
| TR-07 | One-line init | The package must be fully operational after a single initialisation call |
| TR-08 | SPA support | Detect client-side route changes in React, Vue, and Angular applications |

### 5.2 Backend API

| ID | Requirement | Description |
|---|---|---|
| API-01 | Event ingestion | `POST /api/events` — accept an array of event objects from the tracker |
| API-02 | Input validation | Reject malformed or oversized payloads with appropriate 4xx responses |
| API-03 | Project routing | Associate each event with a project ID derived from the API key |
| API-04 | Heatmap aggregation | `GET /api/heatmap` — return aggregated click coordinates per page URL |
| API-05 | Analytics endpoint | `GET /api/analytics` — return click counts, scroll depth, and engagement stats |
| API-06 | CORS configuration | Allow cross-origin requests from registered tracker domains only |
| API-07 | Rate limiting | Limit inbound event requests to prevent abuse and data flooding |

### 5.3 Database (MongoDB)

| ID | Requirement | Description |
|---|---|---|
| DB-01 | Event schema | Store `projectId`, `pageUrl`, `eventType`, `x`, `y`, `scrollDepth`, and `timestamp` per event |
| DB-02 | Indexing | Index on `projectId + pageUrl + timestamp` for efficient dashboard queries |
| DB-03 | Data partitioning | Organise collections by project to allow isolated queries and easy deletion |
| DB-04 | TTL policy | Auto-expire raw events after a configurable retention period (default: 90 days) |

### 5.4 React Dashboard

| ID | Requirement | Description |
|---|---|---|
| DASH-01 | Heatmap view | Overlay click density on a page screenshot using heatmap.js |
| DASH-02 | Analytics charts | Display click count, scroll depth, and engagement rate using Chart.js |
| DASH-03 | Project selector | Allow the owner to switch between tracked projects |
| DASH-04 | Page URL filter | Filter all views by a specific page URL within a project |
| DASH-05 | Date range filter | Filter data by custom date ranges (today, last 7 days, custom) |
| DASH-06 | Real-time updates | Refresh heatmap and chart data automatically every 30 seconds |
| DASH-07 | Responsive layout | Dashboard must be usable on desktop and tablet screen sizes |

---

## 6. Non-Functional Requirements

### 6.1 Performance

- Tracker bundle size must not exceed **10 KB** (gzipped)
- Event batch transmission must complete within **200 ms** on a standard 4G connection
- Dashboard heatmap must render within **2 seconds** for up to 50,000 data points
- Backend API must handle at least **1,000 concurrent** event submissions per second

### 6.2 Reliability

- API uptime target: **99.5% monthly SLA**
- Events must be queued locally if the backend is unreachable and retried on reconnection
- Database writes must be acknowledged before the API returns a `200` response

### 6.3 Security

- All API communication must use **HTTPS / TLS 1.2** or higher
- API keys must be validated on every inbound request
- No personally identifiable information (PII) may be stored — IP addresses must be hashed or dropped
- Input sanitisation must prevent injection attacks on all database writes

### 6.4 Scalability

- The backend must be horizontally scalable behind a load balancer
- MongoDB must support sharding for projects exceeding 10 million events
- The tracker must function correctly in both multi-page and single-page application contexts

---

## 7. Privacy & Compliance

Privacy is a first-class concern. The platform is designed to comply with both European and Indian data protection frameworks.

> **Applicable Regulations**
> - **GDPR** — General Data Protection Regulation (EU)
> - **DPDPA 2023** — Digital Personal Data Protection Act (India)

### 7.1 Compliance Requirements

| ID | Requirement | Description |
|---|---|---|
| PRIV-01 | Consent banner | Display a clear consent notice before any tracking begins |
| PRIV-02 | Opt-out mechanism | Allow users to withdraw consent at any time; tracking must stop immediately |
| PRIV-03 | No PII collection | Do not capture names, emails, IP addresses, or device fingerprints |
| PRIV-04 | Anonymous events | All events must be fully anonymous and non-linkable to individual users |
| PRIV-05 | Data retention | Raw event data must be deleted after the configured retention period |
| PRIV-06 | Privacy notice | Website owner must provide a privacy notice informing users of analytics tracking |

---

## 8. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Tracker | Vanilla JavaScript (ES6+) | Lightweight browser-side event capture |
| Package distribution | npm registry | One-line developer installation |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB + Mongoose | Event storage and querying |
| Frontend | React.js | Dashboard SPA |
| Heatmap | heatmap.js | Click density visualisation |
| Charts | Chart.js | Analytics graphs and metrics |
| Hosting (API) | Node server / Docker | Cloud-deployable backend |
| Hosting (UI) | Vercel / Netlify | Static dashboard deployment |

---

## 9. Milestones & Delivery Plan

| Phase | Milestone | Duration | Deliverables |
|---|---|---|---|
| Phase 1 | Tracker MVP | Week 1–2 | npm package: click + scroll capture, batch send |
| Phase 2 | Backend API | Week 2–3 | Event ingestion, validation, MongoDB storage |
| Phase 3 | Dashboard MVP | Week 3–4 | Heatmap view, basic chart, page filter |
| Phase 4 | Privacy Layer | Week 4 | Consent banner, opt-out, PII stripping |
| Phase 5 | Polish & Demo | Week 5 | Real-time updates, responsive UI, demo script |

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Tracker script slows down host website | 🔴 High | Keep bundle under 10 KB; load script asynchronously after page load |
| High event volume overwhelms backend | 🔴 High | Implement rate limiting, event batching, and horizontal scaling |
| Privacy regulation non-compliance | 🔴 High | Enforce consent gate; store no PII; document data flows |
| Ad blockers blocking tracker requests | 🟡 Medium | Use a first-party subdomain for the API endpoint |
| Dashboard performance on large datasets | 🟡 Medium | Aggregate data server-side; paginate chart queries; cache responses |

---

## 11. Success Metrics

The project will be considered successful at the hackathon demo stage when all of the following criteria are met:

- [ ] Tracker installs and initialises with a single `npm` command and one line of code
- [ ] End-to-end latency from a user click to a heatmap update is under **5 seconds** in the demo environment
- [ ] Heatmap accurately reflects the distribution of clicks across the demo page
- [ ] Consent banner appears on first visit and suppresses tracking when declined
- [ ] Dashboard renders correctly on a 1080p display with no visual errors
- [ ] Judges can independently install the package and see their clicks appear in the dashboard within **60 seconds**

---

## 12. Glossary

| Term | Definition |
|---|---|
| **Heatmap** | A visual overlay showing interaction density — red for high activity, blue for low |
| **Tracker** | The JavaScript npm package installed on the website owner's site |
| **Event** | A single captured user interaction: a click or a scroll-depth record |
| **Project ID** | A unique identifier that groups all events from one tracked website |
| **MERN** | MongoDB, Express, React, Node.js — the full-stack JavaScript architecture used |
| **GDPR** | General Data Protection Regulation — EU regulation governing personal data |
| **DPDPA 2023** | Digital Personal Data Protection Act 2023 — India's data protection law |
| **PII** | Personally Identifiable Information — any data that can identify a real person |
| **SPA** | Single Page Application — a web app that loads once and navigates client-side |
| **TTL** | Time-to-Live — the duration after which stored data is automatically deleted |

---

*Confidential — Internal Use Only*