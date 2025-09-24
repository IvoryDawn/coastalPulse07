
import { SarvamAIClient } from 'sarvamai';

const client = new SarvamAIClient({
  api_subscription_key: process.env.SARVAM_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, targetLanguage, sourceLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'text and targetLanguage are required' });
  }

  try {
    const result = await client.text.translate({
      input: text,
      target_language_code: targetLanguage,   
      source_language_code: sourceLanguage || 'auto', 
      model: 'sarvam-translate:v1',
    });

    
    res.status(200).json({
      translatedText: result.translated_text,
      sourceLanguage: result.source_language_code,
    });
  } catch (error) {
    console.error('Translation error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Translation failed' });
  }
}
