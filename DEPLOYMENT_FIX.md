# MixFade Deployment Fix Guide

## Issue Summary
The frontend was trying to connect to `localhost:3001` instead of the production backend URL, causing "Failed to fetch" errors.

## Changes Made

### 1. Frontend Configuration (`frontend/railway.toml`)
- Added `VITE_API_URL = "https://mixfade-backend-production.up.railway.app"` to environment variables
- This ensures the frontend connects to the production backend instead of localhost

### 2. Backend CORS Configuration (`backend/src/index.js`)
- Updated CORS to allow Railway domains: `/\.up\.railway\.app$/`
- Added `/api/health` endpoint for frontend compatibility

### 3. Environment Documentation
- Created `.env.example` files for both frontend and backend
- Documents required environment variables for development

## Deployment Steps

### Step 1: Deploy Backend
1. Navigate to your Railway dashboard
2. Find the `mixfade-backend-production` service
3. Trigger a new deployment (the code changes will be picked up automatically)
4. Wait for deployment to complete
5. Check logs to ensure no errors

### Step 2: Deploy Frontend
1. Navigate to your Railway dashboard
2. Find the frontend service
3. Trigger a new deployment
4. The new `VITE_API_URL` environment variable will be used
5. Wait for deployment to complete

### Step 3: Verify Fix
1. Visit your frontend URL
2. Try the email collection feature
3. Check browser network tab - should see requests to `mixfade-backend-production.up.railway.app`
4. No more "Failed to fetch" or "ERR_CONNECTION_REFUSED" errors

## Environment Variables Needed

### Backend (Railway)
- `NODE_ENV=production` (should be set automatically)
- `PORT` (set automatically by Railway)
- Optional: Shopify credentials if using email integration

### Frontend (Railway)
- `NODE_ENV=production` (set automatically)
- `VITE_API_URL=https://mixfade-backend-production.up.railway.app` (now configured in railway.toml)

## Testing
After deployment, you can test the backend directly:
```bash
curl https://mixfade-backend-production.up.railway.app/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-07-04T21:55:42.109Z",
  "service": "MixFade Landing Backend"
}
```

## Notes
- The backend now accepts requests from any `*.up.railway.app` domain
- Both `/health` and `/api/health` endpoints are available
- Local development still works with `localhost:3001` fallback
- All security middleware and rate limiting remain active