
import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { SarvamAIClient } from 'sarvamai';  

dotenv.config();
const router = express.Router();

const translateLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
router.use('/translate', translateLimiter);


const client = new SarvamAIClient({
  api_subscription_key: process.env.SARVAM_API_KEY,
});


function validateTranslateBody(req, res, next) {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'text and targetLang required' });
  }
  next();
}

router.post('/translate', validateTranslateBody, async (req, res) => {
  const { text, targetLang, sourceLang } = req.body;

  try {
    
    const result = await client.text.translate({
      input: text,
      target_language_code: targetLang,     
      source_language_code: sourceLang || 'auto',
      model: 'sarvam-translate:v1',
    });

    return res.json({
      translatedText: result.translated_text,
      sourceLanguage: result.source_language_code,
    });
  } catch (err) {
    console.error('Translate error:', err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    const message = err?.response?.data || 'Translation failed';
    return res.status(status).json({ error: message });
  }
});

export default router;
