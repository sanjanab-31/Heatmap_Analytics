# Heatmap Tracker

Heatmap Tracker is a lightweight browser analytics package that captures click coordinates and scroll depth, batches events, and respects user consent before tracking starts.

## Table of Contents

- Overview
- Features
- Package Structure
- Installation
- Quick Start
- API Reference
- Event Schema
- Consent Flow
- Transport and Batching
- Browser Support
- Build and Development
- Local Testing
- Security and Protection
- Privacy
- Troubleshooting
- License

## Overview

This package is designed for low-overhead website interaction analytics. It records anonymous click and scroll behavior and sends batched events to your backend endpoint.

## Features

- Click tracking with viewport coordinates and percentages
- Scroll depth tracking with 500 ms throttle
- Shared queue for low-overhead event buffering
- Batch flush every 5 seconds
- Immediate flush when queue length exceeds 20
- sendBeacon support with fetch fallback
- Consent-first tracking behavior
- Cleanup support through destroy function

## Package Structure

- src/index.js: public initialization API
- src/tracker.js: click and scroll capture
- src/sender.js: queue flushing and network transport
- src/consent.js: consent banner and localStorage state
- dist/: bundled outputs for consumption
- test/index.html: manual browser test page

## Installation

Install with npm:

npm install heatmap-tracker

## Quick Start

Example:

<script src="./dist/tracker.min.js"></script>
<script>
  const destroy = HeatmapTracker.init({
    apiKey: "your-api-key",
    endpoint: "https://your-domain.com/api/events",
    projectId: "project-123"
  });
</script>

Call destroy() to remove listeners and stop sending events.

## API Reference

Function:

init(options)

Options:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| apiKey | string | No | Sent in x-api-key header for authenticated backend ingestion. |
| endpoint | string | Yes | Event ingestion URL. |
| projectId | string | Yes | Included in each payload batch. |

Return:

- destroy function

## Event Schema

Click event:

{
  "x": 412,
  "y": 188,
  "xPercent": 34.2,
  "yPercent": 23.5,
  "pageUrl": "https://site.com/home",
  "eventType": "click",
  "timestamp": "2026-04-07T12:34:56.789Z"
}

Scroll event:

{
  "scrollDepth": 61.4,
  "pageUrl": "https://site.com/home",
  "eventType": "scroll",
  "timestamp": "2026-04-07T12:35:01.234Z"
}

Payload sent to backend:

{
  "projectId": "project-123",
  "events": [
    { "eventType": "click" },
    { "eventType": "scroll" }
  ]
}

## Consent Flow

- Consent key stored in localStorage: heatmap_consent
- No tracking starts before acceptance
- Decline keeps tracking disabled
- Banner appears only when consent is not set

## Transport and Batching

- Flush interval: 5 seconds
- Immediate flush threshold: more than 20 queued events
- Uses sendBeacon where possible
- Uses fetch fallback
- If apiKey is present, fetch is used to include headers

## Browser Support

- Chrome
- Firefox
- Safari
- Edge

## Build and Development

Install dependencies:

npm install

Build:

npm run build

Watch mode:

npm run dev

## Local Testing

1. Build the package
2. Open test/index.html in a browser
3. Accept consent banner
4. Click test buttons and scroll page
5. Verify payload logs in browser console

## Security and Protection

Important: frontend JavaScript cannot be made fully secret once delivered to browsers. To protect your codebase and commercial usage:

1. Keep your source repository private.
2. Use private npm publishing or private registry distribution.
3. Enforce backend API key validation and domain allowlisting.
4. Rate-limit ingestion endpoints.
5. Use legal protection through a proprietary license.

This package is configured as private and unlicensed for public reuse by default.

## Privacy

This tracker is designed to collect anonymous interaction data only:

- click coordinates
- scroll depth
- page URL
- timestamp

It does not intentionally collect names, emails, passwords, or direct personal identifiers.

## Troubleshooting

- No events sent: confirm consent accepted and endpoint reachable.
- Header missing: ensure apiKey is passed to init.
- Publish blocked: verify npm access policy and token permissions.

## License

Proprietary. All rights reserved. See LICENSE.
