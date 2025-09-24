import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';
import weatherRoutes from './routes/weather.js';
import speechRoutes from './routes/speech.js';
import profileRoutes from './routes/profile.js';
import verificationRoutes from './routes/verification.js';
// import translateRoute from "./routes/translate.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: function (origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static for uploaded media (serve absolute path regardless of cwd)
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const staticUploadsDir = path.isAbsolute(uploadDir)
  ? uploadDir
  : path.join(__dirname, '..', uploadDir);
app.use('/uploads', express.static(staticUploadsDir));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/verification', verificationRoutes);

// ✅ Social Media Trends API
app.get("/api/social", (_req, res) => {
  if (Math.random() > 0.9) {
    const newPosts = [
      "🌊 Unusual high tide observed at Marina Beach, Chennai",
      "⚠️ Coast guard issues small craft advisory for west coast",
      "🐟 Fishermen report rough seas off Kochi coast",
      "📢 Weather department warns of possible storm surge in Odisha",
      "🚨 Emergency services on high alert for coastal Karnataka",
      "🌪️ Cyclonic circulation detected in Bay of Bengal",
      "💨 Strong winds and choppy seas reported near Vishakhapatnam",
      "🏖️ Beach erosion noticed after recent high tides in Goa"
    ];
    res.json({ posts: newPosts });
  } else {
    res.json({ posts: [] });
  }
});

// Root
app.get('/', (req, res) => {
  res.json({ ok: true, name: 'pro0039-backend', message: 'Disaster reporting API running.' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

export default app;
