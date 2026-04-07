const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    projectId: { type: String, required: true, unique: true, index: true },
    apiKeyLastFour: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);