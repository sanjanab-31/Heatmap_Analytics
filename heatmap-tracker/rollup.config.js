const terser = require("@rollup/plugin-terser");

module.exports = {
  input: "src/index.js",
  output: [
    {
      file: "dist/tracker.esm.js",
      format: "esm",
    },
    {
      file: "dist/tracker.cjs.js",
      format: "cjs",
      exports: "named",
    },
    {
      file: "dist/tracker.min.js",
      format: "iife",
      name: "HeatmapTracker",
      plugins: [terser()],
    },
  ],
  treeshake: true,
};
