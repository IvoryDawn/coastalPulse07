import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      res.json({
        temp: data.main.temp,
        condition: data.weather[0].description,
        wind: data.wind.speed,
      });
    } else {
      res.status(response.status).json({ error: data.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

export default router;
