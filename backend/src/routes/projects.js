const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");

const Event = require("../models/Event");
const Project = require("../models/Project");

const router = express.Router();

const generateProjectId = () => `proj_${crypto.randomBytes(4).toString("hex")}`;
const generateApiKey = () => `pk_${crypto.randomBytes(18).toString("hex")}`;

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const getEventStatsByProjectId = async () => {
  const stats = await Event.aggregate([
    {
      $group: {
        _id: "$projectId",
        totalClicks: {
          $sum: {
            $cond: [{ $eq: ["$eventType", "click"] }, 1, 0]
          }
        },
        totalSessions: { $sum: 1 },
        lastEventAt: { $max: "$timestamp" }
      }
    }
  ]);

  return new Map(stats.map((item) => [
    item._id,
    {
      totalClicks: item.totalClicks || 0,
      totalSessions: item.totalSessions || 0,
      lastEventAt: item.lastEventAt || null
    }
  ]));
};

router.get("/", async (_req, res, next) => {
  try {
    const [projects, statsByProjectId] = await Promise.all([
      Project.find({}).sort({ createdAt: -1 }).lean(),
      getEventStatsByProjectId()
    ]);

    const response = projects.map((project) => {
      const stats = statsByProjectId.get(project.projectId) || {
        totalClicks: 0,
        totalSessions: 0,
        lastEventAt: null
      };

      return {
        _id: project._id,
        name: project.name,
        domain: project.domain,
        projectId: project.projectId,
        apiKeyLastFour: project.apiKeyLastFour,
        status: project.status,
        totalClicks: stats.totalClicks,
        totalSessions: stats.totalSessions,
        lastEventAt: stats.lastEventAt,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      };
    });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const domain = typeof req.body?.domain === "string" ? req.body.domain.trim().toLowerCase() : "";

    if (!name || !domain) {
      return res.status(400).json({ error: "name and domain are required" });
    }

    if (domain.includes("http://") || domain.includes("https://")) {
      return res.status(400).json({ error: "domain should not include protocol" });
    }

    const existingDomain = await Project.findOne({ domain }).lean();
    if (existingDomain) {
      return res.status(409).json({ error: "A project with this domain already exists" });
    }

    let projectId = generateProjectId();
    while (await Project.exists({ projectId })) {
      projectId = generateProjectId();
    }

    const rawApiKey = generateApiKey();

    const created = await Project.create({
      name,
      domain,
      projectId,
      apiKeyLastFour: rawApiKey.slice(-4),
      status: "active"
    });

    return res.status(201).json({
      _id: created._id,
      name: created.name,
      domain: created.domain,
      projectId: created.projectId,
      apiKeyLastFour: created.apiKeyLastFour,
      status: created.status,
      totalClicks: 0,
      totalSessions: 0,
      lastEventAt: null,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      rawApiKey
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: "Project already exists" });
    }
    return next(error);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const status = req.body?.status;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    if (status !== "active" && status !== "inactive") {
      return res.status(400).json({ error: "status must be active or inactive" });
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const deleted = await Project.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }

    await Event.deleteMany({ projectId: deleted.projectId });

    return res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;