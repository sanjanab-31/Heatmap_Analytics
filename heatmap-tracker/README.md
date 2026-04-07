# heatmap-tracker

Lightweight browser heatmap event tracker with:

- `src/index.js`: main entry point
- `src/tracker.js`: core tracking logic
- `src/consent.js`: consent banner handling
- `src/sender.js`: event batching + HTTP send
- `dist/`: bundled output (generated)

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

For watch mode:

```bash
npm run dev
```

## Usage

```html
<script src="./dist/heatmap-tracker.min.js"></script>
<script>
  window.HeatmapTracker.init({
    sender: {
      endpoint: "/api/heatmap-events",
      maxBatchSize: 25,
      flushIntervalMs: 5000
    }
  });
</script>
```
