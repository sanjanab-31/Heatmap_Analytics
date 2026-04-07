# heatmap-tracker

`heatmap-tracker` is a lightweight browser analytics package that captures click coordinates and scroll depth, batches events, and waits for user consent before tracking anything.

## Installation

```bash
npm install heatmap-tracker
```

## Usage

```html
<script src="./dist/tracker.min.js"></script>
<script>
  HeatmapTracker.init({ apiKey: "your-api-key", endpoint: "/api/events", projectId: "project-123" });
</script>
```

## `init()` Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | string | No | Sent as the `x-api-key` request header when events are posted. |
| `endpoint` | string | Yes | Backend URL that receives batched events. |
| `projectId` | string | Yes | Identifier attached to every batch payload. |

## Privacy

The tracker does not collect names, emails, IP addresses, or device fingerprints. It only records anonymous interaction data such as click coordinates, scroll depth, page URL, and timestamps after consent is granted.

## Build From Source

```bash
npm install
npm run build
```

For watch mode:

```bash
npm run dev
```

## Local Test Page

Open `test/index.html` in a browser after building the package. The page stubs network transport and logs captured payloads to the console so you can verify click and scroll events without a backend.
