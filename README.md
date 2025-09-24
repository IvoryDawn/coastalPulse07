# pro0039 — Unified Ocean Hazard Platform (Starter)

Stack: **React (Vite + Tailwind)**, **Node.js/Express**, **MongoDB**

## Features implemented now
- Role-based auth (Citizen, Officer, Analyst) with JWT
- Report submission (geotag + media upload), list & verify (Officer/Analyst)
- Interactive map (Leaflet) to view reports
- Live dashboard (basic counts) & social trends placeholder
- Weather trends placeholder on Home
- Clean, ocean-themed UI with grid layout and rounded cards

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env  # set JWT_SECRET, MONGODB_URI, MONGODB_DB
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Next integrations
- Real weather API on Home
- NLP pipeline for social media trends
- Hotspot clustering on the map
- Internationalization (i18n)
- File size/type validation & cloud storage for media
- Rate limiting & audit logging
