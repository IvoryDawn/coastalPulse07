# pro0039 Backend (Node.js/Express + MongoDB)

## Setup
1. `cp .env.example .env` and fill values (JWT_SECRET, MONGODB_URI, MONGODB_DB, Cloudinary if used).
2. Ensure MongoDB is running locally or provide a MongoDB Atlas connection string.
3. Install deps: `npm install`.
4. Start: `npm run dev` (default port 4000).

### Required env vars
- `JWT_SECRET` (required)
- `MONGODB_URI` (default: mongodb://127.0.0.1:27017)
- `MONGODB_DB` (default: pro0039)
- `UPLOAD_DIR` (optional when using local storage)
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (optional)

## Endpoints
- `POST /api/auth/register` { name, email, password, role: citizen|officer|analyst }
- `POST /api/auth/login` { email, password } -> { token }
- `GET /api/reports` (Officer/Analyst)
- `GET /api/reports/user/:id` (owner, Officer, Analyst)
- `POST /api/reports` (Citizen/Officer, multipart/form-data: media optional)
- `PATCH /api/reports/:id/status` (Officer/Analyst)
- `GET /api/admin/metrics` (Analyst)
- `GET /api/profile/me|stats|reports` (Authenticated)
- `POST /api/profile/upload-picture` (Authenticated)

Uploads available at `/uploads/<filename>`.
