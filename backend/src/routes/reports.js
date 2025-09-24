import express from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { ROLES } from "../utils/roles.js";
import { getCollection } from "../mongo.js";

import upload from "../middleware/upload.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// ------------------- ROUTES ------------------- //

// Get user reports
router.get(
	"/user/:id",
	authRequired,
	async (req, res) => {
		const { id } = req.params;

		// Users can only access their own reports, officers and analysts can access any
		if (req.user.role === 'citizen' && String(req.user.id) !== String(id)) {
			return res.status(403).json({ error: "Unauthorized" });
		}

		try {
			const reports = await getCollection('reports');
			const rows = await reports
				.find({ user_id: String(id) })
				.project({
					// project to match API contract
					id: '$_id',
					hazard_type: '$event_type',
					description: 1,
					latitude: 1,
					longitude: 1,
					location_name: 1,
					media_path: 1,
					status: 1,
					created_at: 1,
				})
				.sort({ created_at: -1 })
				.toArray();

			// Normalize id field
			const normalized = rows.map(r => ({
				...r,
				id: String(r.id || r._id),
				hazard_type: r.hazard_type || r.event_type,
			}));
			res.json(normalized);
		} catch (e) {
			console.error(e);
			res.status(500).json({ error: "Server error" });
		}
	}
);

// Create new report
router.post(
	"/",
	authRequired,
	requireRole(ROLES.CITIZEN, ROLES.OFFICER),
	upload.single("media"),
	async (req, res) => {
		try {
			const { event_type, description, latitude, longitude, location_name } =
				req.body;

			// if file exists, use Cloudinary secure_url
			const media_path = req.file ? req.file.path : null;

			const reports = await getCollection('reports');
			const now = new Date();
			const doc = {
				user_id: String(req.user.id),
				role_at_submission: req.user.role,
				event_type,
				description,
				latitude: latitude ? Number(latitude) : null,
				longitude: longitude ? Number(longitude) : null,
				location_name: location_name || null,
				media_path,
				status: 'submitted',
				created_at: now,
				updated_at: now,
			};
			const result = await reports.insertOne(doc);
			const inserted = { ...doc, id: String(result.insertedId), _id: undefined };
			res.status(201).json(inserted);
		} catch (e) {
			console.error(e);
			res.status(500).json({ error: "Server error" });
		}
	}
);

// Get all reports (for officers and analysts)
router.get("/", authRequired, async (req, res) => {
	try {
		// Only officers and analysts can access all reports
		if (!['officer', 'analyst'].includes(req.user.role)) {
			return res.status(403).json({ error: "Access denied. Officer or analyst role required." });
		}

		const reports = await getCollection('reports');
		const rows = await reports
			.find({})
			.project({
				id: '$_id',
				user_id: 1,
				role_at_submission: 1,
				hazard_type: '$event_type',
				description: 1,
				latitude: 1,
				longitude: 1,
				location_name: 1,
				media_path: 1,
				status: 1,
				created_at: 1,
			})
			.sort({ created_at: -1 })
			.toArray();
		const normalized = rows.map(r => ({
			...r,
			id: String(r.id || r._id),
			hazard_type: r.hazard_type || r.event_type,
		}));
		res.json(normalized);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Server error" });
	}
});

// Update report status
router.patch(
	"/:id/status",
	authRequired,
	async (req, res) => {
		const { id } = req.params;
		const { status } = req.body;

		// Only officers and analysts can update report status
		if (!['officer', 'analyst'].includes(req.user.role)) {
			return res.status(403).json({ error: "Access denied. Officer or analyst role required." });
		}

		if (!["verified", "rejected", "in_review", "submitted"].includes(status)) {
			return res.status(400).json({ error: "Invalid status" });
		}

		try {
			const reports = await getCollection('reports');
			const result = await reports.findOneAndUpdate(
				{ _id: new ObjectId(id) },
				{ $set: { status, updated_at: new Date() } },
				{ returnDocument: 'after' }
			);
			if (!result.value) return res.status(404).json({ error: 'Not found' });
			const out = { ...result.value, id: String(result.value._id) };
			res.json(out);
		} catch (e) {
			console.error(e);
			res.status(500).json({ error: "Server error" });
		}
	}
);

export default router;
