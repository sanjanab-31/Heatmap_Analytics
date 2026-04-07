import terser from "@rollup/plugin-terser";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/heatmap-tracker.js",
      format: "iife",
      name: "HeatmapTracker",
      sourcemap: true,
    },
    {
      file: "dist/heatmap-tracker.min.js",
      format: "iife",
      name: "HeatmapTracker",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  treeshake: isProduction,
};
