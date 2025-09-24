import express from 'express';
import multer from 'multer';

const router = express.Router();

// Use memory storage for transient audio uploads
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/speech/transcribe
// Accepts multipart/form-data with field name 'audio' and optional 'language'
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Missing audio file in field "audio"' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(501).json({ error: 'Transcription provider not configured (missing OPENAI_API_KEY)' });
    }

    // Prepare multipart form for OpenAI Whisper API
    const form = new FormData();
    form.append('model', 'whisper-1');
    if (req.body.language) form.append('language', req.body.language);
    // Note: Blob-like from buffer
    const fileName = req.file.originalname || `audio-${Date.now()}.webm`;
    form.append('file', new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/webm' }), fileName);

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: form
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || data });
    }
    return res.json({ text: data.text || '' });
  } catch (err) {
    const status = err?.response?.status || 500;
    const message = err?.response?.data || err.message;
    console.error('Transcription error:', message);
    return res.status(status).json({ error: 'Transcription failed', details: message });
  }
});

export default router;


