import express from "express";
import { getCollection } from "../mongo.js";
import { authRequired } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Test endpoint to verify routes are working
router.get("/test", (req, res) => {
  console.log('🧪 Verification routes test endpoint hit');
  res.json({ message: "Verification routes are working!", timestamp: new Date().toISOString() });
});

// Get reports pending analyst verification
router.get("/analyst/pending", authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'analyst') {
      return res.status(403).json({ error: "Access denied. Analyst role required." });
    }

    const reports = await getCollection('reports');
    const users = await getCollection('users');

    const rows = await reports
      .find({ $or: [{ status: 'submitted' }, { status: 'in_review' }] })
      .sort({ created_at: 1 })
      .limit(100)
      .toArray();

    const userIds = [...new Set(rows.map(r => r.user_id))];
    const userDocs = await users
      .find({ _id: { $in: userIds.map(id => new ObjectId(String(id))) } })
      .project({ name: 1, location: 1 })
      .toArray();
    const userMap = new Map(userDocs.map(u => [String(u._id), u]));

    const out = rows.map(r => ({
      ...r,
      id: String(r._id),
      reporter_name: userMap.get(String(r.user_id))?.name || null,
      reporter_location: userMap.get(String(r.user_id))?.location || null,
    }));

    res.json(out);
  } catch (e) {
    console.error('Error in analyst/pending:', e);
    res.status(500).json({ error: "Server error" });
  }
});

// Analyst verifies a report
router.post("/analyst/verify/:reportId", authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'analyst') {
      return res.status(403).json({ error: "Access denied. Analyst role required." });
    }

    const { reportId } = req.params;
    const { verified, notes } = req.body;

    if (typeof verified !== 'boolean') {
      return res.status(400).json({ error: "Verified field must be boolean" });
    }

    const status = verified ? 'verified' : 'rejected';

    const reports = await getCollection('reports');
    const result = await reports.findOneAndUpdate(
      { _id: new ObjectId(reportId) },
      { $set: { status, updated_at: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ 
      success: true, 
      report: { ...result.value, id: String(result.value._id) },
      message: verified ? "Report verified successfully" : "Report rejected"
    });
  } catch (e) {
    console.error('❌ Error in analyst verification:', e);
    res.status(500).json({ error: "Server error" });
  }
});

// Get reports pending officer verification
router.get("/officer/pending", authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ error: "Access denied. Officer role required." });
    }

    const reports = await getCollection('reports');
    const users = await getCollection('users');

    const rows = await reports
      .find({ status: 'verified' })
      .sort({ updated_at: 1 })
      .limit(100)
      .toArray();

    const userIds = [...new Set(rows.map(r => r.user_id))];
    const userDocs = await users
      .find({ _id: { $in: userIds.map(id => new ObjectId(String(id))) } })
      .project({ name: 1, location: 1 })
      .toArray();
    const userMap = new Map(userDocs.map(u => [String(u._id), u]));

    const out = rows.map(r => ({
      ...r,
      id: String(r._id),
      reporter_name: userMap.get(String(r.user_id))?.name || null,
      reporter_location: userMap.get(String(r.user_id))?.location || null,
    }));

    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Officer verifies a report and optionally generates alert
router.post("/officer/verify/:reportId", authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ error: "Access denied. Officer role required." });
    }

    const { reportId } = req.params;
    const { verified, notes, generateAlert, alertType, severity, alertMessage, affectedArea } = req.body;

    if (typeof verified !== 'boolean') {
      return res.status(400).json({ error: "Verified field must be boolean" });
    }

    const status = verified ? 'verified' : 'rejected';

    const reports = await getCollection('reports');
    const result = await reports.findOneAndUpdate(
      { _id: new ObjectId(reportId) },
      { $set: { status, updated_at: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ 
      success: true, 
      report: { ...result.value, id: String(result.value._id) },
      message: verified ? "Report verified successfully" : "Report rejected"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all alerts (simplified for now)
router.get("/alerts", authRequired, async (req, res) => {
  try {
    res.json([]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user notifications (simplified for now)
router.get("/notifications", authRequired, async (req, res) => {
  try {
    res.json([]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Mark notification as read (simplified for now)
router.put("/notifications/:notificationId/read", authRequired, async (req, res) => {
  try {
    res.json({ success: true, message: "Notification marked as read" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
