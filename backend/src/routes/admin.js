import express from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';
import { getCollection } from '../mongo.js';

const router = express.Router();


router.get('/metrics', authRequired, requireRole(ROLES.ANALYST), async (req, res) => {
  const reports = await getCollection('reports');

  const [total, byStatusAgg, byEventAgg] = await Promise.all([
    reports.estimatedDocumentCount(),
    reports.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]).toArray(),
    reports.aggregate([
      { $group: { _id: '$event_type', count: { $sum: 1 } } },
      { $project: { event_type: '$_id', count: 1, _id: 0 } }
    ]).toArray()
  ]);

  res.json({
    totals: Number(total),
    byStatus: byStatusAgg,
    byEvent: byEventAgg,
   
    placeholders: {
      socialTrends: true,
      sentiment: true,
      hotspots: true
    }
  });
});

export default router;
