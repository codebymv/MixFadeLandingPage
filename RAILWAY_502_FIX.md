# Railway 502 Error Fix Guide

## Problem Analysis

The backend is successfully starting and passing health checks on Railway, but the frontend receives 502 errors when accessing the service. This indicates a **port binding mismatch** between what Railway expects and what the application is using.

### Key Observations from Logs:
- ✅ Backend starts successfully: "MixFade Landing Backend running on port 3001"
- ✅ Health check passes: "[1/1] Healthcheck succeeded!"
- ❌ Frontend gets 502 errors when accessing the service
- ⚠️ Environment shows "development" instead of "production"

## Root Cause

Railway automatically assigns a `PORT` environment variable, but the backend may not be using it correctly or the `NODE_ENV` isn't set to production, affecting the CORS configuration.

## Solution Steps

### 1. Backend Configuration Fix

#### A. Added Railway Configuration (`backend/railway.toml`)
```toml
[build]
command = "npm install --production"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

# Environment variables for production
[deploy.envs]
NODE_ENV = "production"
```

#### B. Enhanced Debugging in Backend
- Added PORT environment variable logging
- Enhanced root endpoint with debugging information
- Improved request logging for troubleshooting

### 2. Deployment Process

#### Step 1: Commit and Push Changes
```bash
cd backend
git add .
git commit -m "Fix Railway 502 error - add railway.toml and enhanced debugging"
git push origin main
```

#### Step 2: Verify Railway Environment
In Railway dashboard:
1. Go to your backend service
2. Check **Variables** tab
3. Ensure `NODE_ENV=production` is set
4. Verify `PORT` is automatically assigned by Railway

#### Step 3: Monitor Deployment Logs
After redeployment, check logs for:
- `🔧 PORT env var: [Railway assigned port]`
- `🌍 Environment: production`
- `✅ CORS: Allowing origin [frontend-domain]`

### 3. Testing the Fix

#### A. Test Backend Directly
```bash
# Test root endpoint
curl https://mixfade-backend-production.up.railway.app/

# Test health check
curl https://mixfade-backend-production.up.railway.app/health
```

#### B. Expected Response from Root Endpoint
```json
{
  "message": "MixFade Landing Backend API",
  "version": "1.0.0",
  "environment": "production",
  "port": "[Railway assigned port]",
  "timestamp": "2025-07-04T22:30:00.000Z",
  "endpoints": [
    "GET /health",
    "GET /api/health",
    "POST /api/email/collect",
    "POST /api/download/track",
    "GET /security/stats"
  ]
}
```

### 4. Frontend Configuration Verification

Ensure the frontend is configured correctly:

#### Check `frontend/railway.toml`
```toml
[deploy.envs]
NODE_ENV = "production"
VITE_API_URL = "https://mixfade-backend-production.up.railway.app"
```

## Troubleshooting

### If 502 Errors Persist:

1. **Check Railway Service Status**
   - Verify both services are "Active" in Railway dashboard
   - Check for any deployment failures

2. **Verify Port Configuration**
   - Backend logs should show Railway-assigned port, not 3001
   - Health check should pass on the correct port

3. **CORS Configuration**
   - Backend logs should show CORS allowing Railway domains
   - Frontend domain should match Railway deployment URL

4. **Environment Variables**
   - `NODE_ENV=production` in backend
   - `VITE_API_URL` pointing to correct backend URL in frontend

### Common Issues and Solutions:

| Issue | Symptom | Solution |
|-------|---------|----------|
| Port mismatch | 502 on all requests | Ensure `NODE_ENV=production` and redeploy |
| CORS blocking | 502 on preflight | Verify frontend domain in CORS config |
| Environment vars | Wrong API URL | Check Railway environment variables |
| Build failure | Service won't start | Check Railway build logs |

## Verification Checklist

- [ ] Backend shows `Environment: production` in logs
- [ ] Backend shows correct Railway-assigned port
- [ ] Health check passes at `/health`
- [ ] Root endpoint returns 200 with correct info
- [ ] Frontend uses production API URL
- [ ] CORS allows frontend domain
- [ ] No 502 errors in browser network tab

## Next Steps After Fix

1. **Test Email Collection**: Verify the main functionality works end-to-end
2. **Monitor Performance**: Check Railway metrics for response times
3. **Set Up Monitoring**: Consider adding uptime monitoring
4. **Security Review**: Ensure rate limiting and security features work in production

---

**Note**: The 502 error typically resolves once the backend is properly configured with `NODE_ENV=production` and redeployed. The health check passing indicates the service is running, but Railway's proxy needs the correct environment configuration to route requests properly.