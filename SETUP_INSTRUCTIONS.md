# Setup Instructions for Report Verification System

## Environment configuration

Create `backend/.env` with at least:

```bash
JWT_SECRET=replace-with-a-strong-secret
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=pro0039
```

If using Cloudinary, also set:

```bash
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Install and run

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in a new terminal)
cd ../frontend
npm install
npm run dev
```

## Test API Endpoints

```bash
# From the root directory
node test-api.js
```

Or visit `http://localhost:4000/api/health` in a browser.

## Troubleshooting

- Check backend health: `http://localhost:4000/api/health`
- Verify verification routes: `http://localhost:4000/api/verification/test`
- Ensure MongoDB is running and `MONGODB_URI`/`MONGODB_DB` are correct
- See backend console for any connection or query errors

## Current Status

- ✅ Backend API routes are registered
- ✅ Frontend components are created
- ✅ Verification workflow works with MongoDB

## Next Steps

- Add alerting and notifications collections when needed
- Implement audit logging as a follow-up feature
