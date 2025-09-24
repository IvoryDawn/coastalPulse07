import express from "express";
import { getCollection } from "../mongo.js";
import { authRequired } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get current user's profile
router.get("/me", authRequired, async (req, res) => {
  try {
    const users = await getCollection('users');
    const user = await users.findOne({ _id: new ObjectId(String(req.user.id)) }, {
      projection: { password_hash: 0 }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      phone: user.phone,
      bio: user.bio,
      profile_pic: user.profile_pic,
      created_at: user.created_at
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user's report statistics
router.get("/stats", authRequired, async (req, res) => {
  try {
    const userId = String(req.user.id);
    console.log('🔍 Fetching stats for user:', userId, 'role:', req.user.role);

    const reports = await getCollection('reports');

    const [totalReports, verifiedReports, thisMonthReports] = await Promise.all([
      reports.countDocuments({ user_id: userId }),
      reports.countDocuments({ user_id: userId, status: 'verified' }),
      reports.countDocuments({ user_id: userId, created_at: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } })
    ]);

    // Get profile views (mock data for now)
    const profileViews = 234;
    const weeklyViews = 12;

    const stats = {
      totalReports,
      verifiedReports,
      thisMonthReports,
      profileViews,
      weeklyViews,
      accuracy: totalReports > 0 ? Math.round((verifiedReports / totalReports) * 100) : 0
    };

    console.log('✅ Stats for user:', stats);
    res.json(stats);
  } catch (e) {
    console.error('❌ Error fetching user stats:', e);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user's recent reports
router.get("/reports", authRequired, async (req, res) => {
  try {
    const userId = String(req.user.id);
    console.log('🔍 Fetching reports for user:', userId, 'role:', req.user.role);

    const reports = await getCollection('reports');
    const rows = await reports
      .find({ user_id: userId })
      .project({ id: '$_id', event_type: 1, description: 1, location_name: 1, status: 1, created_at: 1 })
      .sort({ created_at: -1 })
      .limit(10)
      .toArray();
    const normalized = rows.map(r => ({
      id: String(r.id || r._id),
      event_type: r.event_type,
      description: r.description,
      location_name: r.location_name,
      status: r.status,
      created_at: r.created_at
    }));

    console.log('✅ Found', normalized.length, 'reports for user');
    res.json(normalized);
  } catch (e) {
    console.error('❌ Error fetching user reports:', e);
    res.status(500).json({ error: "Server error" });
  }
});

// Upload profile picture
router.post("/upload-picture", authRequired, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = String(req.user.id);
    const profilePicUrl = req.file.path; // Cloudinary URL or local file path

    const users = await getCollection('users');
    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { profile_pic: profilePicUrl } },
      { returnDocument: 'after', projection: { profile_pic: 1 } }
    );

    res.json({ 
      success: true, 
      profile_pic: result.value?.profile_pic,
      message: "Profile picture updated successfully" 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Update profile information
router.put("/update", authRequired, async (req, res) => {
  try {
    const userId = String(req.user.id);
    const { name, location, bio, phone } = req.body;

    const users = await getCollection('users');
    const updateDoc = {
      ...(name !== undefined ? { name } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(phone !== undefined ? { phone } : {}),
      updated_at: new Date()
    };

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateDoc },
      { returnDocument: 'after', projection: { password_hash: 0 } }
    );

    if (!result.value) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.value;
    res.json({ 
      success: true, 
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        bio: user.bio,
        profile_pic: user.profile_pic,
        created_at: user.created_at
      },
      message: "Profile updated successfully" 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
