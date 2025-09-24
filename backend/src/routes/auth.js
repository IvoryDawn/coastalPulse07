import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCollection } from '../mongo.js';
import { ROLES } from '../utils/roles.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', upload.single("profile_pic"), async (req, res) => {
  try {
    const { name, email, password, role, location, phone, bio } = req.body;
    const normalizedRole = role?.toLowerCase();

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (![ROLES.CITIZEN, ROLES.OFFICER, ROLES.ANALYST].includes(normalizedRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const users = await getCollection('users');

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);

    let profilePicPath = null;
    if (req.file) {
      profilePicPath = req.file.path || req.file.secure_url; // Cloudinary gives secure_url
    }

    const userDoc = {
      name,
      email: email.toLowerCase(),
      password_hash: hash,
      role: normalizedRole,
      location: location || null,
      phone: phone || null,
      bio: bio || null,
      profile_pic: profilePicPath,
      created_at: new Date(),
      updated_at: new Date()
    };

    const insertRes = await users.insertOne(userDoc);

    const out = {
      id: insertRes.insertedId,
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      location: userDoc.location,
      phone: userDoc.phone,
      bio: userDoc.bio,
      profile_pic: userDoc.profile_pic
    };

    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await getCollection('users');
    const user = await users.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: String(user._id), role: user.role, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        bio: user.bio,
        profile_pic: user.profile_pic
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
