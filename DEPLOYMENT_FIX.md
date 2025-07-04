# MixFade Landing Page - Deployment Fix Guide

## Issue Summary
The frontend is experiencing "Failed to fetch" errors when trying to connect to the backend API. Analysis shows:

1. **502 errors on OPTIONS requests** - CORS preflight issues
2. **499 errors** - Client disconnection before server response
3. **Backend connectivity issues** - Service may need redeployment

## Root Cause
The frontend was defaulting to `localhost:3001` instead of the production backend URL, and the backend CORS configuration needed enhancement for Railway deployment.

## Changes Made

### 1. Frontend Configuration (`frontend/railway.toml`)
- Added `VITE_API_URL = "https://mixfade-backend-production.up.railway.app"` to environment variables
- Configured proper build and deployment settings

### 2. Backend CORS Enhancement (`backend/src/index.js`)
- **Enhanced CORS configuration** with debugging and explicit Railway domain support
- **Added explicit OPTIONS handler** for `/api/email/collect` endpoint
- **Added request logging** for better debugging
- **Improved error handling** for CORS requests

### 3. Documentation
- Created `.env.example` files for both frontend and backend
- Updated deployment documentation

## Current Status

### ✅ Completed
- [x] Frontend environment configuration
- [x] Backend CORS enhancement
- [x] Explicit preflight handling
- [x] Request logging and debugging
- [x] Documentation updates

### 🔄 Next Steps Required

#### 1. Redeploy Backend Service
The backend needs to be redeployed with the updated CORS configuration:

```bash
# In the backend directory
git add .
git commit -m "Fix CORS configuration for Railway deployment"
git push origin main
```

#### 2. Redeploy Frontend Service
The frontend needs to be redeployed with the updated environment variables:

```bash
# In the frontend directory
git add .
git commit -m "Update Railway configuration with production API URL"
git push origin main
```

#### 3. Verify Deployment
After redeployment, test the following:

1. **Backend Health Check**:
   ```bash
   curl https://mixfade-backend-production.up.railway.app/health
   ```

2. **CORS Preflight Test**:
   ```bash
   curl -X OPTIONS https://mixfade-backend-production.up.railway.app/api/email/collect \
     -H "Origin: https://your-frontend-domain.up.railway.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type"
   ```

3. **Frontend API Configuration**:
   - Check browser network tab - should see requests to `mixfade-backend-production.up.railway.app`
   - No more `localhost:3001` requests

## Environment Variables

### Backend (Railway)
- `PORT` - Automatically set by Railway
- `NODE_ENV=production`
- `SHOPIFY_SHOP_DOMAIN` - (optional)
- `SHOPIFY_ACCESS_TOKEN` - (optional)
- `SHOPIFY_API_VERSION=2024-01` - (optional)

### Frontend (Railway)
- `NODE_ENV=production`
- `VITE_API_URL=https://mixfade-backend-production.up.railway.app` (now configured in railway.toml)

## Testing Commands

### Test Backend Health
```bash
node test-production-backend.js
```

### Test CORS Configuration
```bash
node test-cors-fix.js
```

### Test Frontend Configuration
Open `test-frontend-config.html` in a browser to verify API URL configuration.

## Technical Details

### CORS Configuration
The backend now accepts requests from:
- `https://mixfade.app` and `https://www.mixfade.app` (production domains)
- Any `*.up.railway.app` domain (Railway deployments)
- Local development domains (in development mode)

### Security Features
- Rate limiting on email collection (3 requests per 15 minutes)
- Input sanitization and validation
- Security monitoring and logging
- Request size limits (10KB max)

### Debugging Features
- Enhanced CORS logging with origin tracking
- Request logging for all API endpoints
- Explicit OPTIONS request handling
- Detailed error messages in development

## Troubleshooting

### If CORS errors persist:
1. Check Railway logs for CORS debug messages
2. Verify the frontend domain matches Railway deployment URL
3. Ensure both services are redeployed with latest changes

### If 502/499 errors continue:
1. Check Railway service status
2. Verify environment variables are set correctly
3. Check Railway deployment logs for startup errors

### If frontend still uses localhost:
1. Verify `VITE_API_URL` is set in Railway environment
2. Redeploy frontend service
3. Clear browser cache and test again

## Next Actions

1. **Immediate**: Redeploy both backend and frontend services on Railway
2. **Verify**: Test email collection functionality end-to-end
3. **Monitor**: Check Railway logs for any remaining issues
4. **Optimize**: Fine-tune rate limiting and security settings based on usage

---

**Note**: The backend service appears to be unresponsive during testing, which suggests it may need redeployment or there could be Railway service issues. The CORS configuration has been enhanced to handle the reported errors once the service is properly deployed.